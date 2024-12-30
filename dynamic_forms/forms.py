from django import forms
from django.forms import modelformset_factory

from .models import *


class TextInputField(forms.ModelForm):
    class Meta:
        model = TextInput
        fields = '__all__'


class TextAreaField(forms.ModelForm):
    class Meta:
        model = TextAreaInput
        fields = '__all__'


class EmailInputField(forms.ModelForm):
    class Meta:
        model = EmailInput
        fields = '__all__'


class DateInputField(forms.ModelForm):
    class Meta:
        model = DateInput
        fields = '__all__'


class DateTimeInputField(forms.ModelForm):
    class Meta:
        model = DateTimeInput
        fields = '__all__'


class DropDownField(forms.ModelForm):
    class Meta:
        model = DropDownInput
        fields = '__all__'


class MultipleDropDownField(forms.ModelForm):
    class Meta:
        model = MultipleSelectDropDownInput
        fields = '__all__'


class IntegerInputField(forms.ModelForm):
    class Meta:
        model = IntegerInput
        fields = '__all__'


class DecimalInputField(forms.ModelForm):
    class Meta:
        model = DecimalInput
        fields = '__all__'


class FileInputField(forms.ModelForm):
    class Meta:
        model = FileInput
        fields = '__all__'


class RadioInputField(forms.ModelForm):
    class Meta:
        model = RadioInput
        fields = '__all__'


class CheckBoxInputField(forms.ModelForm):
    class Meta:
        model = CheckboxInput
        fields = '__all__'


class FormModelForm(forms.ModelForm):
    class Meta:
        model = FormModel
        fields = '__all__'


TextInputFormSet = modelformset_factory(TextInput, form=TextInputField, extra=1, can_delete=True)
TextAreaFormSet = modelformset_factory(TextAreaInput, form=TextAreaField, extra=1, can_delete=True)
EmailInputFormSet = modelformset_factory(EmailInput, form=EmailInputField, extra=1, can_delete=True)
DateInputFormSet = modelformset_factory(DateInput, form=DateInputField, extra=1, can_delete=True)
DateTimeInputFormSet = modelformset_factory(DateTimeInput, form=DateTimeInputField, extra=1, can_delete=True)
DropDownFormSet = modelformset_factory(DropDownInput, form=DropDownField, extra=1, can_delete=True)
MultipleDropDownFormSet = modelformset_factory(MultipleDropDownField, MultipleDropDownField, extra=1, can_delete=True)
IntegerInputFormSet = modelformset_factory(IntegerInput, form=IntegerInputField, extra=1, can_delete=True)
DecimalInputFormSet = modelformset_factory(DecimalInput, form=DecimalInputField, extra=1, can_delete=True)
FileInputFormSet = modelformset_factory(FileInput, form=FileInputField, extra=1, can_delete=True)
RadioInputFormSet = modelformset_factory(RadioInput, form=RadioInputField, extra=1, can_delete=True)
CheckBoxFormSet = modelformset_factory(CheckboxInput, form=CheckBoxInputField, extra=1, can_delete=True)
