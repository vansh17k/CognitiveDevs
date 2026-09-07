from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthCheckView, 
    ScanAnalyzeView, 
    ExplainViolationView, 
    AIGuideAssistantView,
    ProductViewSet, 
    InspectorRequestViewSet, 
    ViolationStatsView, 
    RulesListView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'requests', InspectorRequestViewSet, basename='inspector-request')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('scan/analyze/', ScanAnalyzeView.as_view(), name='scan-analyze'),
    path('ai/explain-violation/', ExplainViolationView.as_view(), name='explain-violation'),
    path('ai/guide/', AIGuideAssistantView.as_view(), name='ai-guide-assistant'),
    path('violations/stats/', ViolationStatsView.as_view(), name='violation-stats'),
    path('rules/', RulesListView.as_view(), name='rules-list'),
    path('', include(router.urls)),
]
