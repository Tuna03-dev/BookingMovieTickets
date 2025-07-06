import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cinemaApis } from "@/services/cinemaApis";
import type { components } from "@/types/api-types";

export type CinemaResponseDTO = components["schemas"]["CinemaResponseDTO"];

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<CinemaResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCinemas = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi API lấy danh sách rạp, lấy tối đa 20 rạp
        const res = await cinemaApis.getCinemas();
        // Kiểm tra kiểu dữ liệu trả về
        console.log("API response:", res);
        if (res && typeof res === "object" && "items" in res) {
          const items = (res as { items: CinemaResponseDTO[] }).items;
          setCinemas(items);
          console.log("Cinemas fetched:", items);
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch {
        setError("Không thể tải danh sách rạp.");
      } finally {
        setLoading(false);
      }
    };
    fetchCinemas();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Danh sách rạp</h1>
          <p className="text-gray-400">Tìm rạp chiếu phim phù hợp gần bạn</p>
        </div>

        {/* Loading/Error */}
        {loading && (
          <div className="text-gray-300">Đang tải danh sách rạp...</div>
        )}
        {error && <div className="text-red-500">{error}</div>}

        {/* Cinema Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cinemas.map((cinema) => (
            <Card
              key={cinema.cinemaId}
              className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
            >
              {/* Đã bỏ phần hiển thị ảnh */}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">
                      {cinema.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      <span>Địa chỉ: {cinema.address}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">{cinema.address}</p>
                    <p className="text-gray-400 text-sm">{cinema.city}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button className="bg-red-600 hover:bg-red-700 flex-1">
                    Xem phim
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Chỉ đường
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Tìm trên bản đồ</h2>
          <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center border border-gray-800">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Bản đồ tương tác sẽ sớm có mặt</p>
              <p className="text-gray-500 text-sm">
                Xem tất cả vị trí rạp trên bản đồ tương tác
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
