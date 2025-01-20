from django.db import models


# form field types
class FormModel(models.Model):
    form_id = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True, help_text="The name of the form")
    description = models.TextField(blank=True, null=True, help_text="Form description")
    for_table = models.BooleanField(default=False, help_text="Create a form for a database table")
    table = models.CharField(max_length=255, blank=True, null=True, help_text="Name of the table")
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
