import { Link } from "react-router-dom";
import { Star, Calendar, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ComingSoonMovieCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  genres: string[];
  releaseDate: string;
  isNotifyEnabled: boolean;
}

export function ComingSoonMovieCard({
  id,
  title,
  image,
  rating,
  genres,
  releaseDate,
  isNotifyEnabled,
}: ComingSoonMovieCardProps) {
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Đang chiếu";
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Ngày mai";
    if (diffDays < 30) return `${diffDays} ngày`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} tháng`;
    return `${Math.ceil(diffDays / 365)} năm`;
  };

  return (
    <div className="group">
      <Link to={`/coming-soon/${id}`}>
        <div className="relative overflow-hidden rounded-lg aspect-[2/3] mb-3 group-hover:ring-2 ring-orange-500 transition-all">
          <img
            src={
              image ||
              "https://images.seeklogo.com/logo-png/45/1/d-e-m-o-logo-png_seeklogo-453088.png"
            }
            alt={title}
            className="object-cover transition-transform group-hover:scale-105 w-full h-full absolute inset-0"
          />

          {/* Coming Soon Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className="text-orange-500 border-orange-500 text-xs"
            >
              Sắp chiếu
            </Badge>
          </div>

          {/* Notify Badge */}
          {isNotifyEnabled && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-blue-600 text-xs">
                <Bell className="h-3 w-3 mr-1" />
                Đang theo dõi
              </Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <div className="text-white w-full">
              <div className="flex items-center justify-between mb-2">
                {rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{rating}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">
                    {formatReleaseDate(releaseDate)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-1.5 py-0.5 bg-gray-800/80 rounded-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <Button
                size="sm"
                className="w-full bg-orange-600 hover:bg-orange-700 text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle notify me action
                }}
              >
                <Bell className="h-3 w-3 mr-1" />
                {isNotifyEnabled ? "Đang theo dõi" : "Nhắc tôi"}
              </Button>
            </div>
          </div>
        </div>
      </Link>
      <h3 className="font-semibold line-clamp-1 mb-1">{title}</h3>
      <p className="text-sm text-gray-400">
        Khởi chiếu sau {formatReleaseDate(releaseDate)}
      </p>
    </div>
  );
}
