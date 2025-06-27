import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  genres: string[];
}

export function MovieCard({
  id,
  title,
  image,
  rating,
  genres,
}: MovieCardProps) {
  return (
    <Link to={`/movies/${id}`} className="group">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] mb-3 group-hover:ring-2 ring-red-500 transition-all">
        <img
          src={
            image ||
            "https://images.seeklogo.com/logo-png/45/1/d-e-m-o-logo-png_seeklogo-453088.png"
          }
          alt={title}
          className="object-cover transition-transform group-hover:scale-105 w-full h-full absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <div className="text-white">
            <div className="flex items-center gap-1 mb-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold">{rating}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-1.5 py-0.5 bg-gray-800/80 rounded-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <h3 className="font-semibold line-clamp-1">{title}</h3>
    </Link>
  );
}
