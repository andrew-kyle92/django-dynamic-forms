from django.shortcuts import render
from django.views import View

from .forms import FormModelForm


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

    def get(self, request):
        form = FormModelForm()
        context = {
            'title': self.title,
            'form': form,
        }
        return render(request, self.template, context)
