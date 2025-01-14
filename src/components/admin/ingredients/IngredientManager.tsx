import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import CategoryManager from "./CategoryManager";

interface Ingredient {
  id: string;
  name: string;
  category: "meats" | "veggies" | "cheeses";
}

interface IngredientManagerProps {
  ingredients?: Ingredient[];
  onAddIngredient?: (ingredient: Omit<Ingredient, "id">) => void;
  onDeleteIngredient?: (id: string) => void;
}

const defaultIngredients: Ingredient[] = [
  { id: "1", name: "Pepperoni", category: "meats" },
  { id: "2", name: "Pieczarki", category: "veggies" },
];

const categoryTranslations = {
  meats: "Mięsa",
  veggies: "Warzywa",
  cheeses: "Sery",
};

const IngredientManager = ({
  ingredients = defaultIngredients,
  onAddIngredient = () => {},
  onDeleteIngredient = () => {},
}: IngredientManagerProps) => {
  const [newIngredient, setNewIngredient] = React.useState({
    name: "",
    category: "meats",
  });

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIngredient(newIngredient);
    setNewIngredient({
      name: "",
      category: "meats",
    });
  };

  return (
    <div className="p-4 bg-background">
      <div className="max-w-3xl mx-auto space-y-4">
        <Tabs defaultValue="add" className="space-y-4">
          <TabsList>
            <TabsTrigger value="add">Dodaj składnik</TabsTrigger>
            <TabsTrigger value="categories">Kategorie</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dodaj nowy składnik</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddIngredient} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nazwa składnika</Label>
                      <Input
                        value={newIngredient.name}
                        onChange={(e) =>
                          setNewIngredient((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Wprowadź nazwę składnika"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Kategoria</Label>
                      <Select
                        value={newIngredient.category}
                        onValueChange={(
                          value: "meats" | "veggies" | "cheeses",
                        ) =>
                          setNewIngredient((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz kategorię" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meats">Mięsa</SelectItem>
                          <SelectItem value="veggies">Warzywa</SelectItem>
                          <SelectItem value="cheeses">Sery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Dodaj składnik
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Lista dodanych składników */}
              <Card>
                <CardHeader>
                  <CardTitle>Lista składników</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {ingredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className={`flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 transition-colors pastel-card-${ingredient.category}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{ingredient.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {categoryTranslations[ingredient.category]}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteIngredient(ingredient.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {ingredients.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Brak dodanych składników
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IngredientManager;
