import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

type SalesFilter = "week" | "month" | "year" | "all";

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [salesFilter, setSalesFilter] = useState<SalesFilter>("month");

  // Calculate date range based on filter
  const getDateRange = (filter: SalesFilter) => {
    const now = new Date();
    let startDate = new Date();

    switch (filter) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        break;
    }

    return { startDate, endDate: now };
  };

  // Calculate total sales based on filter
  const calculateTotalSales = (ordersData: any[], filter: SalesFilter) => {
    const { startDate, endDate } = getDateRange(filter);

    return ordersData
      .filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate && order.is_paid;
      })
      .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Try lightweight fast stats endpoint first for instant UI
        const stats = await apiClient.getAdminStats();

        setProductCount(stats.product_count ?? 0);
        setCategoryCount(stats.category_count ?? 0);
        setOrderCount(stats.order_count ?? 0);
        setOrders((stats.recent_orders || []).slice(0, 4));
        setLowStockProducts((stats.low_stock || []).slice(0, 4));

        // Calculate total sales for default filter (month)
        const sales = calculateTotalSales(stats.recent_orders || [], salesFilter);
        setTotalSales(sales);

        // Kick off background full-list loads to warm caches (don't block UI)
        (async () => {
          try {
            const [products, categories, fetchedOrders] = await Promise.all([
              apiClient.getProducts(),
              apiClient.getCategories(),
              apiClient.getOrders(),
            ]);

            setProductCount(products.length);
            setCategoryCount(categories.length);
            setOrderCount(fetchedOrders.length);
            setOrders(fetchedOrders.slice(0, 4));
            setLowStockProducts(products.filter((p) => p.stock < 10).slice(0, 4));

            // Recalculate sales with full data
            const fullSales = calculateTotalSales(fetchedOrders, salesFilter);
            setTotalSales(fullSales);
          } catch (e) {
            // Background fetch failed; ignore (stats already shown)
            console.debug('Background dashboard warm-up failed', e);
          }
        })();
      } catch (error) {
        // If stats endpoint isn't available, fall back to original heavier parallel load
        console.warn('getAdminStats failed, falling back to full loads', error);
        try {
          const [products, categories, fetchedOrders] = await Promise.all([
            apiClient.getProducts(),
            apiClient.getCategories(),
            apiClient.getOrders(),
          ]);

          setProductCount(products.length);
          setCategoryCount(categories.length);
          setOrderCount(fetchedOrders.length);
          setOrders(fetchedOrders.slice(0, 4));
          setLowStockProducts(products.filter((p) => p.stock < 10).slice(0, 4));

          // Calculate sales
          const sales = calculateTotalSales(fetchedOrders, salesFilter);
          setTotalSales(sales);
        } catch (e) {
          console.error("Failed to load dashboard data", e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Update sales when filter changes
  useEffect(() => {
    if (orders.length > 0) {
      const sales = calculateTotalSales(orders, salesFilter);
      setTotalSales(sales);
    }
  }, [salesFilter, orders]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store</p>
        </div>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  const stats = [
    { name: "Total Products", value: productCount.toString(), icon: Package },
    { name: "Total Orders", value: orderCount.toString(), icon: ShoppingCart },
    { name: "Categories", value: categoryCount.toString(), icon: Tag },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Sales Card with Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Total Sales</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Revenue overview</p>
          </div>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="text-4xl font-bold text-foreground mb-2">
              ${totalSales.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground">
              {salesFilter === "week"
                ? "Sales this week"
                : salesFilter === "month"
                ? "Sales this month"
                : salesFilter === "year"
                ? "Sales this year"
                : "Total sales all time"}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={salesFilter === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setSalesFilter("week")}
              className="text-xs"
            >
              This Week
            </Button>
            <Button
              variant={salesFilter === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSalesFilter("month")}
              className="text-xs"
            >
              This Month
            </Button>
            <Button
              variant={salesFilter === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setSalesFilter("year")}
              className="text-xs"
            >
              This Year
            </Button>
            <Button
              variant={salesFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSalesFilter("all")}
              className="text-xs"
            >
              All Time
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium text-foreground">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.user?.username || "Unknown"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${parseFloat(order.total_amount).toFixed(2)}</p>
                      <p className={`text-sm font-medium ${order.is_paid ? "text-green-600" : "text-yellow-600"}`}>
                        {order.is_paid ? "Paid" : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">All products well stocked</p>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-destructive">{product.stock} left</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}