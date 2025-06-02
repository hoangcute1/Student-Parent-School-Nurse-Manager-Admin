import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthData } from "@/lib/auth";
import {
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import LoginPopup from "./login-popup";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { features } from "../_constants/feature";

export default function Feature() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleFeatureClick = (
    e: React.MouseEvent,
    feature: (typeof features)[0]
  ) => {
    e.preventDefault();
    const auth = getAuthData();
    if (!auth) {
      setOpen(true);
    } else {
      router.push(feature.href);
    }
  };
  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, []);
  return (
    <>
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 flex justify-center items-center"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tính năng chính
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hệ thống của chúng tôi cung cấp đầy đủ các công cụ cần thiết để
                quản lý sức khỏe học sinh hiệu quả
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={(e) => handleFeatureClick(e, feature)}
                className="cursor-pointer select-none hover:scale-105 transition-all duration-300"
              >
                <Card className={`h-full cursor-pointer border-2 transition-all duration-300 hover:shadow-lg hover:${feature.borderColor} flex flex-col`}>
                  <CardHeader className="flex flex-row items-center gap-4 h-24">
                    <feature.icon className={`h-8 w-8 ${feature.textColor}`} />
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 mt-auto">
                    <div
                      className={cn(
                        "flex items-center font-medium transition-all duration-300 group",
                        feature.textColor
                      )}
                    >
                      Xem chi tiết
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LoginPopup open={open} setOpen={setOpen} router={router} />
    </>
  );
}
