import { Plus, Search, Filter, Edit, Trash2, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import type { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "../../components/admin/columns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { PaginatedResponse } from "@/types/paginated-response";
import type { components } from "../../types/api-types";
import { getCinemas } from "../../services/cinemaApis";
type CinemaResponseDTO = components["schemas"]["CinemaResponseDTO"];
export default function CinemaPages() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] =
    useState<CinemaResponseDTO | null>(null);

  const columns: ColumnDef<CinemaResponseDTO>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "address",
      header: ({ column }) => <ColumnHeader column={column} title="Address" />,
    },
    {
      accessorKey: "city",
      header: ({ column }) => <ColumnHeader column={column} title="City" />,
      cell: ({ row }) =>
        row.original.city ?? (
          <span className="text-muted-foreground italic">N/A</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) =>
        row.original.createdAt ? (
          new Date(row.original.createdAt).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
        ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) =>
        row.original.updatedAt ? (
          new Date(row.original.updatedAt).toLocaleDateString()
        ) : (
          <span className="text-muted-foreground italic">N/A</span>
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
              setSelectedCinema(row.original);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
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
          <h1 className="text-3xl font-bold">Cinemas</h1>
          <p className="text-muted-foreground">
            Manage cinema locations and facilities
          </p>
        </div>
        <Button
        // onClick={() => {
        //   setSelectedCinema(null)
        //   setIsDialogOpen(true)
        // }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Cinema
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cinemas..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <DataTableServerSide
        columns={columns}
        onPaginationChange={(pageNumber, pageSize) =>
          getCinemas(pageNumber, pageSize)
        }
        onSearchChange={(searchTerm, pageNumber, pageSize) =>
          getCinemas(pageNumber, pageSize, searchTerm)
        }
        searchKey="title"
        searchPlaceholder="Search movies..."
        defaultPageSize={10}
      />

      {/* <CinemaDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} cinema={selectedCinema} /> */}
    </div>
  );
}
