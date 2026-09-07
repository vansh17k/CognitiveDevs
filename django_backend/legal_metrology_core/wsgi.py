"""
WSGI config for legal_metrology_core project.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'legal_metrology_core.settings')
application = get_wsgi_application()
