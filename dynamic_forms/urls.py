from django.urls import path

from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('new-form/', views.FormBuilderView.as_view(), name='new-form'),
    # fetch requests
    path('get-form/', views.get_form, name='get-form'),
    path('save-form/', views.save_form, name='save-form'),
]
