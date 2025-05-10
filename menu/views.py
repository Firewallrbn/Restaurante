from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Platillo, Pedido

def index(request):
    return render(request, 'index.html') 

def contacto(request):
    return render(request, 'contacto.html')

def MostrarPlatillos(request): #Solo para pruebas
    platillos = Platillo.objects.all()
    resultado = "\n".join([f"{P.nombre} - {P.descripcion}" for P in platillos])
    return HttpResponse(f"<pre>{resultado}</pre>")


def api_menu(request):
    datos = Platillo.objects.all()
    resultado = []

    for platillo in datos:
        resultado.append({
            "nombre": platillo.nombre,
            "descripcion": platillo.descripcion,
            "precio": float(platillo.precio),
            "imagen": platillo.ruta_imagen,
            "categoria": platillo.categoria
        })

    return JsonResponse({"data": resultado})