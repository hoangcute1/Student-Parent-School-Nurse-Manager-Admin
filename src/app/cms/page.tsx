"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CMSPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("cms/manage-students");
  }, [router]);
  
}
