from django.db import models


# form field types
class BaseFieldModel(models.Model):
    """Abstract base class for all field input model types"""
    label = models.CharField(max_length=255, help_text="Label for field input", default="")
    placeholder = models.CharField(max_length=255, blank=True, null=True, help_text="Placeholder for field input. <strong>This is required for floating labels.</strong>")
    help_text = models.CharField(max_length=255, blank=True, null=True, help_text="Help text for field input")
    floating_label = models.BooleanField(default=False, help_text="Label for floating field label, see <a href='https://getbootstrap.com/docs/5.3/forms/floating-labels/' target='_blank'>https://getbootstrap.com/docs/5.3/forms/floating-labels/</a> for more info.")
    required = models.BooleanField(default=False, help_text="Set the field to be required or not")
    classes = models.CharField(max_length=255, blank=True, null=True, help_text="List of classes, separated by a space, to add to the classname")
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
    blank_option = models.BooleanField(default=False, help_text="Add a blank option to the drop down.")
    blank_label = models.CharField(max_length=100, blank=True, null=True, help_text="Add a label for the drop down. Only applies when blank option is checked.")
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")


class MultipleSelectDropDownInput(BaseFieldModel):
    """Multiple Selection for choice input field"""
    input = models.CharField(max_length=255, blank=True, null=True)
    blank_option = models.BooleanField(default=False, help_text="Add a blank option to the drop down.")
    blank_label = models.CharField(max_length=100, blank=True, null=True, help_text="Add a label for the drop down. Only applies when blank option is checked.")
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")


class IntegerInput(BaseFieldModel):
    """Model for integer input field"""
    input = models.IntegerField(blank=True, null=True)
    min_value = models.IntegerField(blank=True, null=True, help_text="Minimum value for the input")
    max_value = models.IntegerField(blank=True, null=True, help_text="Maximum value for the input")


class DecimalInput(BaseFieldModel):
    """Model for decimal input field"""
    input = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    min_value = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Minimum value for the input")
    max_value = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, help_text="Maximum value for the input")


class FileInput(BaseFieldModel):
    """Model for file input field"""
    input = models.FileField(blank=True, null=True)
    upload_to = models.CharField(blank=True, null=True, max_length=255, help_text="This should be any directory within your media folder; this value will be prefixed with <strong><code>MEDIA_ROOT/</code></strong>.")


class CheckboxInput(BaseFieldModel):
    """Model for checkbox input field"""
    input = models.BooleanField(blank=True, null=True)
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")


class RadioInput(BaseFieldModel):
    """Model for radio input field"""
    input = models.CharField(max_length=255, blank=True, null=True)
    choices = models.TextField(blank=True, null=True, help_text="List of choices, in this format: <strong><code>value, label</code></strong>. Add each choice to a new line.")


class FormModel(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True, help_text="The name of the form")
    description = models.TextField(blank=True, null=True, help_text="Form description")
    for_table = models.BooleanField(blank=True, null=True, help_text="Create a form for a database table")
    table = models.CharField(max_length=255, blank=True, null=True, help_text="Name of the table")

    def __str__(self):
        return self.name
