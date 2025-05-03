from django.urls import path
from menu import views

urlpatterns = [
    path('menu', views.index),
    path('contacto', views.contacto),
]