from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('new-form/', views.FormBuilderView.as_view(), name='new-form'),
    path('edit-form/<form_id>/', views.EditFormView.as_view(), name='edit-form'),
    path('forms-list/', views.FormListView.as_view(), name='forms-list'),
    path('<str:form_id>/', views.RenderFormView.as_view(), name='form'),
    # fetch requests
    path('get-form/', views.get_form, name='get-form'),
    path('get-model-form/', views.get_model_form, name='get-model-form'),
    path('save-form/', views.save_form, name='save-form'),
    path('get-form-layout/', views.get_form_layout, name='get-form-layout'),
    # tinymce url
    path('tinymce/', include('tinymce.urls')),
]
