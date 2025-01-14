import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PriceBySize {
  mini: number;
  small: number;
  medium: number;
  large: number;
}

interface IngredientCardProps {
  id?: string;
  name?: string;
  category?: "meats" | "veggies" | "cheeses";
  image?: string;
  prices?: PriceBySize;
  onSave?: (data: any) => void;
  onDelete?: () => void;
}

const categoryTranslations = {
  meats: "Mięsa",
  veggies: "Warzywa",
  cheeses: "Sery",
};

const defaultPrices: PriceBySize = {
  mini: 1.99,
  small: 2.99,
  medium: 3.99,
  large: 4.99,
};

const IngredientCard = ({
  id = "1",
  name = "Pepperoni",
  category = "meats",
  image = "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=300&h=300",
  prices = defaultPrices,
  onSave = () => {},
  onDelete = () => {},
}: IngredientCardProps) => {
  return (
    <Card className={`w-[300px] supabase-card pastel-card-${category}`}>
      <CardContent className="p-4 space-y-4">
        <div className="w-full h-[120px] rounded-lg overflow-hidden shadow-sm">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Nazwa składnika</Label>
            <Input
              placeholder="Wpisz nazwę składnika"
              value={name}
              onChange={() => {}}
              className="supabase-input mt-1.5"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Kategoria</Label>
            <Select value={category} onValueChange={() => {}}>
              <SelectTrigger className="supabase-input mt-1.5">
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryTranslations).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Ceny według rozmiaru</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {Object.entries(prices).map(([size, price]) => (
                <div key={size}>
                  <Label className="text-xs text-muted-foreground mb-1">
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
                    value={price}
                    onChange={() => {}}
                    className="supabase-input text-right"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          variant="destructive"
          onClick={onDelete}
          size="sm"
          className="supabase-button"
        >
          Usuń
        </Button>
        <Button
          variant="default"
          onClick={() => onSave({ id, name, category, prices })}
          size="sm"
          className="supabase-button"
        >
          Zapisz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IngredientCard;
