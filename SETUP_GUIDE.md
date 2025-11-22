# DynamiFurnish Setup & Testing Guide

## Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (or use SQLite for development)
- Git

## Backend Setup

### 1. Set up Django Backend

```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Database

The project uses SQLite by default for development. To use PostgreSQL, set `DATABASE_URL`:

```bash
# Windows PowerShell:
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/dynamifurnish"

# Or create a .env file in backend/ directory:
# DATABASE_URL=postgresql://user:password@localhost:5432/dynamifurnish
```

### 3. Run Migrations & Seed Data

```bash
python manage.py migrate
python manage.py seed_data
python manage.py createsuperuser  # Create admin user
```

Note: After these changes a new `ProductDiscount`-related field is used by the API. If you pull changes from the repo, run:

```bash
python manage.py makemigrations
python manage.py migrate
```
to ensure the database schema is up-to-date.

### 4. Start Django Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

Django API will be available at: `http://localhost:8000/api`
Django Admin: `http://localhost:8000/admin`

## Frontend Setup

### 1. Main React Frontend

```bash
cd dynamifurnish-reimagined  # Root directory

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 2. Admin Panel

```bash
cd swift-catalog-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Admin panel will be available at: `http://localhost:5174` (or next available port)

## API Endpoints

### Authentication
- `POST /api/accounts/register/` - Register new user
- `POST /api/accounts/token/` - Login (get JWT tokens)
- `POST /api/accounts/token/refresh/` - Refresh access token
- `GET /api/accounts/me/` - Get current user info

### Catalog (Public)
- `GET /api/catalog/products/` - List all products
- `GET /api/catalog/products/{id}/` - Get product details
- `GET /api/catalog/categories/` - List all categories

### Catalog (Admin Only)
- `GET /api/catalog/admin/products/` - List all products (admin)
- `POST /api/catalog/admin/products/` - Create product
- `PATCH /api/catalog/admin/products/{id}/` - Update product
- `DELETE /api/catalog/admin/products/{id}/` - Delete product
- `GET /api/catalog/admin/categories/` - List categories (admin)
- `POST /api/catalog/admin/categories/` - Create category
- `PATCH /api/catalog/admin/categories/{id}/` - Update category
- `DELETE /api/catalog/admin/categories/{id}/` - Delete category

### Cart & Orders
- `GET /api/cart/` - Get user's active cart
- `POST /api/cart/add/` - Add item to cart
- `POST /api/cart/remove/` - Remove item from cart
- `POST /api/orders/checkout/` - Create order from cart
- `GET /api/admin/orders/` - List all orders (admin only)
- `GET /api/admin/orders/{id}/` - Get order details
- `PATCH /api/admin/orders/{id}/` - Update order (mark as paid, etc.)

## Testing Workflow

### 1. Test User Registration & Login

1. Go to `http://localhost:5173/signup`
2. Create a new account with email and password
3. You should be redirected to home page
4. Check header - you should see your username and a logout button

### 2. Test Product Browsing

1. Go to `http://localhost:5173/shop`
2. Products should load from the database
3. You should see categories and price filters
4. Click on products to view details

### 3. Test Add to Cart

1. From Shop page, click "Add" button on any product
2. You should be redirected to Cart page
3. Product should appear in cart with quantity control
4. If logged out, cart items are stored in localStorage

### 4. Test Checkout

1. Go to Cart page
2. Select items you want to purchase
3. Click "Proceed to Checkout"
4. You'll be prompted to login if not already logged in
5. Enter shipping details
6. Review order and click "Confirm Order"
7. Order should be created

### 5. Test Admin Panel

1. Go to `http://localhost:5174/admin`
2. Products page:
   - Click "Add Product" to create new product
   - Click Edit to modify existing products
   - Click Delete to remove products
3. Categories page:
   - Add, edit, and delete categories
4. Orders page:
   - View all customer orders
   - Click view icon to see order details
   - Click "Mark as Paid" to update payment status

### 6. Test Django Admin

1. Go to `http://localhost:8000/admin`
2. Login with superuser account
3. View and manage:
   - Products
   - Categories
   - Orders
   - Users

## Key Features Implemented

✅ **Authentication**
- User registration and login with JWT tokens
- Long-lived tokens (365 days)
- Token refresh mechanism
- Auto-login after registration

✅ **Shopping**
- Browse products and categories
- Add items to cart (registered and guest)
- Cart management (add, remove, update quantity)
- Checkout with shipping details
- Order creation

✅ **Admin Panel**
- Product management (CRUD operations)
- Category management (CRUD operations)
- Order management
- Mark orders as paid
- Real-time API integration

✅ **Backend API**
- RESTful API with JWT authentication
- Admin-only endpoints for management
- Product and category management
- Order tracking and status updates
- Cart management

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
```

### Admin Panel (.env.local)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (optional .env file)
```
DATABASE_URL=postgresql://user:password@localhost:5432/dynamifurnish
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
```

## Troubleshooting

### CORS Errors
- Ensure Django backend is running on port 8000
- CORS is enabled in Django settings for all origins

### 401 Unauthorized in Admin Panel
- Check that you're using the correct API URL
- Ensure access token is stored in `admin_token` localStorage key
- Currently admin panel uses token from `localStorage.getItem('admin_token')`
- You may need to manually set this or implement proper login

### Products Not Loading
- Check that `python manage.py seed_data` was run
- Verify API endpoint is accessible: `http://localhost:8000/api/catalog/products/`
- Check browser console for network errors

### Cart Not Persisting
- For logged-in users: Check JWT token validity
- For guests: Check localStorage availability in browser
- Clear localStorage and try again if issues persist

## Production Notes

Before deploying to production:

1. Change `DEBUG=False` in Django settings
2. Use strong `DJANGO_SECRET_KEY`
3. Configure proper `ALLOWED_HOSTS`
4. Use environment variables for sensitive data
5. Set up PostgreSQL instead of SQLite
6. Use HTTPS
7. Configure CORS appropriately
8. Set up proper authentication for admin endpoints
9. Use gunicorn or similar WSGI server
10. Set up proper logging and monitoring

## Support

For issues or questions, check:
1. Django admin interface: `http://localhost:8000/admin`
2. Django logs: Check console output when running `python manage.py runserver`
3. Browser console: Check for JavaScript errors
4. Network tab: Verify API requests are being made correctly
