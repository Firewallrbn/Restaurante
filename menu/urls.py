from django.urls import path
from menu import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('menu', views.index),
    path('contacto', views.contacto),
    path('login/', auth_views.LoginView.as_view()),
]