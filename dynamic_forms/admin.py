from django.contrib import admin

from dynamic_forms.models import *


class TextInputInline(admin.TabularInline):
    model = TextInput
    extra = 1
    classes = ["collapsible", "pretty"]


class TextAreaInline(admin.TabularInline):
    model = TextAreaInput
    extra = 1
    classes = ["collapsible", "pretty"]


class EmailInputInline(admin.TabularInline):
    model = EmailInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DateInputInline(admin.TabularInline):
    model = DateInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DateTimeInputInline(admin.TabularInline):
    model = DateTimeInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DropDownInputInline(admin.TabularInline):
    model = DropDownInput
    extra = 1
    classes = ["collapsible", "pretty"]


class MultiDropDownInputInline(admin.TabularInline):
    model = MultipleSelectDropDownInput
    extra = 1
    classes = ["collapsible", "pretty"]


class IntegerInputInline(admin.TabularInline):
    model = IntegerInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DecimalInputInline(admin.TabularInline):
    model = DecimalInput
    extra = 1
    classes = ["collapsible", "pretty"]


class FileInputInline(admin.TabularInline):
    model = FileInput
    extra = 1
    classes = ["collapsible", "pretty"]


class CheckboxInputInline(admin.TabularInline):
    model = CheckboxInput
    extra = 1
    classes = ["collapsible", "pretty"]


class RadioInputInline(admin.TabularInline):
    model = RadioInput
    extra = 1
    classes = ["collapsible", "pretty"]


class FormRowInline(admin.TabularInline):
    model = FormRow
    extra = 1
    classes = ["collapsible", "pretty"]


class DividerLineInline(admin.StackedInline):
    model = DividerLine
    extra = 1
    classes = ["collapsible", "pretty"]


class SectionHeaderInline(admin.TabularInline):
    model = SectionHeader
    extra = 1
    classes = ["collapsible", "pretty"]


class TextBlockInline(admin.TabularInline):
    model = TextBlock
    extra = 1
    classes = ["collapsible", "pretty"]


class CollapsibleSectionInline(admin.TabularInline):
    model = CollapsibleSection
    extra = 1
    classes = ["collapsible", "pretty"]


@admin.register(FormModel)
class FormAdmin(admin.ModelAdmin):
    readonly_fields = ["form_id", "layout", "modified", "created"]
    inlines = [TextInputInline, TextAreaInline, EmailInputInline, DateInputInline, DateTimeInputInline,
               DropDownInputInline, MultiDropDownInputInline, IntegerInputInline, DecimalInputInline,
               FileInputInline, CheckboxInputInline, RadioInputInline, FormRowInline, DividerLineInline,
               SectionHeaderInline, CollapsibleSectionInline]
