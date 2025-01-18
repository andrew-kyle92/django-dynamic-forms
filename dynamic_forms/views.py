import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from django.conf import settings

from .forms import FormModelForm

from .view_methods import get_form_fields


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
    template = "dynamic_forms/base_form.html"

    def get(self, request, *args, **kwargs):
        form = FormModelForm()
        context = {
            'title': self.title,
            'form': form,
        }
        return render(request, self.template, context)

    def post(self, request, *args, **kwargs):
        pass


# ********** Fetch Requests **********
def get_form(request):
    field = request.GET.get("field", None)
    if field is not None:
        form = get_form_fields(field)
        return JsonResponse({"form": form})
    else:
        return JsonResponse({"form": None, "error": "No field found"})


def save_form(request):
    if request.method == "POST":
        form_data = json.loads(request.body)
        print(form_data)
        return JsonResponse({"success": True})
