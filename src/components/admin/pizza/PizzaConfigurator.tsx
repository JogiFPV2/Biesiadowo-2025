import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import MenuCategoryManager from "./MenuCategoryManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ingredient {
  id: string;
  name: string;
  category: string;
}

interface MenuCategory {
  id: string;
  name: string;
}

interface Pizza {
  id: string;
  number: string;
  name: string;
  ingredients: string[];
  menuCategory: string;
  prices: {
    mini: number;
    small: number;
    medium: number;
    large: number;
  };
}

interface PizzaConfiguratorProps {
  ingredients?: Ingredient[];
  menuCategories?: MenuCategory[];
  pizzas?: Pizza[];
  onAddPizza?: (pizza: Omit<Pizza, "id">) => void;
  onDeletePizza?: (id: string) => void;
}

const defaultIngredients: Ingredient[] = [
  { id: "1", name: "Pepperoni", category: "meats" },
  { id: "2", name: "Pieczarki", category: "veggies" },
];

const defaultMenuCategories: MenuCategory[] = [
  { id: "1", name: "Klasyczne" },
  { id: "2", name: "Wegetariańskie" },
];

const defaultPizzas: Pizza[] = [
  {
    id: "1",
    number: "1",
    name: "Margherita",
    ingredients: ["2"],
    menuCategory: "1",
    prices: { mini: 24.99, small: 29.99, medium: 34.99, large: 39.99 },
  },
  {
    id: "2",
    number: "2",
    name: "Pepperoni",
    ingredients: ["1", "2"],
    menuCategory: "1",
    prices: { mini: 27.99, small: 32.99, medium: 37.99, large: 42.99 },
  },
];

const PizzaConfigurator = ({
  ingredients = defaultIngredients,
  menuCategories = defaultMenuCategories,
  pizzas = defaultPizzas,
  onAddPizza = () => {},
  onDeletePizza = () => {},
}: PizzaConfiguratorProps) => {
  const [newPizza, setNewPizza] = React.useState({
    number: "",
    name: "",
    ingredients: [] as string[],
    menuCategory: "",
    prices: {
      mini: 0,
      small: 0,
      medium: 0,
      large: 0,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPizza(newPizza);
    setNewPizza({
      number: "",
      name: "",
      ingredients: [],
      menuCategory: "",
      prices: { mini: 0, small: 0, medium: 0, large: 0 },
    });
  };

  const getIngredientNames = (ingredientIds: string[]) => {
    return ingredientIds
      .map((id) => ingredients.find((ing) => ing.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const getCategoryName = (categoryId: string) => {
    return menuCategories.find((cat) => cat.id === categoryId)?.name || "";
  };

  return (
    <div className="p-4 bg-background">
      <div className="max-w-3xl mx-auto space-y-4">
        <Tabs defaultValue="pizza" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pizza">Pizza</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="pizza" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dodaj nową pizzę</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Numer</Label>
                      <Input
                        type="number"
                        value={newPizza.number}
                        onChange={(e) =>
                          setNewPizza((prev) => ({
                            ...prev,
                            number: e.target.value,
                          }))
                        }
                        placeholder="Nr pizzy"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nazwa pizzy</Label>
                      <Input
                        value={newPizza.name}
                        onChange={(e) =>
                          setNewPizza((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Nazwa pizzy"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Kategoria menu</Label>
                    <Select
                      value={newPizza.menuCategory}
                      onValueChange={(value) =>
                        setNewPizza((prev) => ({
                          ...prev,
                          menuCategory: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorię menu" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Składniki</Label>
                    <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                      {ingredients.map((ingredient) => (
                        <div
                          key={ingredient.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={ingredient.id}
                            checked={newPizza.ingredients.includes(
                              ingredient.id,
                            )}
                            onCheckedChange={(checked) => {
                              setNewPizza((prev) => ({
                                ...prev,
                                ingredients: checked
                                  ? [...prev.ingredients, ingredient.id]
                                  : prev.ingredients.filter(
                                      (id) => id !== ingredient.id,
                                    ),
                              }));
                            }}
                          />
                          <Label htmlFor={ingredient.id} className="text-sm">
                            {ingredient.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ceny</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {Object.entries(newPizza.prices).map(([size, price]) => (
                        <div key={size} className="space-y-2">
                          <Label className="text-sm">
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
                            value={price}
                            onChange={(e) =>
                              setNewPizza((prev) => ({
                                ...prev,
                                prices: {
                                  ...prev.prices,
                                  [size]: parseFloat(e.target.value),
                                },
                              }))
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Dodaj pizzę
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista dodanych pizz */}
            <Card>
              <CardHeader>
                <CardTitle>Lista pizz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pizzas.map((pizza) => (
                    <div
                      key={pizza.id}
                      className="flex items-start justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">#{pizza.number}</span>
                          <span className="font-medium">{pizza.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({getCategoryName(pizza.menuCategory)})
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Składniki: {getIngredientNames(pizza.ingredients)}
                        </p>
                        <div className="flex gap-4 text-sm">
                          {Object.entries(pizza.prices).map(([size, price]) => (
                            <span key={size}>
                              {size === "mini"
                                ? "Mini"
                                : size === "small"
                                  ? "Mała"
                                  : size === "medium"
                                    ? "Średnia"
                                    : "Duża"}
                              : {price} zł
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeletePizza(pizza.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {pizzas.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Brak dodanych pizz
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <MenuCategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PizzaConfigurator;
