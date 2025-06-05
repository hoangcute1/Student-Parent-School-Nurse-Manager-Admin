import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function Notification() {
  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell />
      <Badge className="absolute -top-1 -right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white p-0 flex items-center justify-center">
        3
      </Badge>
    </Button>
  );
}
