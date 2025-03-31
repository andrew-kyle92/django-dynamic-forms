from django.apps import apps
from django.conf import settings

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

    def get_form_fields(self, field, exists=False, input_id=None, app_model=False, model_form=None, initial=None):
        app_label = "dynamic_forms"
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

        # checking kwargs for non-dynamic-form-app ModelForm
        if model_form:
            _forms[model_form._meta.model.__name__] = model_form
            if exists:
                app_label = model_form._meta.app_label

        # getting the html fields for each field
        fields = {}
        # getting form class instance
        if exists:
            # getting the relevant model name
            if app_model:
                model_name = model_form._meta.model
                field = model_name
            else:
                model_name = self.get_model(field)
            # getting the model
            field_model = apps.get_model(app_label=app_label, model_name=model_name)
            # querying instance
            instance = field_model.objects.get(input_id=input_id)
            if instance:
                form = _forms[field](instance=instance)
            else:
                form = _forms[field]()
        else:
            if initial:
                form = _forms[field](initial=initial)
            else:
                form = _forms[field]()

        for field in form:
            fields[field.html_name] = {
                "label": field.label,
                "input": field.as_widget(),
                "helpText": field.help_text,
                "id": field.auto_id,
            }
            if app_model:
                fields[field.html_name]["data"] = self.get_app_model_data(field)
                fields[field.html_name]["type"] = field.widget_type

        return json.dumps(fields)

    @staticmethod
    def get_app_model_data(field):
        # data variable to return
        data = None
        multi_data_types = ["select", "checkbox", "radio", "checkboxselectmultiple", "radioselectmultiple", "multipleselect"]
        # determining the type of field
        field_type = field.widget_type
        # checking if field type has multiple data instances
        if field_type in multi_data_types:
            data = [subwidget.data for subwidget in field.subwidgets]
        else:
            data = field.subwidgets[0].data
        # returning the data
        return data

    def save_form_to_db(self, form_data):
        # creating the main form.
        main_form = self.save_instance(form_data=self.set_model_data(form_data=form_data, layout=form_data), model_name="FormModel", main_form=True)
        # getting the fields to be removed and deleted from the database
        removed_fields = form_data.pop("removedFields", None)

        # creating inputs and saving to the database
        for key, value in form_data["formObjects"].items():
            obj = self.save_instance(form_data=self.set_model_data(form_data=value, form=main_form, order=key), model_name=self.get_model(value["inputType"]), main_form=False)
            if len(value["children"]) > 0:
                order = 0
                for child in value["children"]:
                    self.save_instance(form_data=self.set_model_data(form_data=child, form=main_form, order=order, parent_section_id=obj.input_id), model_name=self.get_model(child["inputType"]), main_form=False)
                    order += 1

        # removing inputs from the database that have been removed from the form.
        if removed_fields is not None:
            if len(removed_fields) > 0:
                for field in removed_fields:
                    self.remove_field_input(field)

        return main_form

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
            model_data["layout"] = json.dumps(form_data)
        else:
            model_data["input_id"] = form_data["id"]

        # setting required field to either True or False
        # the formdata retrieved from JavaScript sets a checkboxes value to 'on' when checked
        if form_data["formData"].get("required", False):
            required_field = form_data["formData"]["required"]
            if required_field == "on" or required_field == "":
                if required_field == "on":
                    form_data["formData"]["required"] = True
                else:
                    form_data["formData"]["required"] = False

        if form_data["formData"].get("floating_label", False):
            floating_label = form_data["formData"]["floating_label"]
            if floating_label:
                if floating_label == "on":
                    form_data["formData"]["floating_label"] = True
                else:
                    form_data["formData"]["floating_label"] = False

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
            elif key == "layout" and kwargs.get("layout"):
                model_data[key] = kwargs.get("layout")
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

        instance, created = form_model.objects.update_or_create(defaults=form_data, create_defaults=form_data, **query_by)
        if not created:
            instance.save()
        return instance

    def get_form_from_instance(self, instance):
        pass

    def remove_field_input(self, field):
        # querying the field instance
        input_id = field["id"]
        input_type = field["inputType"]
        field_model = apps.get_model(app_label="dynamic_forms", model_name=self.get_model(input_type))
        # deleting the model
        try:
            instance = field_model.objects.filter(input_id=input_id)
            instance.delete()
        except field_model.DoesNotExist:
            return False

    @staticmethod
    def get_model_form(model_name):
        model_form = None
        for form in settings.MODEL_FORMS:
            if form._meta.model.__name__ == model_name:
                model_form = form

        return model_form

    @staticmethod
    def build_form_for_render(form_id):
        """Build a form object, similar to Django's built-in form class
        but also includes the HTML template layout, as well."""
        form = FormModel.objects.get(form_id=form_id)
        form_layout = form.layout
        rendered_form = {}

