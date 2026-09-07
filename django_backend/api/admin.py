from django.contrib import admin
from .models import OfficerUser, Product, InspectorRequest, AuditLog

@admin.register(OfficerUser)
class OfficerUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'role', 'division')
    list_filter = ('role', 'division')
    search_fields = ('name', 'email')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'brand', 'category', 'status', 'total_violations_count')
    list_filter = ('status', 'category')
    search_fields = ('name', 'brand', 'manufacturer')

@admin.register(InspectorRequest)
class InspectorRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'inspector_name', 'priority', 'status', 'created_at')
    list_filter = ('status', 'priority', 'category')
    search_fields = ('title', 'description', 'inspector_name')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'action', 'target', 'timestamp')
    list_filter = ('action', 'user_role')
    search_fields = ('user_name', 'action', 'details')
