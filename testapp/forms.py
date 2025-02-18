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
            "toppings": forms.CheckboxSelectMultiple(),
            "cheese": forms.Select(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super(PizzaForm, self).__init__(*args, **kwargs)
        self.fields["toppings"].choices = self.fields["toppings"].choices.choices


class PizzaFormNonModel(forms.Form):
    cheese_choices = (
        ('mozzarella', 'Mozzarella'),
        ('provolone', 'Provolone'),
        ('cheddar', 'Cheddar'),
        ('ricotta', 'Ricotta')
    )

    toppings_choices = (
        ('pepperoni', 'Pepperoni'),
        ('sausage', 'Sausage'),
        ('olives', 'Olives'),
        ('spinach', 'Spinach'),
        ('mushrooms', 'Mushrooms'),
        ('bacon', 'Bacon'),
        ('bell pepper', 'Bell Pepper'),
        ('onions', 'Onions'),
        ('cheese', 'Cheese'),
        ('pineapple', 'Pineapple'),
    )

    name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', "placeholder": "Pizza name"}))
    toppings = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple(attrs={"class": "form-check"}), choices=toppings_choices)
    cheese = forms.ChoiceField(widget=forms.Select(attrs={"class": "form-select"}), choices=cheese_choices)
