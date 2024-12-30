from django import forms
from django.apps import apps
from django.forms import modelformset_factory, ModelForm
from django.conf import settings

from .models import (TextInput, TextAreaInput, EmailInput, DateInput, DateTimeInput, DropDownInput,
                     MultipleSelectDropDownInput, IntegerInput, DecimalInput, CheckboxInput, RadioInput,
                     FileInput, FormModel)


class TextInputField(ModelForm):
    class Meta:
        model = TextInput
        fields = '__all__'


class TextAreaField(ModelForm):
    class Meta:
        model = TextAreaInput
        fields = '__all__'


class EmailInputField(ModelForm):
    class Meta:
        model = EmailInput
        fields = '__all__'


class DateInputField(ModelForm):
    class Meta:
        model = DateInput
        fields = '__all__'


class DateTimeInputField(ModelForm):
    class Meta:
        model = DateTimeInput
        fields = '__all__'


class DropDownField(ModelForm):
    class Meta:
        model = DropDownInput
        fields = '__all__'


class MultipleDropDownField(ModelForm):
    class Meta:
        model = MultipleSelectDropDownInput
        fields = '__all__'


class IntegerInputField(ModelForm):
    class Meta:
        model = IntegerInput
        fields = '__all__'


class DecimalInputField(ModelForm):
    class Meta:
        model = DecimalInput
        fields = '__all__'


class FileInputField(ModelForm):
    class Meta:
        model = FileInput
        fields = '__all__'


class RadioInputField(ModelForm):
    class Meta:
        model = RadioInput
        fields = '__all__'


class CheckBoxInputField(ModelForm):
    class Meta:
        model = CheckboxInput
        fields = '__all__'


def get_model_choices():
    all_apps = settings.FORM_APPS
    choices = {"": "---------"}
    for app in all_apps:
        app_models = apps.all_models.get(app)
        choices[app] = {app_models[model].__name__: app_models[model].__name__ for model in app_models}
    return choices


class FormModelForm(ModelForm):
    class Meta:
        model = FormModel
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'for_table': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'table': forms.Select(attrs={'class': 'form-select'}, choices=get_model_choices),
        }

    def __init__(self, *args, **kwargs):
        super(FormModelForm, self).__init__(*args, **kwargs)
        self.fields['table'].choices = get_model_choices()


TextInputFormSet = modelformset_factory(TextInput, form=TextInputField, extra=1, can_delete=True)
TextAreaFormSet = modelformset_factory(TextAreaInput, form=TextAreaField, extra=1, can_delete=True)
EmailInputFormSet = modelformset_factory(EmailInput, form=EmailInputField, extra=1, can_delete=True)
DateInputFormSet = modelformset_factory(DateInput, form=DateInputField, extra=1, can_delete=True)
DateTimeInputFormSet = modelformset_factory(DateTimeInput, form=DateTimeInputField, extra=1, can_delete=True)
DropDownFormSet = modelformset_factory(DropDownInput, form=DropDownField, extra=1, can_delete=True)
MultipleDropDownFormSet = modelformset_factory(MultipleSelectDropDownInput, MultipleDropDownField, extra=1, can_delete=True)
IntegerInputFormSet = modelformset_factory(IntegerInput, form=IntegerInputField, extra=1, can_delete=True)
DecimalInputFormSet = modelformset_factory(DecimalInput, form=DecimalInputField, extra=1, can_delete=True)
FileInputFormSet = modelformset_factory(FileInput, form=FileInputField, extra=1, can_delete=True)
RadioInputFormSet = modelformset_factory(RadioInput, form=RadioInputField, extra=1, can_delete=True)
CheckBoxFormSet = modelformset_factory(CheckboxInput, form=CheckBoxInputField, extra=1, can_delete=True)
