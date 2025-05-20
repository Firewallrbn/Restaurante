from django.urls import path
from menu import views
from django.contrib.auth import views as auth_views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', views.Redirect),
    path('menu/', views.index),
    path('contacto/', views.contacto),
    path('login/', auth_views.LoginView.as_view()),
    path('prueba/', views.MostrarPlatillos),
    path('api/menu', views.api_menu),
    path('api/pedido/', views.crear_pedido, name='crear_pedido'),
    path('pedidos/', views.lista_pedidos, name='lista_pedidos'),
    path('pedidos/entregar/<int:pedido_id>/', views.marcar_entregado, name='marcar_entregado'),
    path('pedidos/', views.lista_pedidos, name='lista_pedidos'),
    path(
        'login/',
        auth_views.LoginView.as_view(
            template_name='login.html'   # <-- apunta al fichero existente
        ),
        name='login'
    ),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]