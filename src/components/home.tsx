import React from "react";
import SettingsHeader from "./admin/SettingsHeader";
import IngredientManager from "./admin/ingredients/IngredientManager";
import PizzaConfigurator from "./admin/pizza/PizzaConfigurator";
import ProductManager from "./admin/products/ProductManager";
import OrderWorkflow from "./admin/workflow/OrderWorkflow";
import KitchenView from "./kitchen/KitchenView";
import WaiterView from "./waiter/WaiterView";

interface HomeProps {
  defaultTab?: string;
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

const Home = ({ defaultTab = "waiter" }: HomeProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const [orders, setOrders] = React.useState<Order[]>([]);

  const handleOrderStatusChange = (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const handleNewOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "waiter":
        return <WaiterView onNewOrder={handleNewOrder} orders={orders} />;
      case "kitchen":
        return (
          <KitchenView
            orders={orders}
            onStatusChange={handleOrderStatusChange}
          />
        );
      case "ingredients":
        return <IngredientManager />;
      case "pizza":
        return <PizzaConfigurator />;
      case "products":
        return <ProductManager />;
      case "workflow":
        return <OrderWorkflow />;
      default:
        return <WaiterView onNewOrder={handleNewOrder} orders={orders} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col">
        <SettingsHeader
          activeTab={activeTab}
          onTabChange={(value) => setActiveTab(value)}
        />
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Home;
