from django.forms import ModelForm, forms
from django import forms

from testapp.models import Fruits, Pizza

from dynamic_forms.registry import register_model_form


@register_model_form
class FruitsForm(ModelForm):
    class Meta:
        model = Fruits
        fields = '__all__'
        widgets = {
            "name": forms.TextInput(attrs={'class': 'form-control'}),
        }


@register_model_form
class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = '__all__'
        widgets = {
            "name": forms.TextInput(attrs={'class': 'form-control'}),
            "toppings": forms.Textarea(attrs={'class': 'form-control', "rows": 5}),
        }
