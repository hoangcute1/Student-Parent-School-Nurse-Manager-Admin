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
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center min-h-[500px]">
          <div className="flex flex-col justify-center space-y-6 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-tight drop-shadow-xl">
                  Hệ thống Quản lý Y tế
                </p>
                <p className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-tight drop-shadow-xl">
                  Học Đường
                </p>
              </div>
              <p className="max-w-[600px] text-white text-lg md:text-xl drop-shadow-lg leading-relaxed">
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
              className="flex flex-col gap-3 min-[400px]:flex-row"
            >
              <Link href="#features">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg font-semibold"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] rounded-2xl shadow-2xl overflow-hidden"
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx} className="w-full h-full">
                  <Image
                    src={src}
                    alt={`Hệ thống Y tế Học đường ảnh ${idx + 1}`}
                    fill
                    className="object-cover"
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
