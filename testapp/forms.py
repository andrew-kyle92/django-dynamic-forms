from django.forms import ModelForm

from testapp.models import Fruits, Pizza

from dynamic_forms.registry import register_model_form


@register_model_form
class FruitsForm(ModelForm):
    class Meta:
        model = Fruits
        fields = '__all__'


@register_model_form
class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = '__all__'
