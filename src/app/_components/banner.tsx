import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

export default function Banner() {
  const images = [
    "/banner/banner1.jpg",
    "/banner/banner2.jpg",
    "/banner/banner3.jpg",
  ];

  // Thêm ảnh nền mới ở đây
  const backgroundImageUrl = "/banner/banner4.jpg"; 

  return (
    <section
      className="flex justify-center items-center w-full py-12 md:py-24 lg:py-32 bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`, 
        backgroundPosition: "center",
      }}
    >
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2  p-4 rounded-lg">
              <p className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Hệ thống Quản lý Y tế 
              </p>
              <p className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Học đường
              </p>
              <p className="max-w-[600px] text-white md:text-xl drop-shadow-lg">
                Giải pháp toàn diện để quản lý sức khỏe học sinh, theo dõi sự
                kiện y tế, và đảm bảo môi trường học tập an toàn.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col gap-2 min-[400px]:flex-row"
            >
              <Link href="#features">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="mx-auto lg:mr-0 w-[550px] h-[550px] rounded-lg overflow-hidden relative">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <Image
                    src={src}
                    alt={`Hệ thống Y tế Học đường ảnh ${idx + 1}`}
                    width={550}
                    height={550}
                    className="object-cover rounded-lg"
                    priority={idx === 0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
