from django.apps import apps

from dynamic_forms.forms import (TextInputField, TextAreaField, EmailInputField, DateInputField, DateTimeInputField,
                                 DropDownField,
                                 MultipleDropDownField, IntegerInputField, DecimalInputField, FileInputField,
                                 RadioInputField,
                                 CheckBoxInputField, FormRowForm, DividerLineForm, SectionHeaderForm, TextBlockForm,
                                 CollapsibleSectionForm)

from dynamic_forms.models import *

import json


class FormUtils:

    @staticmethod
    def get_model(field):
        _models = {
            # form input forms
            "text_input": TextInput,
            "text_area": TextAreaInput,
            "email_input": EmailInput,
            "date_input": DateInput,
            "datetime_input": DateTimeInput,
            "dropdown_input": DropDownInput,
            "multiple_dropdown_input": MultipleSelectDropDownInput,
            "integer_input": IntegerInput,
            "decimal_input": DecimalInput,
            "checkbox_input": CheckboxInput,
            "radio_input": RadioInput,
            "file_input": FileInput,
            # form section forms
            "form_row": FormRow,
            "divider_line": DividerLine,
            "section_header": SectionHeader,
            "text_block": TextBlock,
            "collapsible_section": CollapsibleSection,
        }
        return _models[field].__name__

    @staticmethod
    def get_form_fields(field):
        _forms = {
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
        }

        # getting the html fields for each field
        fields = {}
        form = _forms[field]()
        for field in form:
            fields[field.html_name] = {
                "label": field.label,
                "input": field.as_widget(),
                "helpText": field.help_text,
            }

        return json.dumps(fields)

    def create_json_field(self, field, value):
        pass

    def save_form_to_db(self, form_data):
        # creating the main form.
        main_form = self.save_instance(form_data=self.set_model_data(form_data=form_data), model_name="FormModel", main_form=True)

        # creating inputs and saving to the database
        for key, value in form_data["formObjects"].items():
            obj = self.save_instance(form_data=self.set_model_data(form_data=value, form=main_form, order=key), model_name=self.get_model(value["inputType"]), main_form=False)
            if len(value["children"]) > 0:
                order = 0
                for child in value["children"]:
                    self.save_instance(form_data=self.set_model_data(form_data=child, form=main_form, order=order, parent_section_id=obj.input_id), model_name=self.get_model(child["inputType"]), main_form=False)
                    order += 1

    @staticmethod
    def set_model_data(form_data, form=None, **kwargs):
        """
        :param form: ModelInstance
        :param form_data: dict
        :return:
        key/value data formatted for saving to an input or form modal
        """
        # breaking up the sections of the data
        is_main_form = True if form_data.get("inputType") == "main_form" else False
        model_data = {}

        # determining if the model data is the main form or input item
        if is_main_form:
            model_data["form_id"] = form_data["id"]
        else:
            model_data["input_id"] = form_data["id"]

        # setting required field to either True or False
        # the formdata retrieved from JavaScript sets a checkbox's value to 'on' when checked
        if form_data["formData"].get("required", False):
            required_field = form_data["formData"]["required"]
            if required_field == "on" or required_field == "":
                if required_field == "on":
                    form_data["formData"]["required"] = True
                else:
                    form_data["formData"]["required"] = False

        for key, value in form_data["formData"].items():
            if key == "order" and kwargs.get("order"):
                model_data[key] = kwargs.get("order")  # maintains the order of the inputs
            elif key == "form" and form is not None:
                model_data[key] = form
            elif key == "input_id":
                if value == '':
                    model_data[key] = form_data["id"]
                else:
                    model_data[key] = value
            elif key == "parent_section_id" and kwargs.get("parent_section_id"):
                if value == '':
                    model_data[key] = kwargs.get("parent_section_id")
                else:
                    model_data[key] = value
            else:
                model_data[key] = value

        return model_data

    @staticmethod
    def save_instance(form_data, model_name, main_form=False):
        form_model = apps.get_model('dynamic_forms', model_name)

        if main_form:
            query_by = {"form_id": form_data["form_id"]}
        else:
            query_by = {"input_id": form_data["input_id"]}

        instance, created = form_model.objects.update_or_create(**query_by, create_defaults=form_data)
        if not created:
            instance.save()
        return instance
