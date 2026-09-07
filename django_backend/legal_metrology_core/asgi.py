"""
ASGI config for legal_metrology_core project.
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'legal_metrology_core.settings')
application = get_asgi_application()
