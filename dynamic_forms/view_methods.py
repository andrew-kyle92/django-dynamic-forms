from django.forms import modelformset_factory

from .forms import (TextInputField, TextAreaField, EmailInputField, DateInputField, DateTimeInputField, DropDownField,
                    MultipleDropDownField, IntegerInputField, DecimalInputField, FileInputField, RadioInputField,
                    CheckBoxInputField)


def get_form_fields(field):
    forms = {
        "text_input": TextInputField,
        "text_area": TextAreaField,
        "email_input": EmailInputField,
        "date_input": DateInputField,
        "datetime_input": DateTimeInputField,
        "dropdown_input": DropDownField,
        "multiple_dropdown_input": MultipleDropDownField,
        "integer_input": IntegerInputField,
        "decimal_input": DecimalInputField,
        "checkbox_input": CheckBoxInputField,
        "radio_input": RadioInputField,
        "file_input": FileInputField,
    }

    return forms[field]
