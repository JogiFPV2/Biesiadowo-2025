import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface MenuItem {
  id: string;
  number: string;
  name: string;
  price: number;
  category: string;
}

interface MenuCategory {
  id: string;
  name: string;
}

interface Order {
  id: string;
  items: {
    id: string;
    number: string;
    name: string;
    quantity: number;
    price: number;
  }[];
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
  orders?: Order[];
  onNewOrder?: (order: Order) => void;
}

const defaultMenuItems: MenuItem[] = [
  { id: "1", number: "1", name: "Margherita", price: 24.99, category: "1" },
  { id: "2", number: "2", name: "Pepperoni", price: 27.99, category: "1" },
];

const defaultCategories: MenuCategory[] = [
  { id: "1", name: "Klasyczne" },
  { id: "2", name: "Wegetariańskie" },
];

const WaiterView = ({
  menuItems = defaultMenuItems,
  menuCategories = defaultCategories,
  orders = [],
  onNewOrder = () => {},
}: WaiterViewProps) => {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [currentOrder, setCurrentOrder] = React.useState<Partial<Order>>({
    items: [],
    type: "dine-in",
    total: 0,
    status: "pending",
    orderTime: new Date(),
    pickupTime: new Date(Date.now() + 30 * 60000),
  });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-[#FFA500]/10";
      case "preparing":
        return "bg-[#4169E1]/10";
      case "ready":
        return "bg-[#32CD32]/10";
      case "delivering":
        return "bg-[#8A2BE2]/10";
      case "delivered":
        return "bg-[#2E8B57]/10";
    }
  };

  const statusGroups = {
    pending: orders.filter((order) => order.status === "pending"),
    preparing: orders.filter((order) => order.status === "preparing"),
    ready: orders.filter((order) => order.status === "ready"),
  };

  const addItemToOrder = (item: MenuItem) => {
    setCurrentOrder((prev) => {
      const existingItem = prev.items?.find((i) => i.id === item.id);
      const newItems = existingItem
        ? prev.items?.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [
            ...(prev.items || []),
            {
              id: item.id,
              number: item.number,
              name: item.name,
              quantity: 1,
              price: item.price,
            },
          ];

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return { ...prev, items: newItems, total };
    });
  };

  const removeItemFromOrder = (itemId: string) => {
    setCurrentOrder((prev) => {
      const newItems = prev.items?.filter((i) => i.id !== itemId) || [];
      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return { ...prev, items: newItems, total };
    });
  };

  const handleCreateOrder = () => {
    if (!currentOrder.items?.length) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: currentOrder.items,
      type: currentOrder.type as "dine-in",
      paymentMethod: "cash",
      isPaid: false,
      total: currentOrder.total || 0,
      isSaved: true,
      status: "pending",
      orderTime: new Date(),
      pickupTime: new Date(Date.now() + 30 * 60000),
    };

    onNewOrder(newOrder);
    setCurrentOrder({
      items: [],
      type: "dine-in",
      total: 0,
      status: "pending",
      orderTime: new Date(),
      pickupTime: new Date(Date.now() + 30 * 60000),
    });
  };

  const renderOrderCard = (order: Order) => (
    <Dialog
      key={order.id}
      open={selectedOrder?.id === order.id}
      onOpenChange={(open) => !open && setSelectedOrder(null)}
    >
      <button
        onClick={() => setSelectedOrder(order)}
        className={`p-2 rounded-lg border flex items-center gap-3 ${getStatusColor(
          order.status,
        )} ${order.isPaid ? "border-green-500" : "border-red-500"} hover:bg-accent/10 transition-colors w-full`}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">#{order.id}</span>
          {order.type === "dine-in" ? (
            <Store className="h-4 w-4" />
          ) : order.type === "takeout" ? (
            <ShoppingBag className="h-4 w-4" />
          ) : (
            <Bike className="h-4 w-4" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {order.pickupTime.toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{order.total.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">zł</span>
        </div>
      </button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zamówienie #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-lg bg-accent/5"
            >
              <div>
                <span className="font-medium">
                  {item.quantity}x #{item.number} {item.name}
                </span>
              </div>
              <span>{(item.price * item.quantity).toFixed(2)} zł</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="h-screen bg-background">
      <div className="grid grid-cols-2 h-full">
        {/* Left Column */}
        <div className="flex flex-col">
          {/* Orders Tables */}
          <div className="p-4 space-y-4">
            {/* Pending Orders */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFA500]"></div>
                  Oczekujące ({statusGroups.pending.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statusGroups.pending.map(renderOrderCard)}
                </div>
              </CardContent>
            </Card>

            {/* Preparing Orders */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4169E1]"></div>W
                  przygotowaniu ({statusGroups.preparing.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statusGroups.preparing.map(renderOrderCard)}
                </div>
              </CardContent>
            </Card>

            {/* Ready Orders */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#32CD32]"></div>
                  Gotowe ({statusGroups.ready.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {statusGroups.ready.map(renderOrderCard)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Menu and Current Order */}
        <div className="border-l p-4 flex flex-col h-full">
          {/* Current Order */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Nowe zamówienie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-accent/5"
                  >
                    <div>
                      <span className="font-medium">
                        {item.quantity}x #{item.number} {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{(item.price * item.quantity).toFixed(2)} zł</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItemFromOrder(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {currentOrder.items?.length ? (
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Razem:</span>
                    <span className="font-medium">
                      {currentOrder.total?.toFixed(2)} zł
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Wybierz produkty z menu
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={!currentOrder.items?.length}
                  onClick={handleCreateOrder}
                >
                  Utwórz zamówienie
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Menu */}
          <div className="flex-1 overflow-auto">
            <Tabs defaultValue={menuCategories[0].id}>
              <TabsList className="w-full justify-start">
                {menuCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {menuCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-2 gap-2">
                    {menuItems
                      .filter((item) => item.category === category.id)
                      .map((item) => (
                        <Button
                          key={item.id}
                          variant="outline"
                          className="h-auto py-4 px-4 flex flex-col items-start space-y-1"
                          onClick={() => addItemToOrder(item)}
                        >
                          <div className="flex items-center gap-2">
                            <span>#{item.number}</span>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.price.toFixed(2)} zł
                          </span>
                        </Button>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaiterView;
