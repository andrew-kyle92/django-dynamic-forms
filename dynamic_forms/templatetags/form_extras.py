from django import template

register = template.Library()


@register.filter
def get_snippet_path(value, arg):
    """Determines the snippet type to pass"""
    base_path = "dynamic_forms/snippets"
    if value in arg["form_inputs"]:
        full_path = f"{base_path}/form_inputs/{value}.html"
        return full_path
    else:
        full_path = f"{base_path}/form_sections/{value}.html"
        return full_path
