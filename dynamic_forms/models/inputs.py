from django.db import models

import datetime as dt

from .forms import FormModel


# form field types
class BaseFieldModel(models.Model):
    """Abstract base class for all field input model types"""
    input_id = models.CharField(max_length=255, default='')
    label = models.CharField(max_length=255, help_text="Label for field input", default="")
    placeholder = models.CharField(max_length=255, blank=True, null=True, help_text="Placeholder for field input. <strong>This is required for floating labels.</strong>")
    help_text = models.CharField(max_length=255, blank=True, null=True, help_text="Help text for field input")
    floating_label = models.BooleanField(default=False, help_text="Label for floating field label, see <a href='https://getbootstrap.com/docs/5.3/forms/floating-labels/' target='_blank'>https://getbootstrap.com/docs/5.3/forms/floating-labels/</a> for more info.")
    required = models.BooleanField(default=False, help_text="Set the field to be required or not")
    input_classes = models.CharField(max_length=255, blank=True, null=True, help_text="List of classes, separated by a space, for the input.")
    parent_classes = models.CharField(max_length=255, blank=True, null=True, help_text="List of classes, separated by a space, for the parent container.")
    order = models.IntegerField(default=0, help_text="Input order")
    # if input lives inside a section
    parent_section_id = models.CharField(max_length=255, blank=True, null=True, help_text="Parent section id")
    # adding creation and modified dates
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.label

    class Meta:
        abstract = True
        ordering = ['order']


class TextInput(BaseFieldModel):
    """Model for text input field"""
    input = models.TextField(blank=True, null=True)
    form = models.ForeignKey(FormModel, related_name='text_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class TextAreaInput(BaseFieldModel):
    """Model for text area field"""
    input = models.TextField(blank=True, null=True)
    form = models.ForeignKey(FormModel, related_name='text_area_fields', on_delete=models.CASCADE, null=True, blank=True)


class EmailInput(BaseFieldModel):
    """Model for email input field"""
    input = models.TextField(blank=True, null=True)
    form = models.ForeignKey(FormModel, related_name='email_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class DateInput(BaseFieldModel):
    """Model for date input field"""
    input = models.TextField(blank=True, null=True)
    form = models.ForeignKey(FormModel, related_name='date_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class DateTimeInput(BaseFieldModel):
    """Model for datetime input field"""
    input = models.TextField(blank=True, null=True)
    form = models.ForeignKey(FormModel, related_name='datetime_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class DropDownInput(BaseFieldModel):
    """Model for choice input field"""
    input = models.TextField(blank=True, null=True)
    blank_option = models.BooleanField(default=False, help_text="Add a blank option to the drop down.")
    blank_label = models.CharField(max_length=100, blank=True, null=True, help_text="Add a label for the drop down. Only applies when blank option is checked.")
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")
    form = models.ForeignKey(FormModel, related_name='dropdown_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class MultipleSelectDropDownInput(BaseFieldModel):
    """Multiple Selection for choice input field"""
    input = models.TextField(blank=True, null=True)
    blank_option = models.BooleanField(default=False, help_text="Add a blank option to the drop down.")
    blank_label = models.CharField(max_length=100, blank=True, null=True, help_text="Add a label for the drop down. Only applies when blank option is checked.")
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")
    form = models.ForeignKey(FormModel, related_name='multi_dropdown_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class IntegerInput(BaseFieldModel):
    """Model for integer input field"""
    input = models.TextField(blank=True, null=True)
    min_value = models.IntegerField(blank=True, null=True, help_text="Minimum value for the input")
    max_value = models.IntegerField(blank=True, null=True, help_text="Maximum value for the input")
    form = models.ForeignKey(FormModel, related_name='integer_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class DecimalInput(BaseFieldModel):
    """Model for decimal input field"""
    input = models.TextField(blank=True, null=True)
    min_value = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Minimum value for the input")
    max_value = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Maximum value for the input")
    form = models.ForeignKey(FormModel, related_name='decimal_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class FileInput(BaseFieldModel):
    """Model for file input field"""
    input = models.TextField(blank=True, null=True)
    upload_to = models.CharField(blank=True, null=True, max_length=255, help_text="This should be any directory within your media folder; this value will be prefixed with <strong><code>MEDIA_ROOT/</code></strong>.")
    form = models.ForeignKey(FormModel, related_name='file_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class CheckboxInput(BaseFieldModel):
    """Model for checkbox input field"""
    input = models.TextField(blank=True, null=True)
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")
    form = models.ForeignKey(FormModel, related_name='checkbox_input_fields', on_delete=models.CASCADE, null=True, blank=True)


class RadioInput(BaseFieldModel):
    """Model for radio input field"""
    input = models.TextField(blank=True, null=True)
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")
    form = models.ForeignKey(FormModel, related_name='radio_input_fields', on_delete=models.CASCADE, null=True, blank=True)
