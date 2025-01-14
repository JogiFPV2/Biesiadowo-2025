import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";

interface MenuCategory {
  id: string;
  name: string;
}

interface MenuCategoryManagerProps {
  categories?: MenuCategory[];
  onAddCategory?: (category: Omit<MenuCategory, "id">) => void;
  onEditCategory?: (id: string, category: Omit<MenuCategory, "id">) => void;
  onDeleteCategory?: (id: string) => void;
}

const defaultCategories: MenuCategory[] = [
  { id: "1", name: "Klasyczne" },
  { id: "2", name: "Wegetariańskie" },
  { id: "3", name: "Ostre" },
];

const MenuCategoryManager = ({
  categories = defaultCategories,
  onAddCategory = () => {},
  onEditCategory = () => {},
  onDeleteCategory = () => {},
}: MenuCategoryManagerProps) => {
  const [newCategory, setNewCategory] = React.useState({ name: "" });
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory(newCategory);
    setNewCategory({ name: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategorie menu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Nazwa kategorii</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
                placeholder="Wprowadź nazwę kategorii"
                required
              />
            </div>
            <Button type="submit" className="mt-8">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj
            </Button>
          </div>
        </form>

        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              {editingId === category.id ? (
                <Input
                  value={category.name}
                  onChange={(e) =>
                    onEditCategory(category.id, { name: e.target.value })
                  }
                  className="flex-1 mr-2"
                  autoFocus
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
                />
              ) : (
                <span className="flex-1">{category.name}</span>
              )}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingId(category.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteCategory(category.id)}
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

export default MenuCategoryManager;
