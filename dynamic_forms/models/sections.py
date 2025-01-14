from django.db import models


class BaseSection(models.Model):
    classes = models.CharField(max_length=255, blank=True, null=True, help_text="List of classes, separated by a space, to add to the classname")
    order = models.IntegerField(default=0, help_text="Input order")

    class Meta:
        abstract = True
        ordering = ['order']


class FormRow(BaseSection):
    pass


class DividerLine(BaseSection):
    pass


class SectionHeader(BaseSection):
    title = models.CharField(max_length=255, null=False, blank=False, help_text="Title of the section")
    description = models.CharField(max_length=255, null=False, blank=False, help_text="Description of the section")


class TextBlock(BaseSection):
    text = models.TextField(null=False, blank=False, help_text="Text area for provided instructions, guidelines, or context. HTML friendly.")


class CollapsibleSection(BaseSection):
    title = models.CharField(max_length=255, null=False, blank=False, help_text="Title of the section")
    description = models.CharField(max_length=255, null=False, blank=False, help_text="Description of the section")


class Column(BaseSection):
    pass
