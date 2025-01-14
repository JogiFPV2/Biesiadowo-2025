import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Phone,
  MapPin,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  number: string;
  name: string;
  price: number;
  category: string;
  ingredients?: {
    id: string;
    name: string;
    category: string;
  }[];
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
  onUpdateOrder?: (order: Order) => void;
}

const defaultMenuItems: MenuItem[] = [
  {
    id: "1",
    number: "1",
    name: "Margherita",
    price: 24.99,
    category: "1",
    ingredients: [
      { id: "1", name: "Sos pomidorowy", category: "sosy" },
      { id: "2", name: "Mozzarella", category: "sery" },
      { id: "3", name: "Bazylia", category: "dodatki" },
    ],
  },
  {
    id: "2",
    number: "2",
    name: "Pepperoni",
    price: 27.99,
    category: "1",
    ingredients: [
      { id: "1", name: "Sos pomidorowy", category: "sosy" },
      { id: "2", name: "Mozzarella", category: "sery" },
      { id: "4", name: "Pepperoni", category: "miesa" },
    ],
  },
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
  onUpdateOrder = () => {},
}: WaiterViewProps) => {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [currentOrder, setCurrentOrder] = React.useState<Partial<Order>>({
    items: [],
    type: "dine-in",
    total: 0,
    status: "pending",
    orderTime: new Date(),
    pickupTime: new Date(Date.now() + 30 * 60000),
    paymentMethod: "cash",
    isPaid: false,
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
      paymentMethod: currentOrder.paymentMethod as "cash",
      isPaid: currentOrder.isPaid || false,
      total: currentOrder.total || 0,
      isSaved: true,
      status: "pending",
      orderTime: new Date(),
      pickupTime: currentOrder.pickupTime || new Date(Date.now() + 30 * 60000),
      address: currentOrder.address,
      phone: currentOrder.phone,
      notes: currentOrder.notes,
    };

    onNewOrder(newOrder);
    setCurrentOrder({
      items: [],
      type: "dine-in",
      total: 0,
      status: "pending",
      orderTime: new Date(),
      pickupTime: new Date(Date.now() + 30 * 60000),
      paymentMethod: "cash",
      isPaid: false,
    });
  };

  const handleUpdateOrder = (updates: Partial<Order>) => {
    if (!selectedOrder) return;
    const updatedOrder = { ...selectedOrder, ...updates };
    onUpdateOrder(updatedOrder);
    setSelectedOrder(updatedOrder);
  };

  const addTimeToPickup = (minutes: number, order: Partial<Order>) => {
    const currentPickupTime = order.pickupTime || new Date();
    const newPickupTime = new Date(
      currentPickupTime.getTime() + minutes * 60000,
    );
    return newPickupTime;
  };

  const OrderControls = ({
    order,
    onChange,
  }: {
    order: Partial<Order>;
    onChange: (updates: Partial<Order>) => void;
  }) => (
    <div className="space-y-4">
      {/* Time Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {order.orderTime?.toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({ pickupTime: addTimeToPickup(5, order) })
              }
            >
              +5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({ pickupTime: addTimeToPickup(20, order) })
              }
            >
              +20
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({ pickupTime: addTimeToPickup(60, order) })
              }
            >
              +60
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {order.pickupTime?.toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Order Type Icons */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ type: "dine-in" })}
          className={cn(
            "h-10 w-10",
            order.type === "dine-in" &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <Store className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ type: "takeout" })}
          className={cn(
            "h-10 w-10",
            order.type === "takeout" &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ type: "delivery" })}
          className={cn(
            "h-10 w-10",
            order.type === "delivery" &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <Bike className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        {/* Payment Method */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ paymentMethod: "cash" })}
          className={cn(
            "h-10 w-10",
            order.paymentMethod === "cash" &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <Banknote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ paymentMethod: "card" })}
          className={cn(
            "h-10 w-10",
            order.paymentMethod === "card" &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <CreditCard className="h-4 w-4" />
        </Button>

        {/* Payment Status */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ isPaid: !order.isPaid })}
          className={cn(
            "h-10 w-10",
            order.isPaid &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>

      {/* Delivery Fields */}
      {order.type === "delivery" && (
        <div className="space-y-4 border rounded-lg p-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Adres
            </Label>
            <Input
              value={order.address || ""}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="Ulica, numer domu/mieszkania"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Telefon
            </Label>
            <Input
              value={order.phone || ""}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="Numer telefonu"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <StickyNote className="h-4 w-4" /> Uwagi
            </Label>
            <Textarea
              value={order.notes || ""}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Dodatkowe informacje"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="grid grid-cols-4 h-full">
        {/* Left Section - Orders and Menu */}
        <div className="col-span-3 flex flex-col h-full overflow-hidden">
          {/* Orders List */}
          <div className="grid grid-cols-3 gap-4 p-4">
            {/* Pending Orders Column */}
            <div className="space-y-2">
              <h2 className="font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FFA500]"></div>
                Oczekujące ({statusGroups.pending.length})
              </h2>
              <div className="space-y-2">
                {statusGroups.pending.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-2 rounded-lg border flex items-center justify-between ${getStatusColor(
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
                      <span className="text-sm font-medium">
                        {order.total.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">zł</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preparing Orders Column */}
            <div className="space-y-2">
              <h2 className="font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4169E1]"></div>W
                przygotowaniu ({statusGroups.preparing.length})
              </h2>
              <div className="space-y-2">
                {statusGroups.preparing.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-2 rounded-lg border flex items-center justify-between ${getStatusColor(
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
                      <span className="text-sm font-medium">
                        {order.total.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">zł</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ready Orders Column */}
            <div className="space-y-2">
              <h2 className="font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#32CD32]"></div>
                Gotowe ({statusGroups.ready.length})
              </h2>
              <div className="space-y-2">
                {statusGroups.ready.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-2 rounded-lg border flex items-center justify-between ${getStatusColor(
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
                      <span className="text-sm font-medium">
                        {order.total.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">zł</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Categories and Items */}
          <div className="flex-1 border-t p-4 overflow-auto">
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
                  <div className="grid grid-cols-4 gap-2">
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
                          {item.ingredients && (
                            <span className="text-xs text-muted-foreground">
                              {item.ingredients
                                .map((ing) => ing.name)
                                .join(", ")}
                            </span>
                          )}
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

        {/* Right Section - Order Details */}
        <div className="border-l p-4 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Nowe zamówienie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <OrderControls
                  order={currentOrder}
                  onChange={(updates) =>
                    setCurrentOrder((prev) => ({ ...prev, ...updates }))
                  }
                />

                {/* Items List */}
                {currentOrder.items?.map((item) => {
                  const menuItem = menuItems.find((mi) => mi.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="space-y-1 p-2 rounded-lg bg-accent/5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {item.quantity}x #{item.number} {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            {(item.price * item.quantity).toFixed(2)} zł
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItemFromOrder(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {menuItem?.ingredients && (
                        <div className="text-xs text-muted-foreground">
                          {menuItem.ingredients
                            .map((ing) => ing.name)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}

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
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Zamówienie #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <OrderControls
                order={selectedOrder}
                onChange={handleUpdateOrder}
              />

              {/* Items List */}
              <div className="space-y-4">
                {selectedOrder.items.map((item) => {
                  const menuItem = menuItems.find((mi) => mi.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="space-y-1 p-3 rounded-lg bg-accent/5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {item.quantity}x #{item.number} {item.name}
                          </span>
                        </div>
                        <span>
                          {(item.price * item.quantity).toFixed(2)} zł
                        </span>
                      </div>
                      {menuItem?.ingredients && (
                        <div className="text-sm text-muted-foreground">
                          {menuItem.ingredients
                            .map((ing) => ing.name)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-medium">Razem:</span>
                  <span className="font-medium">
                    {selectedOrder.total.toFixed(2)} zł
                  </span>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleUpdateOrder({
                      status:
                        selectedOrder.status === "pending"
                          ? "preparing"
                          : selectedOrder.status === "preparing"
                            ? "ready"
                            : selectedOrder.status === "ready"
                              ? "delivering"
                              : "delivered",
                    });
                    setSelectedOrder(null);
                  }}
                >
                  {selectedOrder.status === "pending"
                    ? "Rozpocznij przygotowanie"
                    : selectedOrder.status === "preparing"
                      ? "Oznacz jako gotowe"
                      : selectedOrder.status === "ready"
                        ? "Wydaj"
                        : "Zakończ"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Zamknij
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaiterView;
