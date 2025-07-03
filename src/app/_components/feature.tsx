import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import LoginPopup from "./login-popup";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { features } from "../_constants/feature";
import { useAuthStore } from "@/stores/auth-store";

export default function Feature() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, []);
  const handleFeatureClick = (
    e: React.MouseEvent<HTMLDivElement>,
    feature: (typeof features)[number]
  ) => {
    e.preventDefault();
    if (!user) {
      setOpen(true);
      return;
    }
    router.push(feature.href);
  };
  return (
    <>
      <section
        id="features"
        className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-b from-blue-50/30 to-white"
      >
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-12 md:mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl text-blue-900 leading-normal py-2">
                Tính năng chính
              </h2>
              <p className="max-w-[700px] text-gray-600 md:text-lg lg:text-xl leading-relaxed">
                Hệ thống của chúng tôi cung cấp đầy đủ các công cụ cần thiết để
                quản lý sức khỏe học sinh hiệu quả và toàn diện
              </p>
            </div>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-6 xl:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={(e) => handleFeatureClick(e, feature)}
                className="group cursor-pointer select-none"
              >
                <Card className="h-full cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm group-hover:bg-white flex flex-col overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <CardHeader className="relative flex flex-col items-start gap-4 p-6 pb-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.bgGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="w-full">
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300 mb-2">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm font-medium text-blue-600">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="relative px-6 pb-4 flex-1">
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.content}
                    </p>
                  </CardContent>

                  <CardFooter className="relative px-6 pb-6 mt-auto">
                    <div className="flex items-center font-semibold text-blue-600 group-hover:text-blue-800 transition-all duration-300">
                      <span className="text-sm">Xem chi tiết</span>
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
                        className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2"
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
