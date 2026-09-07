import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.shortcuts import get_object_or_404

from .models import OfficerUser, Product, InspectorRequest, AuditLog
from .serializers import OfficerUserSerializer, ProductSerializer, InspectorRequestSerializer, AuditLogSerializer
from .services.gemini_service import analyze_package_image, explain_violation
from .services.rules_engine import verify_label_declarations
from .services.ai_guide_service import generate_guide_response

class HealthCheckView(APIView):
    def get(self, request):
        return Response({
            "status": "online",
            "framework": "Django 5.0 + Django REST Framework",
            "services": ["gemini-vision-2.5", "rules-engine", "ai-assistant-guide"]
        })


class ScanAnalyzeView(APIView):
    """
    POST /api/scan/analyze
    Analyzes visual product label using Gemini Multimodal Vision + Rules Engine.
    """
    def post(self, request):
        extracted_text = request.data.get('extractedText', '')
        image_url = request.data.get('imageUrl', '')
        product_name = request.data.get('productName', '')

        # 1. Try Gemini Vision if base64/image or prompt is provided
        ai_analysis = None
        if os.environ.get('GEMINI_API_KEY'):
            ai_analysis = analyze_package_image()

        # 2. Apply Rule 6 Verification Engine
        verification = verify_label_declarations(extracted_text)

        result = {
            "success": True,
            "productName": product_name or (ai_analysis and ai_analysis.get('product_name')) or "Scanned Commodity",
            "status": verification["status"],
            "declarations": verification["declarations"],
            "violations": verification["violations"],
            "aiAnalysis": ai_analysis
        }
        return Response(result, status=status.HTTP_200_OK)


class ExplainViolationView(APIView):
    """
    POST /api/ai/explain-violation
    """
    def post(self, request):
        violation = request.data.get('violation', {})
        product = request.data.get('product', {})
        
        explanation = explain_violation(violation, product)
        if not explanation:
            explanation = (
                f"Under the Legal Metrology (Packaged Commodities) Rules, 2011, this infraction represents "
                f"a non-compliance under {violation.get('ruleReference', 'Rule 6')}. "
                f"Penalties apply under Section 36(1) of the Legal Metrology Act, 2009 up to ₹25,000."
            )

        return Response({"explanation": explanation}, status=status.HTTP_200_OK)


class AIGuideAssistantView(APIView):
    """
    POST /api/ai/guide
    Interactive Assistant guiding users through all website features.
    """
    def post(self, request):
        message = request.data.get('message', '')
        history = request.data.get('history', [])
        
        if not message.strip():
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        guide_reply = generate_guide_response(message, history)
        return Response({
            "reply": guide_reply,
            "status": "success"
        }, status=status.HTTP_200_OK)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer


class InspectorRequestViewSet(viewsets.ModelViewSet):
    queryset = InspectorRequest.objects.all().order_by('-created_at')
    serializer_class = InspectorRequestSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        inspector_id = self.request.query_params.get('inspectorId')
        req_status = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')
        
        if inspector_id:
            qs = qs.filter(inspector_id=inspector_id)
        if req_status and req_status != 'all':
            qs = qs.filter(status=req_status)
        if priority and priority != 'all':
            qs = qs.filter(priority=priority)
        return qs


class ViolationStatsView(APIView):
    """
    GET /api/violations/stats
    Returns number of times of violation of every product.
    """
    def get(self, request):
        products = Product.objects.all()
        data = []
        for p in products:
            data.append({
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "status": p.status,
                "violationsCount": p.total_violations_count,
            })
        data.sort(key=lambda x: x["violationsCount"], reverse=True)
        return Response({"productViolations": data})


class RulesListView(APIView):
    """
    GET /api/rules
    """
    def get(self, request):
        rules = [
            {"id": "r1", "number": "Rule 6(1)(a)", "title": "Name & Address of Manufacturer / Packer", "category": "Mandatory Declaration"},
            {"id": "r2", "number": "Rule 6(1)(b)", "title": "Generic Name of Commodity", "category": "Mandatory Declaration"},
            {"id": "r3", "number": "Rule 6(1)(c)", "title": "Net Quantity in Standard Units (Rule 12)", "category": "Metric Standards"},
            {"id": "r4", "number": "Rule 6(1)(d)", "title": "Month & Year of Manufacture / Packing", "category": "Date Marking"},
            {"id": "r5", "number": "Rule 6(1)(e)", "title": "Maximum Retail Price (MRP) 'Incl. of all taxes'", "category": "Pricing & USP"},
            {"id": "r6", "number": "Rule 6(1)(n)", "title": "Country of Origin for All Commodities", "category": "Origin Mandate"},
            {"id": "r7", "number": "Rule 7", "title": "Minimum Height of Numerals & Letters (Table 1)", "category": "Display Font Specs"},
            {"id": "r8", "number": "Section 36", "title": "Penalty for Non-Standard Packages (₹25k - ₹1L)", "category": "Statutory Fines"},
        ]
        return Response({"rules": rules})
