"use client";

import { resources } from "@/app/_constants/resource";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tài liệu y tế</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((doc, index) => (
          <Link key={index} href={doc.href}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <Image
                  src={doc.image}
                  alt={doc.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-4 ">
                <h2 className="font-bold text-xl mb-2">{doc.title}</h2>
                <p className="text-gray-600 mb-4">{doc.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{doc.author}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
