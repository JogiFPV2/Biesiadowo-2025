import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, Bike, Clock } from "lucide-react";

interface OrderItem {
  id: string;
  number: string;
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  type: "dine-in" | "takeout" | "delivery";
  status: "pending" | "preparing" | "ready" | "delivering" | "delivered";
  orderTime: Date;
  pickupTime: Date;
}

interface KitchenViewProps {
  orders?: Order[];
  onStatusChange?: (orderId: string, newStatus: Order["status"]) => void;
}

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-[#FFA500]/10 hover:bg-[#FFA500]/20";
    case "preparing":
      return "bg-[#4169E1]/10 hover:bg-[#4169E1]/20";
    case "ready":
      return "bg-[#32CD32]/10 hover:bg-[#32CD32]/20";
    case "delivering":
      return "bg-[#8A2BE2]/10 hover:bg-[#8A2BE2]/20";
    case "delivered":
      return "bg-[#2E8B57]/10 hover:bg-[#2E8B57]/20";
  }
};

const getNextStatus = (status: Order["status"]): Order["status"] => {
  switch (status) {
    case "pending":
      return "preparing";
    case "preparing":
      return "ready";
    case "ready":
      return "delivering";
    case "delivering":
      return "delivered";
    default:
      return "delivered";
  }
};

const defaultOrders: Order[] = [
  {
    id: "1",
    items: [
      { id: "1", number: "1", name: "Margherita", quantity: 2 },
      { id: "2", number: "2", name: "Pepperoni", quantity: 1 },
    ],
    type: "dine-in",
    status: "pending",
    orderTime: new Date(),
    pickupTime: new Date(Date.now() + 30 * 60000),
  },
];

const KitchenView = ({
  orders = defaultOrders,
  onStatusChange = () => {},
}: KitchenViewProps) => {
  const statusGroups = {
    pending: orders.filter((order) => order.status === "pending"),
    preparing: orders.filter((order) => order.status === "preparing"),
    ready: orders.filter((order) => order.status === "ready"),
    delivering: orders.filter((order) => order.status === "delivering"),
    delivered: orders.filter((order) => order.status === "delivered"),
  };

  const renderOrderCard = (order: Order, buttonText: string) => (
    <Card
      key={order.id}
      className={`${getStatusColor(order.status)} cursor-pointer transition-colors`}
      onClick={() => onStatusChange(order.id, getNextStatus(order.status))}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">#{order.id}</span>
            {order.type === "dine-in" ? (
              <Store className="h-4 w-4" />
            ) : order.type === "takeout" ? (
              <ShoppingBag className="h-4 w-4" />
            ) : (
              <Bike className="h-4 w-4" />
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <span>
              {order.pickupTime.toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white/50 rounded p-2"
            >
              <span>
                {item.quantity}x #{item.number} {item.name}
              </span>
            </div>
          ))}
        </div>

        {order.status !== "delivered" && (
          <Button
            className="w-full"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(order.id, getNextStatus(order.status));
            }}
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Pending Orders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Oczekujące</h2>
          {statusGroups.pending.map((order) =>
            renderOrderCard(order, "Rozpocznij przygotowanie"),
          )}
        </div>

        {/* Preparing Orders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">W przygotowaniu</h2>
          {statusGroups.preparing.map((order) =>
            renderOrderCard(order, "Oznacz jako gotowe"),
          )}
        </div>

        {/* Ready Orders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Gotowe</h2>
          {statusGroups.ready.map((order) =>
            renderOrderCard(
              order,
              order.type === "delivery" ? "Wydaj do dostawy" : "Wydaj",
            ),
          )}
        </div>

        {/* Delivering Orders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">W doręczeniu</h2>
          {statusGroups.delivering.map((order) =>
            renderOrderCard(order, "Oznacz jako dostarczone"),
          )}
        </div>

        {/* Delivered Orders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Doręczone</h2>
          {statusGroups.delivered.map((order) => renderOrderCard(order, ""))}
        </div>
      </div>
    </div>
  );
};

export default KitchenView;
