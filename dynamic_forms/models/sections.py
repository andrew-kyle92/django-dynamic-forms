from django.db import models

from tinymce.widgets import TinyMCE

from .forms import FormModel


class BaseSection(models.Model):
    input_id = models.CharField(max_length=255, blank=True, null=True)
    input_classes = models.CharField(max_length=255, blank=True, null=True, help_text="List of classes, separated by a space, to add to the container.")
    order = models.IntegerField(default=0, help_text="Input order")
    # adding creation and modified dates
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['order']


class FormRow(BaseSection):
    form = models.ForeignKey(FormModel, related_name="form_row_fields", on_delete=models.CASCADE, blank=True, null=True)


class DividerLine(BaseSection):
    form = models.ForeignKey(FormModel, related_name="divider_line_fields", on_delete=models.CASCADE, blank=True, null=True)


class SectionHeader(BaseSection):
    title = models.CharField(max_length=255, null=False, blank=False, help_text="Title of the section")
    description = models.CharField(max_length=255, null=False, blank=False, help_text="Description of the section")
    form = models.ForeignKey(FormModel, related_name="section_header_fields", on_delete=models.CASCADE, blank=True, null=True)


class TextBlock(BaseSection):
    text = models.TextField(null=False, blank=False, help_text="Text area for provided instructions, guidelines, or context. HTML friendly.")
    form = models.ForeignKey(FormModel, related_name="text_block_fields", on_delete=models.CASCADE, blank=True, null=True)


class CollapsibleSection(BaseSection):
    title = models.CharField(max_length=255, null=False, blank=False, help_text="Title of the section")
    description = models.CharField(max_length=255, null=False, blank=False, help_text="Description of the section")
    form = models.ForeignKey(FormModel, related_name="collapsible_section_fields", on_delete=models.CASCADE, blank=True, null=True)
