from django.apps import AppConfig
from django.conf import settings


class DynamicFormsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "dynamic_forms"

    def ready(self):
        from .discover import discover_forms
        discover_forms()
