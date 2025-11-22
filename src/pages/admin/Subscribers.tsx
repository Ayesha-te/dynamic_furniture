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
import { Mail, Trash2, ToggleLeft, ToggleRight, Download, Filter } from "lucide-react";
import { useAllSubscribers, useUnsubscribe, useToggleSubscriber } from "@/hooks/use-newsletter";

type StatusFilter = "all" | "active" | "inactive";
type SubscribedFilter = "all" | "subscribed" | "unsubscribed";

export default function Subscribers() {
  const { data: subscribers = [], isLoading } = useAllSubscribers();
  const unsubscribe = useUnsubscribe();
  const toggleSubscriber = useToggleSubscriber();
  
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [subscribedFilter, setSubscribedFilter] = useState<SubscribedFilter>("all");

  // Filter subscribers based on all filters
  const filteredSubscribers = subscribers.filter((sub: any) => {
    // Email search filter
    if (searchEmail && !sub.email.toLowerCase().includes(searchEmail.toLowerCase())) {
      return false;
    }

    // Status filter (Active/Inactive)
    if (statusFilter !== "all") {
      if (statusFilter === "active" && !sub.is_active) {
        return false;
      }
      if (statusFilter === "inactive" && sub.is_active) {
        return false;
      }
    }

    // Subscribed filter
    if (subscribedFilter !== "all") {
      // Assuming is_active means subscribed, not subscribed means unsubscribed
      if (subscribedFilter === "subscribed" && !sub.is_active) {
        return false;
      }
      if (subscribedFilter === "unsubscribed" && sub.is_active) {
        return false;
      }
    }

    return true;
  });

  const activeCount = subscribers.filter((sub: any) => sub.is_active).length;
  const inactiveCount = subscribers.filter((sub: any) => !sub.is_active).length;

  const handleExportCSV = () => {
    const headers = ["Email", "Subscribed Date", "Status"];
    const rows = filteredSubscribers.map((sub: any) => [
      sub.email,
      new Date(sub.subscribed_at).toLocaleString(),
      sub.is_active ? "Active" : "Inactive",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", `subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClearFilters = () => {
    setSearchEmail("");
    setStatusFilter("all");
    setSubscribedFilter("all");
  };

  const hasActiveFilters = searchEmail || statusFilter !== "all" || subscribedFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">Manage newsletter subscriptions</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{subscribers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{inactiveCount}</p>
          </CardContent>
        </Card>
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
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search by Email */}
            <div>
              <Label htmlFor="search-email">Search Email</Label>
              <Input
                id="search-email"
                type="email"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val as StatusFilter)}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subscribed Filter */}
            <div>
              <Label htmlFor="subscribed-filter">Subscription</Label>
              <Select
                value={subscribedFilter}
                onValueChange={(val) => setSubscribedFilter(val as SubscribedFilter)}
              >
                <SelectTrigger id="subscribed-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subscriptions</SelectItem>
                  <SelectItem value="subscribed">Subscribed</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground pt-4 border-t">
              Showing {filteredSubscribers.length} of {subscribers.length} subscribers
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Subscribers {filteredSubscribers.length < subscribers.length && `(${filteredSubscribers.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Loading subscribers...
                  </TableCell>
                </TableRow>
              ) : filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    {subscribers.length === 0
                      ? "No subscribers found"
                      : "No subscribers match your filters"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber: any) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {subscriber.email}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(subscriber.subscribed_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                        {subscriber.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                toggleSubscriber.mutate({
                                  id: subscriber.id,
                                  isActive: subscriber.is_active,
                                })
                              }
                              disabled={toggleSubscriber.isPending}
                              title={
                                subscriber.is_active
                                  ? "Deactivate subscriber"
                                  : "Activate subscriber"
                              }
                            >
                              {subscriber.is_active ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => unsubscribe.mutate(subscriber.id)}
                          disabled={unsubscribe.isPending}
                          title="Remove subscriber"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}