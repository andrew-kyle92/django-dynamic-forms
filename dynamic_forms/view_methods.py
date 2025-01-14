import json


from .forms import (TextInputField, TextAreaField, EmailInputField, DateInputField, DateTimeInputField, DropDownField,
                    MultipleDropDownField, IntegerInputField, DecimalInputField, FileInputField, RadioInputField,
                    CheckBoxInputField, FormRowForm, DividerLineForm, SectionHeaderForm, TextBlockForm,
                    CollapsibleSectionForm, ColumnForm)


def get_form_fields(field):
    forms = {
        # form input forms
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
        # form section forms
        "form_row": FormRowForm,
        "divider_line": DividerLineForm,
        "section_header": SectionHeaderForm,
        "text_block": TextBlockForm,
        "collapsible_section": CollapsibleSectionForm,
        "column": ColumnForm,
    }

    # getting the html fields for each field
    fields = {}
    form = forms[field]()
    for field in form:
        fields[field.html_name] = {
            "label": field.label,
            "input": field.as_widget(),
            "helpText": field.help_text,
        }

    return json.dumps(fields)
