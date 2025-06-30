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
          <h1 className="text-4xl font-bold mb-2">Our Cinemas</h1>
          <p className="text-gray-400">
            Find the perfect cinema location near you
          </p>
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
              <div className="relative h-48">
                <img
                  src={
                    cinema.imageUrl || "/placeholder.svg?height=200&width=400"
                  }
                  alt={cinema.name || "Cinema"}
                  className="w-full h-full object-cover"
                />
                {/* Không có distance từ API, có thể ẩn hoặc để placeholder */}
                {/* <div className="absolute top-4 right-4">
                  <Badge className="bg-red-600 text-white">Đang cập nhật</Badge>
                </div> */}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl">
                      {cinema.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1">
                      {/* Không có totalScreens từ API */}
                      <span>Địa chỉ: {cinema.address}</span>
                    </CardDescription>
                  </div>
                  {/* Không có rating từ API, có thể ẩn hoặc để placeholder */}
                  {/* <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">N/A</span>
                  </div> */}
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

                {/* Phone - không có từ API */}
                {/* <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">N/A</span>
                </div> */}

                {/* Features - không có từ API */}
                {/* <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Đang cập nhật</Badge>
                  </div>
                </div> */}

                {/* Showtimes - không có từ API */}
                {/* <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Today's Showtimes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">Đang cập nhật</Badge>
                  </div>
                </div> */}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button className="bg-red-600 hover:bg-red-700 flex-1">
                    View Movies
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Find Us on Map</h2>
          <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center border border-gray-800">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Interactive map coming soon</p>
              <p className="text-gray-500 text-sm">
                View all cinema locations on an interactive map
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
