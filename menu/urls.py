from django.urls import path
from menu import views
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
urlpatterns = [
    path('', views.index),
    path('contacto/', views.contacto),
    path('login/', views.login_page, name='login_page'),  
    path('api/login/', TokenObtainPairView.as_view(), name='api_login'),  
    path('prueba/', views.MostrarPlatillos),
    path('api/menu', views.api_menu),
    path('api/pedido/', views.crear_pedido, name='crear_pedido'),
    path('pedidos/', views.lista_pedidos, name='lista_pedidos'),
    path('pedidos/entregar/<int:pedido_id>/', views.marcar_entregado, name='marcar_entregado'),
    path('pedidos/', views.lista_pedidos, name='lista_pedidos'),
    path('api/token/', TokenObtainPairView.as_view()), 
    path('api/token/refresh/', TokenRefreshView.as_view()),
]