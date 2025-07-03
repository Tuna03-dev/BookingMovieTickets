import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import { ColumnHeader } from "../../components/admin/columns";

type Cinema = {
  cinemaId: string;
  name: string;
  address: string;
  city?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function CinemaPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);

  const columns: ColumnDef<Cinema>[] = [
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
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A",
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Updated At" />
      ),
      cell: ({ row }) =>
        row.original.updatedAt
          ? new Date(row.original.updatedAt).toLocaleDateString()
          : "N/A",
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
          onClick={() => {
            setSelectedCinema(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Cinema
        </Button>
      </div>
      <DataTableServerSide
        columns={columns}
        onPaginationChange={async () => ({ value: [], totalCount: 0 })}
      />
      {/* TODO: CinemaDialog */}
    </div>
  );
}
