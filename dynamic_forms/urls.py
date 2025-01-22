from django.urls import path

from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('new-form/', views.FormBuilderView.as_view(), name='new-form'),
    path('edit-form/<form_id>/', views.EditFormView.as_view(), name='edit-form'),
    path('forms-list/', views.FormListView.as_view(), name='forms-list'),
    # fetch requests
    path('get-form/', views.get_form, name='get-form'),
    path('save-form/', views.save_form, name='save-form'),
    path('get-form-layout/', views.get_form_layout, name='get-form-layout'),
]
