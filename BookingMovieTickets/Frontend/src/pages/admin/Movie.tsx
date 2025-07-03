import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import { ColumnHeader } from "../../components/admin/columns";
import { Badge } from "../../components/ui/badge";
// TODO: Tạo MovieDialog nếu cần
// import { MovieDialog } from "../../components/admin/MovieDialog";

type Movie = {
  movieId: string;
  title: string;
  description?: string;
  genre?: string;
  duration: number;
  releaseDate?: string;
  posterUrl?: string;
  status: string;
  director?: string;
  actors?: string;
};

export default function MoviePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // TODO: Kết nối OData API thực tế
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
          <div className="text-sm text-muted-foreground">{row.original.director}</div>
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
      header: ({ column }) => <ColumnHeader column={column} title="Release Date" />,
      cell: ({ row }) => (row.original.releaseDate ? new Date(row.original.releaseDate).toLocaleDateString() : "N/A"),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "now_showing"
              ? "default"
              : row.original.status === "upcoming"
              ? "secondary"
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
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
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
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
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
        {/* Data Table */}
        <DataTableServerSide columns={columns} onPaginationChange={async () => ({ value: [], totalCount: 0 })} />
        {/* TODO: MovieDialog */}
      </div>
  );
} 