import os
import sys
sys.path.insert(0, 'd:/Downloads/dynamifurnish-reimagined/d_back')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import AccessToken
from catalog.models import Product, ProductImage, Category
from PIL import Image
from io import BytesIO
import requests

# Get or create admin user
admin_user, _ = User.objects.get_or_create(username='admin')
if not admin_user.is_staff:
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.set_password('admin123')
    admin_user.save()

token = AccessToken.for_user(admin_user)
headers = {'Authorization': f'Bearer {token}'}

# Get or create category
category, _ = Category.objects.get_or_create(
    name='Office Chairs',
    defaults={'description': 'Comfortable office chairs'}
)

print("=" * 60)
print("CREATING TEST PRODUCTS WITH IMAGES")
print("=" * 60)

# Product data
products_to_create = [
    {
        'name': 'Ergonomic Office Chair',
        'sku': 'CHAIR-001',
        'price': '599.99',
        'description': 'Premium ergonomic office chair with lumbar support',
        'stock': 10,
        'colors': ['Black', 'Gray', 'Blue']
    },
    {
        'name': 'Executive Desk',
        'sku': 'DESK-001',
        'price': '1299.99',
        'description': 'Large executive desk with storage',
        'stock': 5,
        'colors': ['Brown', 'Walnut']
    },
    {
        'name': 'Conference Table',
        'sku': 'TABLE-001',
        'price': '2499.99',
        'description': 'Professional conference table for 8-10 people',
        'stock': 3,
        'colors': ['White', 'Black']
    }
]

for prod_data in products_to_create:
    # Create product
    product, created = Product.objects.get_or_create(
        sku=prod_data['sku'],
        defaults={
            'name': prod_data['name'],
            'category': category,
            'description': prod_data['description'],
            'price': prod_data['price'],
            'stock': prod_data['stock'],
            'is_active': True
        }
    )
    
    print(f"\nProduct: {product.name} (SKU: {product.sku})")
    print(f"  Created: {created}")
    
    # Upload test images for each color
    for idx, color in enumerate(prod_data['colors']):
        # Create test image with different color
        colors_map = {
            'Black': (0, 0, 0),
            'Gray': (128, 128, 128),
            'Blue': (0, 0, 255),
            'Brown': (139, 69, 19),
            'Walnut': (101, 67, 33),
            'White': (255, 255, 255)
        }
        
        rgb = colors_map.get(color, (100, 100, 100))
        img = Image.new('RGB', (300, 300), color=rgb)
        img_bytes = BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        url = f'http://localhost:8000/api/catalog/admin/products/{product.id}/upload-image/'
        files = {'image': (f'product_{product.id}_{color}.jpg', img_bytes, 'image/jpeg')}
        data = {'color': color, 'alt_text': f'{product.name} in {color}'}
        
        response = requests.post(url, headers=headers, files=files, data=data)
        
        if response.status_code == 201:
            img_data = response.json()
            print(f"  [OK] Uploaded {color}: {img_data['image']}")
            
            # Set first image as main product image if not already set
            if idx == 0 and not product.image:
                product.image = img_data['image'].split('/media/')[1] if '/media/' in img_data['image'] else img_data['image']
                product.save()
                print(f"    Set as main product image")
        else:
            print(f"  [FAIL] Failed to upload {color}: {response.status_code} - {response.text}")

print("\n" + "=" * 60)
print("Creating test complete!")
print("=" * 60)

# Verify
print("\nVerifying products:")
products = Product.objects.filter(category=category)
for p in products:
    print(f"\n{p.name}:")
    print(f"  Main image: {p.image}")
    print(f"  Total variants: {p.images.count()}")
    for img in p.images.all():
        print(f"    - {img.color}: {img.image}")
