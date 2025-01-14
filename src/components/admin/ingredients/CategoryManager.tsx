import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";

interface CategoryPrices {
  mini: number;
  small: number;
  medium: number;
  large: number;
}

interface Category {
  id: string;
  name: string;
  prices: CategoryPrices;
}

interface CategoryManagerProps {
  categories?: Category[];
  onAddCategory?: (category: Omit<Category, "id">) => void;
  onEditCategory?: (id: string, category: Omit<Category, "id">) => void;
  onDeleteCategory?: (id: string) => void;
}

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Mięsa",
    prices: { mini: 2.99, small: 3.99, medium: 4.99, large: 5.99 },
  },
  {
    id: "2",
    name: "Warzywa",
    prices: { mini: 1.99, small: 2.99, medium: 3.99, large: 4.99 },
  },
  {
    id: "3",
    name: "Sery",
    prices: { mini: 2.49, small: 3.49, medium: 4.49, large: 5.49 },
  },
];

const CategoryManager = ({
  categories = defaultCategories,
  onAddCategory = () => {},
  onEditCategory = () => {},
  onDeleteCategory = () => {},
}: CategoryManagerProps) => {
  const [newCategory, setNewCategory] = React.useState({
    name: "",
    prices: { mini: 0, small: 0, medium: 0, large: 0 },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(newCategory);
    setNewCategory({
      name: "",
      prices: { mini: 0, small: 0, medium: 0, large: 0 },
    });
  };

  return (
    <Card className="supabase-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">
          Kategorie składników
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-1">
              <Label className="text-sm font-medium">Nazwa kategorii</Label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nazwa kategorii"
                className="supabase-input mt-1.5"
              />
            </div>
            <div className="md:col-span-4 grid grid-cols-4 gap-4">
              {Object.entries(newCategory.prices).map(([size]) => (
                <div key={size}>
                  <Label className="text-sm font-medium">
                    Cena{" "}
                    {size === "mini"
                      ? "Mini"
                      : size === "small"
                        ? "Mała"
                        : size === "medium"
                          ? "Średnia"
                          : "Duża"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCategory.prices[size as keyof CategoryPrices]}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        prices: {
                          ...prev.prices,
                          [size]: parseFloat(e.target.value),
                        },
                      }))
                    }
                    className="supabase-input mt-1.5"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" className="supabase-button">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj kategorię
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium">{category.name}</h4>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {Object.entries(category.prices).map(([size, price]) => (
                    <div key={size} className="text-sm text-muted-foreground">
                      {size === "mini"
                        ? "Mini"
                        : size === "small"
                          ? "Mała"
                          : size === "medium"
                            ? "Średnia"
                            : "Duża"}
                      : {price} zł
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onEditCategory(category.id, {
                      name: category.name,
                      prices: category.prices,
                    })
                  }
                  className="supabase-button"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteCategory(category.id)}
                  className="supabase-button text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
