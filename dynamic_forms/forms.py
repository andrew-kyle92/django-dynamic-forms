from django import forms
from django.apps import apps
from django.forms import modelformset_factory, ModelForm
from django.conf import settings

from .models import (TextInput, TextAreaInput, EmailInput, DateInput, DateTimeInput, DropDownInput,
                     MultipleSelectDropDownInput, IntegerInput, DecimalInput, CheckboxInput, RadioInput,
                     FileInput, FormModel, FormRow, DividerLine, SectionHeader, TextBlock, CollapsibleSection)


# ***** Form Field Forms *****
class TextInputField(ModelForm):
    class Meta:
        model = TextInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TextInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class TextAreaField(ModelForm):
    class Meta:
        model = TextAreaInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TextAreaField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class EmailInputField(ModelForm):
    class Meta:
        model = EmailInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(EmailInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class DateInputField(ModelForm):
    class Meta:
        model = DateInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(DateInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class DateTimeInputField(ModelForm):
    class Meta:
        model = DateTimeInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(DateTimeInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class DropDownField(ModelForm):
    class Meta:
        model = DropDownInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(DropDownField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class MultipleDropDownField(ModelForm):
    class Meta:
        model = MultipleSelectDropDownInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MultipleDropDownField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class IntegerInputField(ModelForm):
    class Meta:
        model = IntegerInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(IntegerInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class DecimalInputField(ModelForm):
    class Meta:
        model = DecimalInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(DecimalInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class FileInputField(ModelForm):
    class Meta:
        model = FileInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(FileInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class RadioInputField(ModelForm):
    class Meta:
        model = RadioInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(RadioInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class CheckBoxInputField(ModelForm):
    class Meta:
        model = CheckboxInput
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CheckBoxInputField, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


# Form Sections Forms
class FormRowForm(ModelForm):
    class Meta:
        model = FormRow
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(FormRowForm, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class DividerLineForm(ModelForm):
    class Meta:
        model = DividerLine
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(DividerLineForm, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class SectionHeaderForm(ModelForm):
    class Meta:
        model = SectionHeader
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(SectionHeaderForm, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class TextBlockForm(ModelForm):
    class Meta:
        model = TextBlock
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(TextBlockForm, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


class CollapsibleSectionForm(ModelForm):
    class Meta:
        model = CollapsibleSection
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(CollapsibleSectionForm, self).__init__(*args, **kwargs)

        for visible in self.visible_fields():
            # adding valueChanged dataset attribute
            visible.field.widget.attrs["data-value-changed"] = "false"

            if visible.widget_type == "text" or visible.widget_type == "number":
                visible.field.widget.attrs["class"] = "form-control"
            elif visible.widget_type == "date":
                visible.field.widget = forms.DateInput(attrs={"class": "form-control", "type": "date"})
            elif visible.widget_type == "datetime":
                visible.field.widget = forms.DateTimeInput(attrs={"class": "form-control", "type": "datetime"})
            elif visible.widget_type == "select" or visible.widget_type == "nullbooleanselect":
                visible.field.widget.attrs["class"] = "form-select"
            elif visible.widget_type == "textarea":
                visible.field.widget.attrs["class"] = "form-control"
                visible.field.widget.attrs["rows"] = 5
            elif visible.widget_type == "checkbox":
                visible.field.widget.attrs["class"] = "form-check-input"


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


# Form Input FormSets
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

# Form Section FormSets
FormRowFormSet = modelformset_factory(FormRow, form=FormRowForm, extra=1, can_delete=True)
DividerLineFormSet = modelformset_factory(DividerLine, form=DividerLineForm, extra=1, can_delete=True)
SectionHeaderFormSet = modelformset_factory(SectionHeader, form=SectionHeaderForm, extra=1, can_delete=True)
TextBlockFormSet = modelformset_factory(TextBlock, form=TextBlockForm, extra=1, can_delete=True)
CollapsibleSectionFormSet = modelformset_factory(CollapsibleSection, form=CollapsibleSectionForm, extra=1, can_delete=True)
