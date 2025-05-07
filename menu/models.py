from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.conf import settings

class Platillo(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    ruta_imagen = models.CharField(max_length=255)
    categoria = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class Pedido(models.Model):
    cliente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    platillos = models.ManyToManyField(Platillo)
    precio_total = models.DecimalField(max_digits=8, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido #{self.id} de {self.cliente.username}"

class CustomUser(AbstractUser):
    direccion = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username