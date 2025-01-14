import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Plus, X } from "lucide-react";

interface OrderStatus {
  id: string;
  name: string;
  color: string;
}

interface OrderWorkflowProps {
  statuses?: OrderStatus[];
  onSave?: (statuses: OrderStatus[]) => void;
}

const defaultStatuses: OrderStatus[] = [
  { id: "1", name: "Oczekujące", color: "#FFA500" },
  { id: "2", name: "W przygotowaniu", color: "#4169E1" },
  { id: "3", name: "Gotowe", color: "#32CD32" },
  { id: "4", name: "W dostawie", color: "#8A2BE2" },
  { id: "5", name: "Dostarczone", color: "#2E8B57" },
];

const OrderWorkflow = ({
  statuses = defaultStatuses,
  onSave = () => {},
}: OrderWorkflowProps) => {
  return (
    <div className="p-4 bg-background">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {statuses.map((status, index) => (
              <React.Fragment key={status.id}>
                <div
                  className="p-3 rounded border min-w-[160px]"
                  style={{ borderColor: status.color }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <Label className="font-medium">{status.name}</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {}}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    type="color"
                    value={status.color}
                    onChange={() => {}}
                    className="h-6 w-full"
                  />
                </div>
                {index < statuses.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {}} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Dodaj status
            </Button>
            <Button onClick={() => onSave(statuses)} size="sm">
              Zapisz zmiany
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderWorkflow;
