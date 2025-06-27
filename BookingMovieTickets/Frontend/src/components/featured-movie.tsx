import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FeaturedMovieProps {
  id: string;
  title: string;
  image: string;
  releaseDate: string;
  description: string;
}

export function FeaturedMovie({
  id,
  title,
  image,
  releaseDate,
  description,
}: FeaturedMovieProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            image ||
            "https://images.seeklogo.com/logo-png/45/1/d-e-m-o-logo-png_seeklogo-453088.png"
          }
          alt={title}
          className="object-cover w-full h-full absolute inset-0 transition-transform group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs">
          <CalendarDays className="h-3 w-3" />
          <span>{releaseDate}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-red-500 text-red-500 hover:bg-red-950 hover:text-white transition-colors"
          >
            Nhắc tôi
          </Button>
          <Link to={`/movies/${id}`}>
            <Button size="sm" variant="ghost">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
