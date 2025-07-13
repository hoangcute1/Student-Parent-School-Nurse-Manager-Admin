"use client";

import {
  Users,
  FileText,
  Activity,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Pill,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/layout/sidebar/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("admin/manage-students");
  }, [router]);
}
