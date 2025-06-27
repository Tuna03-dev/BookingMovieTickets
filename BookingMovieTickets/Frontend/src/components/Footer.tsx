import React from "react";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">CinemaTickets</span>
            </div>
            <p className="text-gray-400 mb-4">
              Cách tốt nhất để đặt vé xem phim trực tuyến.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/movies"
                  className="hover:text-red-500 transition-colors"
                >
                  Phim
                </Link>
              </li>
              <li>
                <Link
                  to="/cinemas"
                  className="hover:text-red-500 transition-colors"
                >
                  Rạp chiếu
                </Link>
              </li>
              <li>
                <Link
                  to="/promotions"
                  className="hover:text-red-500 transition-colors"
                >
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-red-500 transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/help"
                  className="hover:text-red-500 transition-colors"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-red-500 transition-colors"
                >
                  Liên hệ chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-red-500 transition-colors"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-red-500 transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Thông tin liên hệ</h3>
            <div className="space-y-2 text-gray-400">
              <p>📧 support@cinematickets.com</p>
              <p>📞 (555) 123-4567</p>
              <p>📍 123 Đường Cinema, Thành phố Movie</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© 2024 CinemaTickets. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
