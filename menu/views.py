from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Platillo, Pedido,CustomUser
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required  
from django.shortcuts import redirect                       

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

@csrf_exempt
def crear_pedido(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        nombre = data["nombreCliente"]
        telefono = data["telefonoCliente"]
        direccion = data["direccionCliente"]
        productos = data["listaProductos"]
        total = data["valorTotal"]

        # Buscar o crear el cliente (puedes hacer login real más adelante)
        cliente, _ = CustomUser.objects.get_or_create(username=telefono, defaults={
            "first_name": nombre,
            "numero": telefono,
            "direccion": direccion,
            "password": "cliente"  # por defecto, luego puedes manejar login real
        })

        pedido = Pedido.objects.create(cliente=cliente, precio_total=total)
        
        for item in productos:
            platillo = Platillo.objects.get(nombre=item["nombre"])
            pedido.platillos.add(platillo)

        return JsonResponse({"mensaje": "Pedido creado con éxito", "id": pedido.id})
    
@login_required
def lista_pedidos(request):
    pedidos = Pedido.objects.select_related('cliente').all().order_by('-fecha')
    return render(request, 'pedidos.html', {'pedidos': pedidos})


@login_required
def marcar_entregado(request, pedido_id):
    pedido = Pedido.objects.get(id=pedido_id)
    pedido.Entregado = True
    pedido.save()
    return redirect('lista_pedidos')