import { Clock, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowtimeSelector } from "@/components/showtime-selector";
import { useEffect, useState } from "react";
import type { MovieResponseDTO } from "@/services/movieApis";
import { movieApis } from "@/services/movieApis";
import { useParams } from "react-router-dom";

export default function MoviePage() {
  const [movieData, setMovieData] = useState<MovieResponseDTO | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        if (!params.id) {
          throw new Error("Movie ID is undefined");
        }
        console.log("Fetching movie data for ID:", params.id);
        const data = await movieApis.getMovieById(params.id as string);
        console.log("Fetched movie data:", data);
        setMovieData(data);
      } catch (error) {
        console.error("Failed to fetch movie data:", error);
      }
    };

    fetchMovieData();
  }, []);

  if (!movieData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Movie Hero */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <img
          src="/placeholder.svg?height=1080&width=1920"
          alt={movieData?.title}
          className="object-cover"
        />
        <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-16">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src="/placeholder.svg?height=450&width=300"
                alt={movieData.title}
                width={300}
                height={450}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {movieData.title}
              </h1>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>9.5</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movieData.duration} phút</span>
                </span>

                <div className="flex gap-2 flex-wrap">
                  {movieData.genre?.split(",")?.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-gray-800 rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <p className="max-w-3xl mb-6">{movieData.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thanh đặt vé nhanh */}

      {/* Thông tin phim và đặt vé */}
      <section className="container mx-auto py-12 px-4">
        <Tabs defaultValue="showtimes" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-8">
            <TabsTrigger
              value="showtimes"
              className="data-[state=active]:bg-red-600"
            >
              Suất chiếu
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-red-600"
            >
              Chi tiết
            </TabsTrigger>
          </TabsList>
          <TabsContent value="showtimes" className="mt-0">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Chọn suất chiếu</h2>
              <ShowtimeSelector movieId={movieData.movieId} movieTitle={movieData.title} />
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-0">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Thông tin phim</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tóm tắt</h3>
                  <p className="text-gray-300 mb-6">{movieData.description}</p>

                  <h3 className="text-lg font-semibold mb-2">Đạo diễn</h3>
                  <p className="text-gray-300 mb-6">{movieData.director}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Diễn viên</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {movieData.actors?.split(",")?.map((actor) => (
                      <div key={actor} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0"></div>
                        <span className="text-gray-300">{actor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
