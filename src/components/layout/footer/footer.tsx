import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-100 to-blue-50 text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>contact@schoolhealth.com</span>
              </li>
            </ul>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-700 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-700 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-blue-700 transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-700 transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Kết nối */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-900">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-blue-600 hover:text-blue-700 transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Đăng ký nhận tin tức mới nhất về sức khỏe học đường</p>
              <div className="mt-2 flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-3 py-2 rounded bg-white text-gray-800 placeholder:text-gray-400 border border-blue-200 focus:border-blue-600 focus:outline-none flex-1"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2025 Hệ thống Quản lý Y tế Học đường. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
