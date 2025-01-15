import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pizza,
  UtensilsCrossed,
  Store,
  ShoppingBag,
  Bike,
  CreditCard,
  Banknote,
  Check,
  X,
  Clock,
  Plus,
} from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  category: string;
}

interface MenuItem {
  id: string;
  number: string;
  name: string;
  category: string;
  price: number;
  type: "pizza" | "product";
  size?: "mini" | "small" | "medium" | "large";
  ingredients?: Ingredient[];
}

interface MenuCategory {
  id: string;
  name: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
  size: "mini" | "small" | "medium" | "large";
  ingredients: Ingredient[];
}

interface Order {
  id: string;
  items: OrderItem[];
  type: "dine-in" | "takeout" | "delivery";
  paymentMethod: "cash" | "card";
  isPaid: boolean;
  address?: string;
  phone?: string;
  notes?: string;
  total: number;
  isSaved: boolean;
  status: "pending" | "preparing" | "ready" | "delivering" | "delivered";
  orderTime: Date;
  pickupTime: Date;
}

interface WaiterViewProps {
  menuItems?: MenuItem[];
  menuCategories?: MenuCategory[];
  ingredients?: Ingredient[];
  ingredientCategories?: {
    id: string;
    name: string;
    prices: {
      mini: number;
      small: number;
      medium: number;
      large: number;
    };
  }[];
}

const defaultIngredientCategories = [
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

const defaultIngredients = [
  { id: "1", name: "Pepperoni", category: "Mięsa" },
  { id: "2", name: "Pieczarki", category: "Warzywa" },
  { id: "3", name: "Mozzarella", category: "Sery" },
];

const defaultCategories: MenuCategory[] = [
  { id: "1", name: "Klasyczne" },
  { id: "2", name: "Wegetariańskie" },
  { id: "3", name: "Dodatki" },
  { id: "4", name: "Napoje" },
];

const defaultMenuItems: MenuItem[] = [
  {
    id: "1",
    number: "1",
    name: "Margherita",
    category: "1",
    price: 29.99,
    type: "pizza",
    size: "medium",
    ingredients: [
      { id: "1", name: "Sos pomidorowy", category: "Sosy" },
      { id: "2", name: "Mozzarella", category: "Sery" },
      { id: "3", name: "Bazylia", category: "Dodatki" },
    ],
  },
  {
    id: "2",
    number: "2",
    name: "Pepperoni",
    category: "1",
    price: 34.99,
    type: "pizza",
    size: "medium",
    ingredients: [
      { id: "1", name: "Sos pomidorowy", category: "Sosy" },
      { id: "2", name: "Mozzarella", category: "Sery" },
      { id: "4", name: "Pepperoni", category: "Mięsa" },
    ],
  },
];

const WaiterView: React.FC<WaiterViewProps> = ({
  menuItems = defaultMenuItems,
  menuCategories = defaultCategories,
  ingredients = defaultIngredients,
  ingredientCategories = defaultIngredientCategories,
}) => {
  const [currentOrder, setCurrentOrder] = React.useState<Order | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);

  const addItemToOrder = (item: MenuItem) => {
    setCurrentOrder((prev) => {
      if (!prev) {
        return {
          id: Math.random().toString(36).substring(7),
          items: [
            {
              ...item,
              quantity: 1,
              size: item.size || "medium",
              ingredients: item.ingredients || [],
            },
          ],
          type: "dine-in",
          paymentMethod: "cash",
          isPaid: false,
          total: item.price,
          isSaved: false,
          status: "pending",
          orderTime: new Date(),
          pickupTime: new Date(),
        };
      }

      const existingItem = prev.items.find((i) => i.id === item.id);
      const updatedItems = existingItem
        ? prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [
            ...prev.items,
            {
              ...item,
              quantity: 1,
              size: item.size || "medium",
              ingredients: item.ingredients || [],
            },
          ];

      return {
        ...prev,
        items: updatedItems,
        total: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        isSaved: false,
      };
    });
  };

  const removeItemFromOrder = (itemId: string) => {
    setCurrentOrder((prev) => {
      if (!prev) return prev;

      const updatedItems = prev.items.filter((item) => item.id !== itemId);
      return {
        ...prev,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
        isSaved: false,
      };
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="new-order" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new-order">Nowe zamówienie</TabsTrigger>
          <TabsTrigger value="active-orders">Aktywne zamówienia</TabsTrigger>
        </TabsList>

        <TabsContent value="new-order" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Menu Section */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {menuCategories.map((category) => (
                    <div key={category.id}>
                      <h3 className="font-medium mb-2">{category.name}</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {menuItems
                          .filter((item) => item.category === category.id)
                          .map((item) => (
                            <Button
                              key={item.id}
                              variant="outline"
                              className="justify-between h-auto py-2"
                              onClick={() => addItemToOrder(item)}
                            >
                              <span>
                                #{item.number} {item.name}
                              </span>
                              <span>{item.price.toFixed(2)} zł</span>
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Order Section */}
            <Card>
              <CardContent className="p-4">
                {currentOrder ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${currentOrder.type === "dine-in" ? "bg-green-100 text-green-700" : ""}`}
                        onClick={() =>
                          setCurrentOrder((prev) =>
                            prev
                              ? { ...prev, type: "dine-in", isSaved: false }
                              : null,
                          )
                        }
                      >
                        <UtensilsCrossed className="w-4 h-4 mr-2" />
                        Na miejscu
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${currentOrder.type === "takeout" ? "bg-blue-100 text-blue-700" : ""}`}
                        onClick={() =>
                          setCurrentOrder((prev) =>
                            prev
                              ? { ...prev, type: "takeout", isSaved: false }
                              : null,
                          )
                        }
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Na wynos
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${currentOrder.type === "delivery" ? "bg-purple-100 text-purple-700" : ""}`}
                        onClick={() =>
                          setCurrentOrder((prev) =>
                            prev
                              ? { ...prev, type: "delivery", isSaved: false }
                              : null,
                          )
                        }
                      >
                        <Bike className="w-4 h-4 mr-2" />
                        Dostawa
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {currentOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col p-2 border rounded-lg space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">
                                #{item.number} {item.name}
                              </span>
                              <div className="text-sm text-muted-foreground">
                                {item.quantity} x {item.price} zł
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.type === "pizza" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Dodaj składniki</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-2 gap-2">
                                      {defaultIngredients.map((ingredient) => {
                                        const isSelected =
                                          item.ingredients.some(
                                            (i) => i.id === ingredient.id,
                                          );
                                        const category =
                                          defaultIngredientCategories.find(
                                            (c) =>
                                              c.name === ingredient.category,
                                          );
                                        const price =
                                          category?.prices[item.size] || 0;

                                        return (
                                          <Button
                                            key={ingredient.id}
                                            variant={
                                              isSelected ? "default" : "outline"
                                            }
                                            className="justify-start"
                                            onClick={() => {
                                              if (!isSelected) {
                                                setCurrentOrder((prev) => {
                                                  if (!prev) return prev;
                                                  const updatedItems =
                                                    prev.items.map((i) => {
                                                      if (i.id === item.id) {
                                                        return {
                                                          ...i,
                                                          ingredients: [
                                                            ...i.ingredients,
                                                            ingredient,
                                                          ],
                                                          price:
                                                            i.price + price,
                                                        };
                                                      }
                                                      return i;
                                                    });
                                                  return {
                                                    ...prev,
                                                    items: updatedItems,
                                                    total: updatedItems.reduce(
                                                      (sum, i) =>
                                                        sum +
                                                        i.price * i.quantity,
                                                      0,
                                                    ),
                                                    isSaved: false,
                                                  };
                                                });
                                              }
                                            }}
                                          >
                                            {ingredient.name}
                                            <span className="ml-auto text-sm text-muted-foreground">
                                              +{price.toFixed(2)} zł
                                            </span>
                                          </Button>
                                        );
                                      })}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemFromOrder(item.id)}
                                className="text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {item.type === "pizza" &&
                            item.ingredients.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.ingredients.map((ingredient) => (
                                  <div
                                    key={ingredient.id}
                                    className="flex items-center gap-1 bg-muted/20 rounded px-2 py-1 text-sm"
                                  >
                                    <span>{ingredient.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-4 w-4 p-0 hover:bg-transparent hover:text-destructive"
                                      onClick={() => {
                                        setCurrentOrder((prev) => {
                                          if (!prev) return prev;
                                          const category =
                                            defaultIngredientCategories.find(
                                              (c) =>
                                                c.name === ingredient.category,
                                            );
                                          const price =
                                            category?.prices[item.size] || 0;

                                          const updatedItems = prev.items.map(
                                            (i) => {
                                              if (i.id === item.id) {
                                                return {
                                                  ...i,
                                                  ingredients:
                                                    i.ingredients.filter(
                                                      (ing) =>
                                                        ing.id !==
                                                        ingredient.id,
                                                    ),
                                                  price: i.price - price,
                                                };
                                              }
                                              return i;
                                            },
                                          );
                                          return {
                                            ...prev,
                                            items: updatedItems,
                                            total: updatedItems.reduce(
                                              (sum, i) =>
                                                sum + i.price * i.quantity,
                                              0,
                                            ),
                                            isSaved: false,
                                          };
                                        });
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>

                    {currentOrder.type === "delivery" && (
                      <div className="space-y-2">
                        <Input
                          placeholder="Adres dostawy"
                          value={currentOrder.address || ""}
                          onChange={(e) =>
                            setCurrentOrder((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    address: e.target.value,
                                    isSaved: false,
                                  }
                                : null,
                            )
                          }
                        />
                        <Input
                          placeholder="Telefon"
                          value={currentOrder.phone || ""}
                          onChange={(e) =>
                            setCurrentOrder((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    phone: e.target.value,
                                    isSaved: false,
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                    )}

                    <Textarea
                      placeholder="Uwagi do zamówienia"
                      value={currentOrder.notes || ""}
                      onChange={(e) =>
                        setCurrentOrder((prev) =>
                          prev
                            ? { ...prev, notes: e.target.value, isSaved: false }
                            : null,
                        )
                      }
                    />

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex-1 ${currentOrder.paymentMethod === "cash" ? "bg-yellow-100 text-yellow-700" : ""}`}
                          onClick={() =>
                            setCurrentOrder((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    paymentMethod: "cash",
                                    isSaved: false,
                                  }
                                : null,
                            )
                          }
                        >
                          <Banknote className="w-4 h-4 mr-2" />
                          Gotówka
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex-1 ${currentOrder.paymentMethod === "card" ? "bg-indigo-100 text-indigo-700" : ""}`}
                          onClick={() =>
                            setCurrentOrder((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    paymentMethod: "card",
                                    isSaved: false,
                                  }
                                : null,
                            )
                          }
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Karta
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-lg font-medium">
                        Razem: {currentOrder.total.toFixed(2)} zł
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentOrder(null)}
                        >
                          Anuluj
                        </Button>
                        <Button
                          onClick={() => {
                            if (currentOrder.items.length > 0) {
                              setOrders((prev) => [
                                ...prev,
                                { ...currentOrder, isSaved: true },
                              ]);
                              setCurrentOrder(null);
                            }
                          }}
                        >
                          Zapisz zamówienie
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Wybierz produkty z menu aby rozpocząć nowe zamówienie
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active-orders">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.orderTime).toLocaleTimeString()}
                      </div>
                      <div className="font-medium">
                        Zamówienie #{order.id.slice(-4)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.type === "dine-in" && (
                        <UtensilsCrossed className="w-4 h-4" />
                      )}
                      {order.type === "takeout" && (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                      {order.type === "delivery" && (
                        <Bike className="w-4 h-4" />
                      )}
                      {order.paymentMethod === "card" ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <Banknote className="w-4 h-4" />
                      )}
                      {order.isPaid && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x #{item.number} {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {(item.price * item.quantity).toFixed(2)} zł
                        </span>
                      </div>
                    ))}
                  </div>

                  {(order.address || order.phone || order.notes) && (
                    <div className="space-y-2 text-sm">
                      {order.address && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Adres:</span>
                          <span>{order.address}</span>
                        </div>
                      )}
                      {order.phone && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">
                            Telefon:
                          </span>
                          <span>{order.phone}</span>
                        </div>
                      )}
                      {order.notes && (
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Uwagi:</span>
                          <span>{order.notes}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="font-medium">
                      Razem: {order.total.toFixed(2)} zł
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setOrders((prev) =>
                          prev.map((o) =>
                            o.id === order.id ? { ...o, isPaid: !o.isPaid } : o,
                          ),
                        )
                      }
                    >
                      {order.isPaid
                        ? "Cofnij płatność"
                        : "Oznacz jako opłacone"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WaiterView;
