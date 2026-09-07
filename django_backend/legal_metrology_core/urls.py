"""
URL configuration for legal_metrology_core project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse

def api_root_index(request):
    """
    Root endpoint at / that lists all available API routes and backend status.
    """
    if request.headers.get('Accept', '').startswith('text/html'):
        html_content = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Legal Metrology & PCR 2011 API Engine</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    background: #f8fafc;
                    color: #0f172a;
                    margin: 0;
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                }
                .card {
                    background: white;
                    max-width: 680px;
                    width: 100%;
                    padding: 32px;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                .badge {
                    display: inline-block;
                    background: #ecfdf5;
                    color: #0d4734;
                    font-weight: 700;
                    font-size: 12px;
                    padding: 4px 10px;
                    border-radius: 9999px;
                    border: 1px solid #a7f3d0;
                    margin-bottom: 12px;
                }
                h1 {
                    font-size: 22px;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 8px 0;
                }
                p {
                    font-size: 14px;
                    color: #475569;
                    line-height: 1.5;
                    margin: 0 0 20px 0;
                }
                .endpoints-title {
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #64748b;
                    margin-bottom: 12px;
                }
                .list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .list li a {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 14px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    text-decoration: none;
                    color: #0d4734;
                    font-weight: 600;
                    font-size: 13px;
                    font-family: monospace;
                    transition: all 0.15s ease;
                }
                .list li a:hover {
                    background: #ecfdf5;
                    border-color: #a7f3d0;
                }
                .tag {
                    font-size: 11px;
                    background: #e2e8f0;
                    color: #475569;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: sans-serif;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <span class="badge">● Server Active & Operational</span>
                <h1>Legal Metrology & PCR 2011 AI Backend</h1>
                <p>Welcome to the Django REST API Core. Below are the available service endpoints and administrative tools:</p>
                
                <div class="endpoints-title">Available Endpoints</div>
                <ul class="list">
                    <li><a href="/api/health/"><span>/api/health/</span> <span class="tag">GET - Health Status</span></a></li>
                    <li><a href="/api/products/"><span>/api/products/</span> <span class="tag">GET/POST - Product Catalog</span></a></li>
                    <li><a href="/api/requests/"><span>/api/requests/</span> <span class="tag">GET/POST - Inspector Workflow</span></a></li>
                    <li><a href="/api/rules/"><span>/api/rules/</span> <span class="tag">GET - PCR 2011 Rule Catalog</span></a></li>
                    <li><a href="/api/violations/stats/"><span>/api/violations/stats/</span> <span class="tag">GET - Compliance Metrics</span></a></li>
                    <li><a href="/admin/"><span>/admin/</span> <span class="tag">Django Admin Portal</span></a></li>
                </ul>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html_content)

    return JsonResponse({
        "status": "online",
        "service": "Legal Metrology & PCR 2011 Regulatory Compliance Engine",
        "version": "1.0.0",
        "documentation": {
            "health": "/api/health/",
            "products": "/api/products/",
            "inspector_requests": "/api/requests/",
            "rules": "/api/rules/",
            "violation_stats": "/api/violations/stats/",
            "scan_analyze": "/api/scan/analyze/ (POST)",
            "admin_panel": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root_index, name='api-root-index'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

