from django.conf import settings

ModelForms = settings.MODEL_FORMS


def register_model_form(cls):
    global ModelForms
    ModelForms.append(cls)
    return cls
