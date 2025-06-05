import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function Notification() {
  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-5 w-5" />
      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white p-0 flex items-center justify-center">
        3
      </Badge>
    </Button>
  );
}
