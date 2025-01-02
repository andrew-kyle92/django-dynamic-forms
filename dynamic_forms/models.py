from django.db import models


# form field types
class BaseFieldModel(models.Model):
    """Abstract base class for all field input model types"""
    label = models.CharField(max_length=255, help_text="Label for field input", default="Label")
    placeholder = models.CharField(max_length=255, blank=True, null=True, help_text="Placeholder for field input")
    help_text = models.CharField(max_length=255, blank=True, null=True, help_text="Help text for field input")
    floating_label = models.BooleanField(default=False, help_text="Label for floating field label, see <a href='https://getbootstrap.com/docs/5.3/forms/floating-labels/'>https://getbootstrap.com/docs/5.3/forms/floating-labels/</a> for more info.")
    required = models.BooleanField(default=False, help_text="Set the field to be required or not", null=True, blank=True)
    classes = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated list of classes to use for this field")
    order = models.IntegerField(default=0, help_text="Input order")

    def __str__(self):
        return self.label

    class Meta:
        abstract = True
        ordering = ['order']


class TextInput(BaseFieldModel):
    """Model for text input field"""
    input = models.CharField(max_length=255, blank=True, null=True)


class TextAreaInput(BaseFieldModel):
    """Model for text area field"""
    input = models.TextField(blank=True, null=True)


class EmailInput(BaseFieldModel):
    """Model for email input field"""
    input = models.EmailField(blank=True, null=True)


class DateInput(BaseFieldModel):
    """Model for date input field"""
    input = models.DateField(blank=True, null=True)


class DateTimeInput(BaseFieldModel):
    """Model for datetime input field"""
    input = models.DateTimeField(blank=True, null=True)


class DropDownInput(BaseFieldModel):
    """Model for choice input field"""
    input = models.CharField(max_length=255, blank=True, null=True)
    choices = models.TextField(blank=True, null=True)


class MultipleSelectDropDownInput(BaseFieldModel):
    """Multiple Selection for choice input field"""
    input = models.CharField(max_length=255, blank=True, null=True)
    choices = models.TextField(blank=True, null=True)


class IntegerInput(BaseFieldModel):
    """Model for integer input field"""
    input = models.IntegerField(blank=True, null=True)
    min_value = models.IntegerField(blank=True, null=True)
    max_value = models.IntegerField(blank=True, null=True)


class DecimalInput(BaseFieldModel):
    """Model for decimal input field"""
    input = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    min_value = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    max_value = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)


class FileInput(BaseFieldModel):
    """Model for file input field"""
    input = models.FileField(blank=True, null=True)
    upload_to = models.CharField(blank=True, null=True, max_length=255)


class CheckboxInput(BaseFieldModel):
    """Model for checkbox input field"""
    input = models.BooleanField(blank=True, null=True)


class RadioInput(BaseFieldModel):
    """Model for radio input field"""
    input = models.CharField(max_length=255, blank=True, null=True)


class FormModel(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True, help_text="The name of the form")
    description = models.TextField(blank=True, null=True, help_text="Form description")
    for_table = models.BooleanField(blank=True, null=True, help_text="Add form to db table")
    table = models.CharField(max_length=255, blank=True, null=True, help_text="Name of the table")

    def __str__(self):
        return self.name
