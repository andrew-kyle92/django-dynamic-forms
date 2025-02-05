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
            "name": forms.TextInput(attrs={'class': 'form-control', "placeholder": "Fruit name"}),
        }


@register_model_form
class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = '__all__'
        widgets = {
            "name": forms.TextInput(attrs={'class': 'form-control', "placeholder": "Pizza name"}),
            "toppings": forms.CheckboxSelectMultiple(attrs={'class': 'form-control'}),
            "cheese": forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super(PizzaForm, self).__init__(*args, **kwargs)
        # self.fields['toppings']['choices']['blank_choice'] = None
