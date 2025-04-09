import math
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


@register.filter
def to_int(value):
    return int(value)


@register.filter
def break_to_columns(value, arg):
    columns = int(arg)
    choices_split = value.split('\n')
    choices_per_col = int(math.floor(len(choices_split)/columns))
    choices = []
    column = []
    item_count = 0
    for choice in choices_split:
        item_count += 1
        if len(column) < choices_per_col:
            column.append({"value": choice.split(',')[0].strip(), "label": choice.split(',')[1].strip()})
            if item_count == len(choices_split):
                choices.append(column)
        elif len(column) == choices_per_col:
            choices.append(column)
            if item_count == len(choices_split):
                choices[choices_per_col - 1].append({"value": choice.split(',')[0].strip(), "label": choice.split(',')[1].strip()})
            else:
                column = [{"value": choice.split(',')[0].strip(), "label": choice.split(',')[1].strip()}]
        elif item_count == len(choices_split):
            choices.append(column)
    return choices


@register.filter
def get_choices(value):
    choices_split = value.split('\n')
    choices = [{"value": choice.split(",")[0].strip(), "label": choice.split(",")[1].strip()} for choice in choices_split]
    return choices
