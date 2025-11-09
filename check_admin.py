import os
import sys
sys.path.insert(0, 'd:/Downloads/dynamifurnish-reimagined/d_back')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.contrib.auth.models import User

print("=" * 60)
print("ADMIN USERS CHECK")
print("=" * 60)

users = User.objects.all()
for user in users:
    print(f"\nUser: {user.username}")
    print(f"  Email: {user.email}")
    print(f"  Is Staff: {user.is_staff}")
    print(f"  Is Superuser: {user.is_superuser}")
    print(f"  Groups: {list(user.groups.values_list('name', flat=True))}")
    print(f"  Permissions: {list(user.user_permissions.values_list('codename', flat=True))}")
