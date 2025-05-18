from django.urls import path
from menu import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('menu/', views.index),
    path('contacto/', views.contacto),
    path('login/', auth_views.LoginView.as_view()),
    path('prueba/', views.MostrarPlatillos),
    path('api/menu', views.api_menu),
    path('api/pedido/', views.crear_pedido, name='crear_pedido'),
    path('pedidos/', views.lista_pedidos, name='lista_pedidos'),
    path('pedidos/entregar/<int:pedido_id>/', views.marcar_entregado, name='marcar_entregado'),
]