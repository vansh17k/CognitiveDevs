from django.db import models

class OfficerUser(models.Model):
    ROLE_CHOICES = [
        ('inspector', 'Field Enforcement Inspector'),
        ('dgm', 'Deputy General Manager (DGM)'),
        ('admin', 'Legal Metrology Admin'),
    ]

    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='inspector')
    division = models.CharField(max_length=255, default='Indore Central Division')
    badge_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"


class Product(models.Model):
    STATUS_CHOICES = [
        ('Compliant', 'Compliant'),
        ('Non-Compliant', 'Non-Compliant'),
        ('Needs Review', 'Needs Review'),
    ]

    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    manufacturer = models.CharField(max_length=255)
    mrp = models.CharField(max_length=50)
    net_quantity = models.CharField(max_length=50)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Compliant')
    image_url = models.URLField(max_length=500, blank=True)
    declarations_data = models.JSONField(default=list, blank=True)
    violations_data = models.JSONField(default=list, blank=True)
    total_violations_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.status})"


class InspectorRequest(models.Model):
    STATUS_CHOICES = [
        ('Submitted', 'Submitted'),
        ('Pending Review', 'Pending Review'),
        ('Under Review', 'Under Review'),
        ('Approved', 'Approved (Issue Notice)'),
        ('Rejected', 'Rejected'),
        ('Resolved', 'Resolved (Compounded)'),
    ]
    PRIORITY_CHOICES = [
        ('High', 'High Priority'),
        ('Medium', 'Medium Priority'),
        ('Low', 'Low Priority'),
    ]

    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=150)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='High')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Submitted')
    location = models.CharField(max_length=255)
    
    inspector_id = models.CharField(max_length=50)
    inspector_name = models.CharField(max_length=255)
    inspector_email = models.EmailField()
    inspector_division = models.CharField(max_length=255)
    
    product_id = models.CharField(max_length=50, blank=True, null=True)
    product_name = models.CharField(max_length=255, blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    
    dgm_remarks = models.TextField(blank=True, null=True)
    dgm_officer_name = models.CharField(max_length=255, blank=True, null=True)
    dgm_action_date = models.CharField(max_length=100, blank=True, null=True)
    timeline_data = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.title} [{self.status}]"


class AuditLog(models.Model):
    action = models.CharField(max_length=255)
    user_name = models.CharField(max_length=255)
    user_role = models.CharField(max_length=50)
    target = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.timestamp}] {self.user_name}: {self.action}"
