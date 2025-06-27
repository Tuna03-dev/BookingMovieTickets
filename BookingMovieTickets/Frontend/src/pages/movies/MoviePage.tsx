import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Grid, List, Star, Clock, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/movie-card";
import { movieApis, type Movie } from "@/services/movieApis";

function parseGenres(genre?: string | null): string[] {
  if (!genre) return [];
  return genre.split(",").map((g) => g.trim());
}

export default function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlGenre = searchParams.get("genre") || "all";
  const urlSort = searchParams.get("sort") || "popularity";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedGenre, setSelectedGenre] = useState(urlGenre);
  const [sortBy, setSortBy] = useState(urlSort);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState(["all"]);

  // Cập nhật URL params khi state thay đổi
  const updateURLParams = (
    newSearch?: string,
    newGenre?: string,
    newSort?: string
  ) => {
    const params = new URLSearchParams(searchParams);

    if (newSearch !== undefined) {
      if (newSearch.trim()) {
        params.set("search", newSearch.trim());
      } else {
        params.delete("search");
      }
    }

    if (newGenre !== undefined) {
      if (newGenre !== "all") {
        params.set("genre", newGenre);
      } else {
        params.delete("genre");
      }
    }

    if (newSort !== undefined) {
      if (newSort !== "popularity") {
        params.set("sort", newSort);
      } else {
        params.delete("sort");
      }
    }

    setSearchParams(params);
  };

  // Cập nhật state khi URL params thay đổi
  useEffect(() => {
    setSearchTerm(urlSearch);
    setSelectedGenre(urlGenre);
    setSortBy(urlSort);
  }, [urlSearch, urlGenre, urlSort]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const odataQuery = [];

      const filterConditions = [];
      filterConditions.push(`status eq 'Đang chiếu'`);
      if (selectedGenre !== "all") {
        filterConditions.push(`contains(genre,'${selectedGenre}')`);
      }
      if (filterConditions.length > 0) {
        odataQuery.push(`$filter=${filterConditions.join(" and ")}`);
      }

      // Sorting logic
      if (sortBy === "release_date") {
        odataQuery.push(`$orderby=releaseDate desc`);
      } else if (sortBy === "title") {
        odataQuery.push(`$orderby=title asc`);
      } else if (sortBy === "popularity") {
        odataQuery.push(`$orderby=releaseDate desc`);
      }

      odataQuery.push(`$top=100`);
      const queryStr = odataQuery.join("&");
      try {
        const data = await movieApis.getOdataMovies(queryStr);
        const moviesData = Array.isArray(data) ? data : [];
        const allMovies = await movieApis.getOdataMovies("$top=100");
        setMovies(moviesData);

        const uniqueGenres = [
          "all",
          ...new Set(
            allMovies
              .flatMap(
                (movie) => movie.genre?.split(",").map((g) => g.trim()) || []
              )
              .filter((genre) => genre)
          ),
        ];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
        setGenres(["all"]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedGenre, sortBy]);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Handlers cho search và filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateURLParams(value, undefined, undefined);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    updateURLParams(undefined, genre, undefined);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    updateURLParams(undefined, undefined, sort);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSortBy("popularity");
    setSearchParams({});
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tất cả phim</h1>
          <p className="text-gray-400">
            Khám phá và đặt vé cho các bộ phim mới nhất
          </p>
        </div>
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm phim..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 bg-gray-900 border-gray-700 text-white"
                />
              </div>
              {/* Genre Filter */}
              <Select value={selectedGenre} onValueChange={handleGenreChange}>
                <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Thể loại" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {genres.map((genre) => (
                    <SelectItem
                      key={genre}
                      value={genre}
                      className="text-white"
                    >
                      {genre === "all" ? "Tất cả thể loại" : genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="popularity" className="text-white">
                    Phổ biến
                  </SelectItem>
                  <SelectItem value="release_date" className="text-white">
                    Ngày phát hành
                  </SelectItem>
                  <SelectItem value="title" className="text-white">
                    Tên phim
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "secondary"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid" ? "bg-red-600 hover:bg-red-700" : ""
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "secondary"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list" ? "bg-red-600 hover:bg-red-700" : ""
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Active Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {searchTerm && (
              <Badge variant="secondary" className="bg-gray-800">
                Tìm kiếm: {searchTerm}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    updateURLParams("", undefined, undefined);
                  }}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedGenre !== "all" && (
              <Badge variant="secondary" className="bg-gray-800">
                Thể loại: {selectedGenre}
                <button
                  onClick={() => {
                    setSelectedGenre("all");
                    updateURLParams(undefined, "all", undefined);
                  }}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {sortBy !== "popularity" && (
              <Badge variant="secondary" className="bg-gray-800">
                Sắp xếp:{" "}
                {sortBy === "release_date" ? "Ngày phát hành" : "Tên phim"}
                <button
                  onClick={() => {
                    setSortBy("popularity");
                    updateURLParams(undefined, undefined, "popularity");
                  }}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Hiển thị {filteredMovies.length} trên tổng {movies.length} phim
          </p>
        </div>
        {/* Movies Grid/List */}
        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.movieId}
                id={movie.movieId || ""}
                title={movie.title}
                image={movie.posterUrl || ""}
                rating={8.0}
                genres={parseGenres(movie.genre)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMovies.map((movie) => (
              <div
                key={movie.movieId}
                className="bg-gray-900 rounded-lg p-6 flex gap-6 hover:bg-gray-800 transition-colors"
              >
                <div className="w-24 h-36 flex-shrink-0">
                  <img
                    src={movie.posterUrl || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{movie.title}</h3>
                    <Badge
                      variant={
                        movie.status === "Đang chiếu" ? "default" : "secondary"
                      }
                    >
                      {movie.status === "Đang chiếu"
                        ? "Đang chiếu"
                        : "Sắp chiếu"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>8.0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{movie.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {movie.releaseDate &&
                        typeof movie.releaseDate === "object"
                          ? `${movie.releaseDate.day}/${movie.releaseDate.month}/${movie.releaseDate.year}`
                          : movie.releaseDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {parseGenres(movie.genre).map((genre) => (
                      <Badge key={genre} variant="outline" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {movie.description}
                  </p>
                  <div className="flex gap-3">
                    <Link to={`/movies/${movie.movieId}`}>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Xem chi tiết
                      </Button>
                    </Link>
                    {movie.status === "Đang chiếu" && (
                      <Button size="sm" variant="secondary">
                        Đặt vé ngay
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* No Results */}
        {!loading && filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              Không tìm thấy phim phù hợp với tiêu chí của bạn
            </div>
            <Button onClick={clearFilters} variant="default">
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
