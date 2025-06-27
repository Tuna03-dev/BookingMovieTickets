import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  CalendarDays,
  Clock,
  Star,
  Ticket,
  MapPin,
  Gift,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MovieCard } from "@/components/movie-card";
import { FeaturedMovie } from "@/components/featured-movie";
import { Badge } from "@/components/ui/badge";
import { movieApis } from "@/services/movieApis";
import type { Movie } from "@/services/movieApis";
import { statsApis, type QuickStats } from "@/services/statsApis";

function parseGenres(genre?: string | null): string[] {
  if (!genre) return [];
  return genre.split(",").map((g) => g.trim());
}

export default function Home() {
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      movieApis.getNowShowing(),
      movieApis.getComingSoon(),
      movieApis.getFeatured(),
      statsApis.getQuickStats(),
    ])
      .then(([now, soon, feat, quick]) => {
        setNowShowing(now || []);
        setComingSoon(soon || []);
        setFeatured(feat || null);
        setStats(quick || null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />

        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <img
            src={
              featured?.posterUrl ||
              "https://images.seeklogo.com/logo-png/45/1/d-e-m-o-logo-png_seeklogo-453088.png"
            }
            alt="Featured movie"
            className="object-cover w-full h-full absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-red-600/20 text-red-400 border-red-600/30">
              Đang Chiếu
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {featured?.title || "Avengers: Endgame"}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-semibold">9.2</span>
                <span className="text-gray-400">/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>{featured?.duration || 181} min</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gray-400" />
                <span>
                  {featured?.releaseDate
                    ? typeof featured.releaseDate === "string"
                      ? featured.releaseDate
                      : [
                          featured.releaseDate.day,
                          featured.releaseDate.month,
                          featured.releaseDate.year,
                        ]
                          .filter(Boolean)
                          .join("/")
                    : "2025"}
                </span>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              {featured?.description ||
                "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
              >
                <Ticket className="mr-2 h-5 w-5" />
                Đặt Vé Ngay
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute bottom-8 right-8 hidden lg:block">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-xl p-4 border border-gray-800">
            <div className="text-sm text-gray-100 mb-1">
              Suất Chiếu Tiếp Theo
            </div>
            <div className="text-lg font-bold text-white">7:30 PM</div>
            <div className="text-sm text-gray-100">Cinema 3</div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">
                {stats?.moviesCount ?? "-"}+
              </div>
              <div className="text-gray-400">Movies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">
                {stats?.cinemasCount ?? "-"}
              </div>
              <div className="text-gray-400">Cinemas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">
                {stats?.customersCount ? `${stats.customersCount}K+` : "-"}
              </div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">9.2</div>
              <div className="text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Now Showing */}
      <section className="container mx-auto py-16 px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Đang Chiếu</h2>
            <p className="text-gray-400">
              Xem ngay các siêu phẩm mới nhất tại rạp
            </p>
          </div>
          <Link to="/movies">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-950"
            >
              Xem Tất Cả Phim
            </Button>
          </Link>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {nowShowing.map((movie) => (
              <MovieCard
                key={movie.movieId}
                id={movie.movieId || ""}
                title={movie.title}
                image={movie.posterUrl || ""}
                rating={8.0} // Nếu có trường rating thì thay thế
                genres={parseGenres(movie.genre)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="bg-gray-900/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sắp Chiếu</h2>
              <p className="text-gray-400">
                Chuẩn bị đón chờ các siêu phẩm sắp ra mắt
              </p>
            </div>
            <Link to="/coming-soon">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-950"
              >
                Xem Tất Cả
              </Button>
            </Link>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comingSoon.map((movie) => (
                <FeaturedMovie
                  key={movie.movieId}
                  id={movie.movieId || ""}
                  title={movie.title}
                  image={movie.posterUrl || ""}
                  releaseDate={
                    typeof movie.releaseDate === "string"
                      ? movie.releaseDate
                      : movie.releaseDate
                      ? [
                          movie.releaseDate.day,
                          movie.releaseDate.month,
                          movie.releaseDate.year,
                        ]
                          .filter(Boolean)
                          .join("/")
                      : ""
                  }
                  description={movie.description || ""}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Vì sao chọn CinemaTickets?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Trải nghiệm nền tảng đặt vé xem phim tốt nhất với các tính năng
              cao cấp và sự tiện lợi vượt trội
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/30 transition-colors">
                <Ticket className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đặt vé dễ dàng</h3>
              <p className="text-gray-400">
                Đặt vé nhanh chóng chỉ với vài cú nhấp chuột thông qua giao diện
                thân thiện
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/30 transition-colors">
                <MapPin className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nhiều cụm rạp</h3>
              <p className="text-gray-400">
                Lựa chọn hơn 15 cụm rạp cao cấp trên khắp thành phố
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/30 transition-colors">
                <Gift className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ưu đãi đặc biệt</h3>
              <p className="text-gray-400">
                Tận hưởng các ưu đãi độc quyền và khuyến mãi hấp dẫn
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/30 transition-colors">
                <Users className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đặt vé nhóm</h3>
              <p className="text-gray-400">
                Ưu đãi đặc biệt cho nhóm bạn hoặc sự kiện công ty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Luôn được cập nhật</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Đăng ký nhận bản tin của chúng tôi để là người đầu tiên biết về các
            phim mới, ưu đãi độc quyền và sự kiện đặc biệt
          </p>

          <div className="max-w-md mx-auto flex gap-4">
            <Input
              placeholder="Nhập email của bạn"
              className="bg-gray-800 border-gray-700 text-white flex-1"
            />
            <Button className="bg-red-600 hover:bg-red-700">Đăng ký</Button>
          </div>
        </div>
      </section>
    </>
  );
}
