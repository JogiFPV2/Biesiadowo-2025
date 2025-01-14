import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductCardProps {
  id?: string;
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ProductCard = ({
  id = "1",
  name = "Pieczywo czosnkowe",
  category = "Dodatki",
  price = 5.99,
  description = "Świeżo pieczone pieczywo z masłem czosnkowym i ziołami",
  imageUrl = "https://images.unsplash.com/photo-1619531040576-f9416740661f",
  onEdit = () => {},
  onDelete = () => {},
}: ProductCardProps) => {
  return (
    <Card className="w-[300px] bg-background">
      <div className="relative h-32 w-full overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {category}
        </Badge>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div>
          <Label>Cena (zł)</Label>
          <Input
            type="number"
            value={price}
            onChange={() => {}}
            className="mt-1"
            step="0.01"
            min="0"
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edytuj
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Usuń
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
