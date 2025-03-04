from django import forms

from dynamic_forms.registry import register_model_form

from testapp2.models import Member, Cars


@register_model_form
class MembersForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = '__all__'


@register_model_form
class CarsForm(forms.ModelForm):
    class Meta:
        model = Cars
        fields = '__all__'
