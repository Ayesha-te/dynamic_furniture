import os
import sys
sys.path.insert(0, 'd:/Downloads/dynamifurnish-reimagined/d_back')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from catalog.models import Product, ProductImage
import json

print("=" * 60)
print("PRODUCT IMAGE DIAGNOSIS")
print("=" * 60)

products = Product.objects.all()
print(f"\nTotal Products: {products.count()}")

for p in products:
    print(f"\n--- Product {p.id}: {p.name} ---")
    print(f"  Main image field: {p.image.name if p.image else 'None'}")
    print(f"  Related ProductImages: {p.images.count()}")
    
    for img in p.images.all():
        print(f"    - Image {img.id}:")
        print(f"      File path: {img.image.name if img.image else 'None'}")
        print(f"      Color: {img.color}")
        print(f"      File exists: {img.image.storage.exists(img.image.name) if img.image else False}")

print("\n" + "=" * 60)
print("DIRECTORY CONTENTS")
print("=" * 60)

import os
media_dir = 'd:/Downloads/dynamifurnish-reimagined/d_back/media'
for root, dirs, files in os.walk(media_dir):
    level = root.replace(media_dir, '').count(os.sep)
    indent = ' ' * 2 * level
    print(f'{indent}{os.path.basename(root)}/')
    subindent = ' ' * 2 * (level + 1)
    for file in files:
        print(f'{subindent}{file}')
