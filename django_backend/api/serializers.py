from rest_framework import serializers
from .models import OfficerUser, Product, InspectorRequest, AuditLog

class OfficerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficerUser
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    declarations = serializers.JSONField(source='declarations_data', required=False)
    violations = serializers.JSONField(source='violations_data', required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'category', 'manufacturer', 
            'mrp', 'net_quantity', 'status', 'image_url', 
            'declarations', 'violations', 'total_violations_count',
            'created_at', 'updated_at'
        ]


class InspectorRequestSerializer(serializers.ModelSerializer):
    inspectorId = serializers.CharField(source='inspector_id', required=False)
    inspectorName = serializers.CharField(source='inspector_name', required=False)
    inspectorEmail = serializers.EmailField(source='inspector_email', required=False)
    inspectorDivision = serializers.CharField(source='inspector_division', required=False)
    productId = serializers.CharField(source='product_id', required=False, allow_blank=True, allow_null=True)
    productName = serializers.CharField(source='product_name', required=False, allow_blank=True)
    imageUrl = serializers.URLField(source='image_url', required=False, allow_blank=True)
    dgmRemarks = serializers.CharField(source='dgm_remarks', required=False, allow_blank=True, allow_null=True)
    dgmOfficerName = serializers.CharField(source='dgm_officer_name', required=False, allow_blank=True, allow_null=True)
    dgmActionDate = serializers.CharField(source='dgm_action_date', required=False, allow_blank=True, allow_null=True)
    timeline = serializers.JSONField(source='timeline_data', required=False)

    class Meta:
        model = InspectorRequest
        fields = [
            'id', 'title', 'description', 'category', 'priority', 'status', 'location',
            'inspectorId', 'inspectorName', 'inspectorEmail', 'inspectorDivision',
            'productId', 'productName', 'imageUrl',
            'dgmRemarks', 'dgmOfficerName', 'dgmActionDate', 'timeline',
            'created_at', 'updated_at'
        ]


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
