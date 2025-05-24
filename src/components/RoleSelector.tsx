"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleName, getAllRoles } from "@/lib/roles";

interface RoleSelectorProps {
  value?: RoleName;
  onValueChange?: (value: RoleName) => void;
  disabled?: boolean;
  className?: string;
}

export function RoleSelector({
  value,
  onValueChange,
  disabled = false,
  className = "",
}: RoleSelectorProps) {
  const roles = getAllRoles();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder="Chọn vai trò" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Vai trò người dùng</SelectLabel>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.name}>
              {role.name.charAt(0).toUpperCase() + role.name.slice(1)} -{" "}
              {role.description}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
