import os
import sys
import django

sys.path.insert(0, 'd:/Downloads/dynamifurnish-reimagined/d_back')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from catalog.models import Product
from PIL import Image
from io import BytesIO
import requests

product = Product.objects.first()
if not product:
    print("No products found")
    exit(1)

admin_user, created = User.objects.get_or_create(username='admin')
if created:
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.set_password('admin123')
    admin_user.save()
    print("Admin user created")

token = AccessToken.for_user(admin_user)
print(f"Admin token: {token}")

img = Image.new('RGB', (100, 100), color='red')
img_bytes = BytesIO()
img.save(img_bytes, format='JPEG')
img_bytes.seek(0)

url = f'http://localhost:8000/api/catalog/admin/products/{product.id}/upload-image/'
headers = {'Authorization': f'Bearer {token}'}
files = {'image': ('test.jpg', img_bytes, 'image/jpeg')}
data = {'color': 'Red', 'alt_text': 'Test image'}

print(f"\nUploading to: {url}")
response = requests.post(url, headers=headers, files=files, data=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")
