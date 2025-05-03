from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Información adicional", {'fields': ('direccion', 'numero')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)