import importlib
from django.apps import apps


def discover_forms():
    from .registry import ModelForms  # Ensure ModelForms is loaded
    for app_config in apps.get_app_configs():
        try:
            # Try to import the forms module of the app
            importlib.import_module(f"{app_config.name}.forms")
        except ModuleNotFoundError:
            # Skip apps without a forms module
            continue
