import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import { ColumnHeader } from "../../components/admin/columns";

type Room = {
  roomId: string;
  cinemaId: string;
  roomNumber: string;
  totalSeats: number;
};

export default function RoomPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const columns: ColumnDef<Room>[] = [
    {
      accessorKey: "roomId",
      header: ({ column }) => <ColumnHeader column={column} title="Room ID" />,
    },
    {
      accessorKey: "cinemaId",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Cinema ID" />
      ),
    },
    {
      accessorKey: "roomNumber",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Room Number" />
      ),
    },
    {
      accessorKey: "totalSeats",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Total Seats" />
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
              setSelectedRoom(row.original);
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
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Rooms</h1>
            <p className="text-muted-foreground">Manage rooms in cinemas</p>
          </div>
          <Button
            onClick={() => {
              setSelectedRoom(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>
        <DataTableServerSide
          columns={columns}
          onPaginationChange={async () => ({ value: [], totalCount: 0 })}
        />
        {/* TODO: RoomDialog */}
      </div>
    </>
  );
}
