import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface ProductManagerProps {
  products?: Product[];
  onAddProduct?: () => void;
  onEditProduct?: (id: string) => void;
  onDeleteProduct?: (id: string) => void;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Pieczywo czosnkowe",
    category: "Dodatki",
    price: 5.99,
    description: "Świeżo pieczone pieczywo z masłem czosnkowym i ziołami",
    imageUrl: "https://images.unsplash.com/photo-1619531040576-f9416740661f",
  },
  {
    id: "2",
    name: "Sałatka Cezar",
    category: "Sałatki",
    price: 8.99,
    description: "Chrupiąca sałata rzymska z klasycznym sosem Cezar",
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
  },
  {
    id: "3",
    name: "Brownie czekoladowe",
    category: "Desery",
    price: 4.99,
    description: "Pyszne brownie z lodami waniliowymi",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
  },
];

const ProductManager = ({
  products = defaultProducts,
  onAddProduct = () => {},
  onEditProduct = () => {},
  onDeleteProduct = () => {},
}: ProductManagerProps) => {
  return (
    <div className="p-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <Input placeholder="Szukaj produktów..." className="max-w-xs" />

          <div className="flex gap-2 items-center">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="dodatki">Dodatki</SelectItem>
                <SelectItem value="salatki">Sałatki</SelectItem>
                <SelectItem value="desery">Desery</SelectItem>
                <SelectItem value="napoje">Napoje</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={onAddProduct} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onEdit={() => onEditProduct(product.id)}
              onDelete={() => onDeleteProduct(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
