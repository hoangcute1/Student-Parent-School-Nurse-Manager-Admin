import Link from "next/link";
import {
  Facebook,
  Mail,
  MapPin,
  Phone,
  Heart,
  Instagram,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-100 to-blue-50 text-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Logo và tiêu đề */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-4 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-red-400 to-red-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Heart className="h-7 w-7 text-white transition-all duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 bg-clip-text text-transparent">
                Y Tế Học Đường
              </h2>
              <p className="text-xs text-blue-500 font-medium opacity-80">
                Chăm sóc sức khỏe học sinh toàn diện
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-gray-600 hover:text-blue-700 transition-colors group">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed">
                  Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức,
                  TP.HCM
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 hover:text-blue-700 transition-colors group">
                <Phone className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>(+84) 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 hover:text-blue-700 transition-colors group">
                <Mail className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>info@ytehocduong.edu.vn</span>
              </li>
            </ul>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Liên kết</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-700 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-gray-600 hover:text-blue-700 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tính năng
                </Link>
              </li>
              <li>
                <Link
                  href="/#resources"
                  className="text-gray-600 hover:text-blue-700 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link
                  href="/#blog"
                  className="text-gray-600 hover:text-blue-700 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Kết nối */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">
              Kết nối với chúng tôi
            </h3>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => window.open("https://facebook.com", "_blank")}
                className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg"
                title="Theo dõi chúng tôi trên Facebook"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                onClick={() => window.open("https://instagram.com", "_blank")}
                className="flex items-center justify-center w-10 h-10 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-all duration-300 hover:scale-110 shadow-lg"
                title="Theo dõi chúng tôi trên Instagram"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  window.open("https://twitter.com/ytehocduong", "_blank")
                }
                className="flex items-center justify-center w-10 h-10 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all duration-300 hover:scale-110 shadow-lg"
                title="Theo dõi chúng tôi trên Twitter"
              >
                <Twitter className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Theo dõi chúng tôi để cập nhật những tin tức mới nhất về sức khỏe
              học đường và các chương trình chăm sóc sức khỏe.
            </p>
          </div>
        </div>

        <div className="border-t border-blue-200 mt-8 pt-8">
          <div className="flex justify-center items-center">
            <p className="text-gray-600 text-sm text-center">
              &copy; 2025 Hệ thống Quản lý Y tế Học Đường. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
