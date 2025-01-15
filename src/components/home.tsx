import React from "react";
import SettingsHeader from "./admin/SettingsHeader";
import IngredientManager from "./admin/ingredients/IngredientManager";
import PizzaConfigurator from "./admin/pizza/PizzaConfigurator";
import ProductManager from "./admin/products/ProductManager";
import OrderWorkflow from "./admin/workflow/OrderWorkflow";
import WaiterView from "./waiter/WaiterView";

interface HomeProps {
  defaultTab?: string;
}

interface Ingredient {
  id: string;
  name: string;
  category: "meats" | "veggies" | "cheeses";
}

interface Category {
  id: string;
  name: string;
  prices: {
    mini: number;
    small: number;
    medium: number;
    large: number;
  };
}

const defaultCategories: Category[] = [
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

const Home = ({ defaultTab = "waiter" }: HomeProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([
    { id: "1", name: "Pepperoni", category: "meats" },
    { id: "2", name: "Pieczarki", category: "veggies" },
  ]);
  const [categories, setCategories] =
    React.useState<Category[]>(defaultCategories);

  const handleAddIngredient = (ingredient: Omit<Ingredient, "id">) => {
    const newIngredient = {
      ...ingredient,
      id: Math.random().toString(36).substring(7),
    };
    setIngredients((prev) => [...prev, newIngredient]);
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  const handleAddCategory = (category: Omit<Category, "id">) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substring(7),
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleEditCategory = (id: string, category: Omit<Category, "id">) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...category } : cat)),
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "waiter":
        return <WaiterView />;
      case "ingredients":
        return (
          <IngredientManager
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onDeleteIngredient={handleDeleteIngredient}
            categories={categories}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case "pizza":
        return <PizzaConfigurator />;
      case "products":
        return <ProductManager />;
      case "workflow":
        return <OrderWorkflow />;
      default:
        return <WaiterView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
