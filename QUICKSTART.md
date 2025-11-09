# DynamiFurnish Quick Start Guide

Get the entire platform running in 10 minutes!

## Prerequisites
- Python 3.9+
- Node.js 16+
- Git

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Or activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed database with 20+ furniture products
python manage.py seed_data

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver 0.0.0.0:8000
```

**Backend is now running at**: `http://localhost:8000`

## Step 2: Frontend Setup (4 minutes)

### Terminal 2 - Main Frontend

```bash
# From project root
npm install

# Start Vite dev server
npm run dev
```

**Frontend is now running at**: `http://localhost:5173`

### Terminal 3 - Admin Panel

```bash
# From project root
cd swift-catalog-admin

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

**Admin panel is now running at**: `http://localhost:5174`

## Step 3: Test the Application (4 minutes)

### 1. Visit Frontend
- Open `http://localhost:5173`
- Click `/shop` to see 20+ furniture products loaded from database

### 2. Create Account
- Click `Sign up` in header
- Fill in: First name, Last name, Email, Password
- Confirm password
- Click "Sign Up"
- You'll be auto-logged in

### 3. Add Items to Cart
- Go to Shop page
- Click "Add" on any product
- You'll be taken to cart page
- Quantity can be adjusted
- Click "Proceed to Checkout"

### 4. Checkout
- Enter shipping details (phone, address, city, postal code)
- Click "Continue"
- Review your order
- Click "Confirm Order"
- ✅ Order created successfully!

### 5. View Order in Admin Panel
- Go to `http://localhost:5174/admin`
- Click "Orders"
- You'll see your order in the table
- Click the eye icon to view details
- Click "Mark as Paid" to update payment status

### 6. Manage Products (Admin)
- Go to Admin Panel > Products
- Click "Add Product" button
- Fill in: Name, Category, Description, Price, Stock, SKU, Image URL
- Click "Save Product"
- New product appears immediately in Shop page!

## Database Info

Products are seeded with furniture from these categories:
- Sofas & Couches
- Dining Furniture
- Bedroom Furniture
- Office Furniture
- Storage Solutions
- Coffee Tables
- Outdoor Furniture
- Accent Furniture

All with realistic prices in AED (dirhams).

## API Endpoints Reference

### User Auth
- `POST http://localhost:8000/api/accounts/register/` - Sign up
- `POST http://localhost:8000/api/accounts/token/` - Login
- `GET http://localhost:8000/api/accounts/me/` - Get current user

### Products (Public)
- `GET http://localhost:8000/api/catalog/products/` - All products
- `GET http://localhost:8000/api/catalog/categories/` - All categories

### Cart & Orders (Authenticated)
- `GET http://localhost:8000/api/cart/` - Get user's cart
- `POST http://localhost:8000/api/cart/add/` - Add to cart
- `POST http://localhost:8000/api/orders/checkout/` - Create order

### Admin Panel (Admin Only)
- `GET http://localhost:8000/api/admin/orders/` - View all orders
- `PATCH http://localhost:8000/api/admin/orders/{id}/` - Update order
- `GET http://localhost:8000/api/catalog/admin/products/` - Manage products
- `GET http://localhost:8000/api/catalog/admin/categories/` - Manage categories

## Login to Django Admin

1. Go to `http://localhost:8000/admin`
2. Login with the superuser you created
3. Manage products, categories, and orders directly

## What's Working

✅ User registration and login
✅ JWT authentication (365-day tokens)
✅ Product catalog with 20+ items
✅ Shopping cart (stored in database for logged-in users)
✅ Checkout and order creation
✅ Order management in admin panel
✅ Product management (create, edit, delete)
✅ Category management
✅ Real-time API integration
✅ Responsive design (mobile, tablet, desktop)

## Troubleshooting

### Port Already in Use?
```bash
# Change backend port
python manage.py runserver 0.0.0.0:8001

# Change frontend port (set in vite.config.ts)
npm run dev -- --port 5175
```

### Database Issues?
```bash
# Reset database (deletes all data)
rm db.sqlite3
python manage.py migrate
python manage.py seed_data
```

### Products Not Loading?
1. Check backend is running: `http://localhost:8000/api/catalog/products/`
2. Check `.env.local` has correct API URL
3. Check browser console for errors (F12)

### Tokens Not Working?
- Clear localStorage: `F12 > Application > Storage > Clear All`
- Log out and log back in
- Try incognito/private window

## Next Steps

1. Customize product images by updating `SETUP_GUIDE.md`
2. Add payment gateway integration
3. Deploy to production
4. Set up email notifications
5. Add more features (reviews, wishlist, etc.)

## Environment Variables

The `.env.local` files are already created with:

**Main Frontend** (root/.env.local):
```
VITE_API_BASE=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
```

**Admin Panel** (swift-catalog-admin/.env.local):
```
VITE_API_URL=http://localhost:8000/api
```

These are pre-configured for local development!

## Need Help?

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `IMPLEMENTATION_SUMMARY.md` for feature documentation
- Check Django logs in terminal running `manage.py`
- Check browser console (F12) for frontend errors
- Check Network tab (F12) to debug API calls

---

**Enjoy your DynamiFurnish platform!** 🎉
