import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, Package, Filter } from "lucide-react";
import { useOrders, useOrder, useMarkOrderAsPaid, useMarkOrderAsShipped } from "@/hooks/use-orders";

type OrderStatus = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";
type DateFilter = "all" | "today" | "week" | "month" | "custom";

export default function Orders() {
  const { data: orders = [], isLoading } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { data: selectedOrder } = useOrder(selectedOrderId ?? 0);
  const markPaid = useMarkOrderAsPaid();
  const markShipped = useMarkOrderAsShipped();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [minTotal, setMinTotal] = useState<string>("");
  const [maxTotal, setMaxTotal] = useState<string>("");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "secondary";
      case "processing":
        return "secondary";
      case "shipped":
        return "default";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get date range based on filter
  const getDateRange = (filter: DateFilter) => {
    const now = new Date();
    let startDate = new Date(0); // Beginning of time for "all"

    switch (filter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "custom":
        if (customStartDate) {
          startDate = new Date(customStartDate);
        }
        break;
      case "all":
        startDate = new Date(0);
        break;
    }

    let endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next day to include today
    if (dateFilter === "custom" && customEndDate) {
      endDate = new Date(customEndDate);
      endDate.setDate(endDate.getDate() + 1); // Include the end date
    }

    return { startDate, endDate };
  };

  // Filter orders
  const filteredOrders = orders.filter((order: any) => {
    // Status filter
    if (statusFilter !== "all" && order.status?.toLowerCase() !== statusFilter) {
      return false;
    }

    // Date filter
    const { startDate, endDate } = getDateRange(dateFilter);
    const orderDate = new Date(order.created_at);
    if (orderDate < startDate || orderDate > endDate) {
      return false;
    }

    // Total amount filter
    const total = parseFloat(order.total_amount);
    if (minTotal && total < parseFloat(minTotal)) {
      return false;
    }
    if (maxTotal && total > parseFloat(maxTotal)) {
      return false;
    }

    // Search filter (customer name, email, or order ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const customerName = (order.user?.username || order.user?.email || "").toLowerCase();
      const customerEmail = (order.user?.email || "").toLowerCase();
      const orderId = order.id.toString();

      if (
        !customerName.includes(query) &&
        !customerEmail.includes(query) &&
        !orderId.includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  const handleClearFilters = () => {
    setStatusFilter("all");
    setDateFilter("all");
    setMinTotal("");
    setMaxTotal("");
    setCustomStartDate("");
    setCustomEndDate("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    dateFilter !== "all" ||
    minTotal ||
    maxTotal ||
    searchQuery;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and deliveries</p>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filters</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Customer, email, or order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val as OrderStatus)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <Label htmlFor="date-filter">Date</Label>
              <Select
                value={dateFilter}
                onValueChange={(val) => setDateFilter(val as DateFilter)}
              >
                <SelectTrigger id="date-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Min Total */}
            <div>
              <Label htmlFor="min-total">Min Total (AED)</Label>
              <Input
                id="min-total"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={minTotal}
                onChange={(e) => setMinTotal(e.target.value)}
              />
            </div>

            {/* Max Total */}
            <div>
              <Label htmlFor="max-total">Max Total (AED)</Label>
              <Input
                id="max-total"
                type="number"
                placeholder="10000.00"
                step="0.01"
                value={maxTotal}
                onChange={(e) => setMaxTotal(e.target.value)}
              />
            </div>
          </div>

          {/* Custom Date Range (shown when custom is selected) */}
          {dateFilter === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground pt-2 border-t">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Orders {filteredOrders.length < orders.length && `(${filteredOrders.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    Loading orders...
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {order.user?.username || order.user?.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{order.user?.email}</TableCell>
                    <TableCell>{order.phone || "-"}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {order.address || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      AED {Number(order.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(order.status as string) as any}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - #{order.id}</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && selectedOrder.id === order.id && (
                            <div className="space-y-6 pb-6">
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">
                                      Customer Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2 text-sm">
                                    <div>
                                      <p className="font-medium text-foreground">
                                        {selectedOrder.user?.username ||
                                          selectedOrder.user?.email}
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedOrder.user?.email}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">
                                      Delivery Details
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2 text-sm">
                                    <div>
                                      <p className="font-medium text-foreground">
                                        Phone:
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedOrder.phone || "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground">
                                        Address:
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedOrder.address || "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground">
                                        City:
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedOrder.city || "-"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground">
                                        Postal Code:
                                      </p>
                                      <p className="text-muted-foreground">
                                        {selectedOrder.postal_code || "-"}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">
                                    Order Items
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Color</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.items.map(
                                        (item: any, idx: number) => (
                                          <TableRow key={idx}>
                                            <TableCell>
                                              {item.product?.name}
                                            </TableCell>
                                            <TableCell>
                                              {item.color || "Default"}
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>
                                              AED {Number(item.price).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                              AED{" "}
                                              {(
                                                Number(item.quantity) *
                                                Number(item.price)
                                              ).toFixed(2)}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                      <TableRow>
                                        <TableCell
                                          colSpan={4}
                                          className="font-bold text-right"
                                        >
                                          Total:
                                        </TableCell>
                                        <TableCell className="font-bold">
                                          AED{" "}
                                          {Number(
                                            selectedOrder.total_amount
                                          ).toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>

                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  className="flex-1"
                                  onClick={() => markShipped.mutate(selectedOrder.id)}
                                  disabled={
                                    markShipped.isPending ||
                                    selectedOrder.status === "shipped"
                                  }
                                >
                                  <Package className="mr-2 h-4 w-4" />
                                  {markShipped.isPending
                                    ? "Updating..."
                                    : "Mark as Shipped"}
                                </Button>
                                <Button
                                  variant="default"
                                  className="flex-1"
                                  onClick={() => markPaid.mutate(selectedOrder.id)}
                                  disabled={
                                    markPaid.isPending || selectedOrder.is_paid
                                  }
                                >
                                  {markPaid.isPending ? "Updating..." : "Mark as Paid"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}