import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsHeaderProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const SettingsHeader = ({
  activeTab = "ingredients",
  onTabChange = () => {},
}: SettingsHeaderProps) => {
  return (
    <div className="w-full bg-background border-b sticky top-0 z-50 backdrop-blur-sm bg-background/80 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <Tabs
          defaultValue={activeTab}
          className="w-full"
          onValueChange={onTabChange}
        >
          <TabsList className="h-16 w-full justify-start gap-4 bg-transparent">
            <TabsTrigger
              value="waiter"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Kelner
            </TabsTrigger>
            <TabsTrigger
              value="ingredients"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Składniki
            </TabsTrigger>
            <TabsTrigger
              value="pizza"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Kreator Pizzy
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Produkty
            </TabsTrigger>
            <TabsTrigger
              value="workflow"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Status Zamówień
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsHeader;
