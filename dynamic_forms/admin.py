from django.contrib import admin

from dynamic_forms.models import *


class TextInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = TextInput
    extra = 1
    classes = ["collapsible", "pretty"]


class TextAreaInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = TextAreaInput
    extra = 1
    classes = ["collapsible", "pretty"]


class EmailInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = EmailInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DateInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = DateInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DateTimeInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = DateTimeInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DropDownInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = DropDownInput
    extra = 1
    classes = ["collapsible", "pretty"]


class MultiDropDownInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = MultipleSelectDropDownInput
    extra = 1
    classes = ["collapsible", "pretty"]


class IntegerInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = IntegerInput
    extra = 1
    classes = ["collapsible", "pretty"]


class DecimalInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = DecimalInput
    extra = 1
    classes = ["collapsible", "pretty"]


class FileInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = FileInput
    extra = 1
    classes = ["collapsible", "pretty"]


class CheckboxInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
    model = CheckboxInput
    extra = 1
    classes = ["collapsible", "pretty"]


class RadioInputInline(admin.TabularInline):
    readonly_fields = ['input_id', 'parent_section_id']
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
