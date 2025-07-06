import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnHeader } from "../../components/admin/columns";
import { Badge } from "../../components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { movieApis } from "@/services/movieApis";
import { MovieDialog } from "./components/MovieDialog";
import { toast } from "sonner";

export type Movie = {
  movieId: string;
  title: string;
  description?: string;
  genre?: string;
  duration: number;
  releaseDate?: string;
  posterUrl?: string;
  status: string;
  director?: string;
  showtimeCount?: number;
  actors?: string;
};

export default function MoviePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    movieApis.getOdataMovies("").then((data) => {
      setMovies(Array.isArray(data) ? data : data.value || []);
      setLoading(false);
      console.log("Movies loaded:", data);
    });
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      movie.title?.toLowerCase().includes(search) ||
      movie.director?.toLowerCase().includes(search) ||
      movie.actors?.toLowerCase().includes(search);
    const matchesStatus =
      statusFilter === "all" || movie.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: ColumnDef<Movie>[] = [
    {
      accessorKey: "posterUrl",
      header: "Poster",
      cell: ({ row }) => (
        <img
          src={row.original.posterUrl || "/placeholder.svg?height=80&width=60"}
          alt={row.original.title}
          className="w-12 h-16 object-cover rounded"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => <ColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.director}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "genre",
      header: ({ column }) => <ColumnHeader column={column} title="Genre" />,
    },
    {
      accessorKey: "duration",
      header: ({ column }) => <ColumnHeader column={column} title="Duration" />,
      cell: ({ row }) => `${row.original.duration} min`,
    },
    {
      accessorKey: "releaseDate",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Release Date" />
      ),
      cell: ({ row }) =>
        row.original.releaseDate
          ? new Date(row.original.releaseDate).toLocaleDateString()
          : "N/A",
    },

    {
      accessorKey: "actors",
      header: ({ column }) => <ColumnHeader column={column} title="Actors" />,
    },
    {
      accessorKey: "director",
      header: ({ column }) => <ColumnHeader column={column} title="Director" />,
    },
    {
      accessorKey: "showtimeCount",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Showtimes" />
      ),
      cell: ({ row }) => row.original.showtimeCount || 0,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "Đang chiếu"
              ? "default"
              : row.original.status === "Sắp chiếu"
              ? "destructive"
              : "outline"
          }
        >
          {row.original.status.replace("_", " ").toUpperCase()}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedMovie(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => setMovieToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Thêm hàm reload movies
  const reloadMovies = async () => {
    setLoading(true);
    const data = await movieApis.getOdataMovies("");
    setMovies(Array.isArray(data) ? data : data.value || []);
    setLoading(false);
  };

  // Xử lý xóa mềm phim
  const handleSoftDeleteMovie = async (movie: Movie) => {
    setLoading(true);
    try {
      await movieApis.softDeleteMovieById(movie.movieId);
      toast.success(`Đã xóa mềm phim "${movie.title}"!`);
      await reloadMovies();
    } catch (err: any) {
      toast.error("Không thể xóa phim này!");
    } finally {
      setLoading(false);
      setMovieToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Movies</h1>
            <p className="text-muted-foreground">Manage your movie catalog</p>
          </div>
          <Button
            onClick={() => {
              setSelectedMovie(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Movie
          </Button>
        </div>

        {/* Filter bar đẹp */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies, directors, actors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Đang chiếu">Now Showing</SelectItem>
              <SelectItem value="Sắp chiếu">Upcoming</SelectItem>
              <SelectItem value="Ngừng chiếu">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredMovies.length} of {movies.length} movies
        </div>

        {/* Data Table */}
        <DataTable columns={columns} data={filteredMovies} />
        <MovieDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedMovie(null);
          }}
          movie={selectedMovie ?? undefined}
        />

        {/* Alert Dialog xác nhận xóa mềm */}
        <AlertDialog
          open={!!movieToDelete}
          onOpenChange={() => setMovieToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa phim</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa phim "{movieToDelete?.title}"? Phim sẽ
                không hiển thị trong danh sách nhưng vẫn được lưu trong cơ sở dữ
                liệu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  movieToDelete && handleSoftDeleteMovie(movieToDelete)
                }
                className="bg-red-600 hover:bg-red-700"
              >
                Xóa phim
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
