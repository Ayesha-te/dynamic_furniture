import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, ChevronRight, Filter } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/use-categories";
import { Checkbox } from "@/components/ui/checkbox";

type CategoryType = "all" | "main" | "sub";
type StatusFilter = "all" | "active" | "inactive";

export default function Categories() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryType, setCategoryType] = useState<CategoryType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
    parent_category_id: null as number | null,
  });

  const handleOpenDialog = (category?: any, asSubcategory = false) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        parent_category_id: category.parent_category_id || null,
      });
      setCreatingSubcategory(false);
    } else if (asSubcategory && editingCategory) {
      setCreatingSubcategory(true);
      setFormData({
        name: "",
        description: "",
        is_active: true,
        parent_category_id: editingCategory.id,
      });
    } else {
      setEditingCategory(null);
      setCreatingSubcategory(false);
      setFormData({
        name: "",
        description: "",
        is_active: true,
        parent_category_id: null,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (creatingSubcategory) {
        await createCategory.mutateAsync(formData);
        setCreatingSubcategory(false);
        setFormData({
          name: "",
          description: "",
          is_active: true,
          parent_category_id: null,
        });
      } else if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: formData,
        });
        setIsDialogOpen(false);
        setEditingCategory(null);
      } else {
        await createCategory.mutateAsync(formData);
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory.mutateAsync(id);
    }
  };

  // Filter categories and subcategories based on filters
  const filteredData = categories
    .filter((category: any) => {
      // Search query filter
      if (searchQuery && !category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category type filter
      if (categoryType !== "all") {
        const isMain = !category.parent_category_id;
        if (categoryType === "main" && !isMain) return false;
        if (categoryType === "sub" && isMain) return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "active" && !category.is_active) return false;
        if (statusFilter === "inactive" && category.is_active) return false;
      }

      return true;
    })
    .map((category: any) => ({
      ...category,
      subcategories: category.subcategories?.filter((subcat: any) => {
        // Search query filter for subcategories
        if (searchQuery && !subcat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Status filter for subcategories
        if (statusFilter !== "all") {
          if (statusFilter === "active" && !subcat.is_active) return false;
          if (statusFilter === "inactive" && subcat.is_active) return false;
        }

        return true;
      }) || [],
    }));

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryType("all");
    setStatusFilter("all");
  };

  const hasActiveFilters = searchQuery || categoryType !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {creatingSubcategory 
                  ? `Add Sub-Category to ${editingCategory?.name}` 
                  : editingCategory 
                  ? "Edit Category" 
                  : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {creatingSubcategory && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-700">
                    Creating sub-category under <strong>{editingCategory?.name}</strong>
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="resize-none"
                  rows={3}
                />
              </div>
              {!creatingSubcategory && (
                <div>
                  <Label htmlFor="parent">Parent Category (Optional)</Label>
                  <Select
                    value={formData.parent_category_id?.toString() || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        parent_category_id: value === "none" ? null : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger id="parent">
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Main Category)</SelectItem>
                      {categories
                        ?.filter((cat: any) => cat.id !== editingCategory?.id && !cat.parent_category_id)
                        .map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked as boolean })
                  }
                />
                <Label htmlFor="is_active" className="font-normal cursor-pointer">
                  Active
                </Label>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={createCategory.isPending || updateCategory.isPending || !formData.name}
                >
                  {createCategory.isPending || updateCategory.isPending
                    ? "Saving..."
                    : "Save"}
                </Button>
                {creatingSubcategory && (
                  <Button
                    onClick={() => {
                      setCreatingSubcategory(false);
                      setFormData({
                        name: "",
                        description: "",
                        is_active: true,
                        parent_category_id: null,
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            {/* Search */}
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Category name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Type Filter */}
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={categoryType} onValueChange={(val) => setCategoryType(val as CategoryType)}>
                <SelectTrigger id="type-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="main">Main Categories</SelectItem>
                  <SelectItem value="sub">Sub Categories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as StatusFilter)}>
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
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground pt-4 border-t mt-4">
              Showing {filteredData.length + filteredData.reduce((sum: number, cat: any) => sum + (cat.subcategories?.length || 0), 0)} of {categories.length + categories.reduce((sum: number, cat: any) => sum + (cat.subcategories?.length || 0), 0)} categories
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Categories</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {categories.length} total categories
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : filteredData.length === 0 && categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No categories yet</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Category
              </Button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories match your filters</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-2/5">Name</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold w-24">Type</TableHead>
                    <TableHead className="font-semibold w-24">Status</TableHead>
                    <TableHead className="text-right font-semibold w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.flatMap((category: any) => {
                    const rows: any[] = [];
                    rows.push(
                      <TableRow key={`category-${category.id}`}>
                        <TableCell className="font-medium align-top">
                          <div>
                            <div className="flex items-center gap-2">
                              {category.subcategories && category.subcategories.length > 0 && (
                                <button
                                  onClick={() => {
                                    const newExpanded = new Set(expandedCategories);
                                    if (newExpanded.has(category.id)) {
                                      newExpanded.delete(category.id);
                                    } else {
                                      newExpanded.add(category.id);
                                    }
                                    setExpandedCategories(newExpanded);
                                  }}
                                  className="p-1 hover:bg-muted rounded"
                                >
                                  <ChevronRight
                                    size={16}
                                    className={`transition-transform ${expandedCategories.has(category.id) ? "rotate-90" : ""}`}
                                  />
                                </button>
                              )}
                              <span>{category.name}</span>
                            </div>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <div className="mt-1">
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                  {category.subcategories.length} sub
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">{category.description || "-"}</TableCell>
                        <TableCell className="align-top">
                          <div className="mt-1">
                            <span className="text-xs bg-secondary px-2 py-1 rounded font-medium">
                              Main
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          {category.is_active ? (
                            <span className="text-green-600 font-medium">Active</span>
                          ) : (
                            <span className="text-gray-400">Inactive</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-1 align-top">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleOpenDialog(category);
                            }}
                            title="Edit category"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category);
                              handleOpenDialog(null, true);
                            }}
                            title="Add sub-category"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={deleteCategory.isPending}
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                    
                    if (expandedCategories.has(category.id) && category.subcategories) {
                      category.subcategories.forEach((subcat: any) => {
                        rows.push(
                          <TableRow key={`subcat-${subcat.id}`} className="bg-muted/50">
                            <TableCell className="font-medium pl-12">
                              <span className="text-muted-foreground">└─ {subcat.name}</span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{subcat.description || "-"}</TableCell>
                            <TableCell>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                Sub
                              </span>
                            </TableCell>
                            <TableCell>
                              {subcat.is_active ? (
                                <span className="text-green-600 font-medium">Active</span>
                              ) : (
                                <span className="text-gray-400">Inactive</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(subcat)}
                                title="Edit sub-category"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(subcat.id)}
                                disabled={deleteCategory.isPending}
                                title="Delete sub-category"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      });
                    }
                    
                    return rows;
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}