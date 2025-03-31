import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView

from testapp.forms import PizzaFormNonModel
from .forms import FormModelForm
from .models import FormModel

from .view_methods import *

from .utils.form_utils import FormUtils


class IndexView(View):
    title = "Home"
    template = "dynamic_forms/index.html"

    def get(self, request):
        context = {
            'title': self.title,
        }
        return render(request, self.template, context)


class FormBuilderView(View):
    title = "New Form"
    template = "dynamic_forms/form_builder.html"

    def get(self, request, *args, **kwargs):
        form = FormModelForm()
        context = {
            'title': self.title,
            'form': form,
            'existing_form': False,
        }
        return render(request, self.template, context)

    def post(self, request, *args, **kwargs):
        pass


class FormListView(ListView):
    template_name = "dynamic_forms/forms_list.html"
    model = FormModel
    ordering = ["-created"]

    def get_context_data(self, **kwargs):
        context = super(FormListView, self).get_context_data(**kwargs)
        context["title"] = "All Forms"

        return context


class EditFormView(View):
    template = "dynamic_forms/form_builder.html"

    def get(self, request, form_id, *args, **kwargs):
        # getting the form instance
        instance = FormModel.objects.get(form_id=form_id)
        # initializing the form instance
        form = FormModelForm(instance=instance)

        context = {
            'title': instance.name,
            'form': form,
            'existing_form': True,
        }
        return render(request, self.template, context)


class RenderFormView(View):
    template = "dynamic_forms/base_form.html"
    title = "Form"

    def get(self, request, form_id, *args, **kwargs):
        form_utils = FormUtils()
        form = form_utils.build_form_for_render(form_id)
        context = {
            'title': self.title,
            'form': form,
        }
        return render(request, self.template, context)


# ********** Fetch Requests **********
def get_form(request):
    # getting form body data
    form_data = json.loads(request.body)
    # initializing form_utils
    form_utils = FormUtils()
    field = form_data["field"]
    exists = form_data["exists"]
    input_id = form_data["inputId"]
    initial = form_data["initial"]
    if initial == "false" or initial is None:
        initial = None
    # else:
    #     initial = json.loads(initial)
    if field is not None:
        form = form_utils.get_form_fields(field=field, exists=exists, input_id=input_id, initial=initial)
        return JsonResponse({"form": form})
    else:
        return JsonResponse({"form": None, "error": "No field found"})


def get_model_form(request):
    # initialize FormUtils
    form_utils = FormUtils()
    # getting model name from url params
    model_name = request.GET.get("modelName", None)
    if model_name is not None:
        try:
            model_form = form_utils.get_model_form(model_name=model_name)
            form_fields = form_utils.get_form_fields(field=model_name, exists=False, app_model=True, model_form=model_form)
            print(form_fields)
            context = {
                "formFields": form_fields,
            }
            return JsonResponse(context, safe=True)
        except Exception as e:
            return JsonResponse({"error": str(e)})
    else:
        return JsonResponse({"error": "No model found"})


def save_form(request):
    if request.method == "POST":
        form_utils = FormUtils()
        form_data = json.loads(request.body)
        try:
            main_form = form_utils.save_form_to_db(form_data)
            return JsonResponse({"res": "success", "form_id": main_form.form_id})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})


def get_form_layout(request):
    form_id = request.GET.get("form_id", None)
    if form_id:
        instance = FormModel.objects.get(form_id=form_id)
        return JsonResponse({"res": "success", "layout": instance.layout}, status=200)
    else:
        return JsonResponse({"res": "error", "layout": None}, status=200)
