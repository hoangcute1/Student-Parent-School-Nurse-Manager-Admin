import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="flex justify-center items-center w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <p className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none ">
                Hệ thống Quản lý Y tế Học đường
              </p>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Giải pháp toàn diện để quản lý sức khỏe học sinh, theo dõi sự
                kiện y tế, và đảm bảo môi trường học tập an toàn.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="#features">
                <Button size="lg">Tìm hiểu thêm</Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto lg:mr-0">
            <Image
              src="/placeholder.svg?height=550&width=550"
              alt="Hệ thống Y tế Học đường"
              width={550}
              height={550}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
