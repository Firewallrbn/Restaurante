from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Platillo, Pedido,CustomUser
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required  
from django.shortcuts import redirect  
from django.db.models import Q                       
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response  
from django.contrib.auth import authenticate


def index(request):
    return render(request, 'index.html') 

def contacto(request):
    return render(request, 'contacto.html')

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)  # Genera el token
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    else:
        return Response({"error": "Credenciales inválidas"}, status=400)
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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lista_pedidos(request):
    # 1. Traemos TODOS los pedidos
    pedidos = Pedido.objects.select_related('cliente').order_by('-fecha')

    # 2. ¿El usuario escribió algo en el cuadro de búsqueda?
    q = request.GET.get('q', '').strip()
    if q:
        #   • Busca por nombre, apellido o username (ignora mayúsculas/minúsculas)
        pedidos = pedidos.filter(
            Q(cliente__first_name__icontains=q) |
            Q(cliente__last_name__icontains=q)  |
            Q(cliente__username__icontains=q)
        )

    return render(request, 'pedidos.html', {
        'pedidos': pedidos,
        'q': q,                # para que el input conserve el texto buscado
    })


@login_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def marcar_entregado(request, pedido_id):
    pedido = Pedido.objects.get(id=pedido_id)
    pedido.Entregado = True
    pedido.save()
    return redirect('lista_pedidos')