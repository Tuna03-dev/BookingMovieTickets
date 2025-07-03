import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import { ColumnHeader } from "../../components/admin/columns";

type Seat = {
  seatId: string;
  roomId: string;
  row: string;
  seatColumn: number;
  seatNumber?: string;
  seatType?: string;
  isAvailable?: boolean;
};

export default function SeatPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const columns: ColumnDef<Seat>[] = [
    {
      accessorKey: "seatId",
      header: ({ column }) => <ColumnHeader column={column} title="Seat ID" />,
    },
    {
      accessorKey: "roomId",
      header: ({ column }) => <ColumnHeader column={column} title="Room ID" />,
    },
    {
      accessorKey: "row",
      header: ({ column }) => <ColumnHeader column={column} title="Row" />,
    },
    {
      accessorKey: "seatColumn",
      header: ({ column }) => <ColumnHeader column={column} title="Column" />,
    },
    {
      accessorKey: "seatNumber",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Seat Number" />
      ),
    },
    {
      accessorKey: "seatType",
      header: ({ column }) => <ColumnHeader column={column} title="Type" />,
    },
    {
      accessorKey: "isAvailable",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Available" />
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
              setSelectedSeat(row.original);
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
            <h1 className="text-3xl font-bold">Seats</h1>
            <p className="text-muted-foreground">Manage seats in rooms</p>
          </div>
          <Button
            onClick={() => {
              setSelectedSeat(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Seat
          </Button>
        </div>
        <DataTableServerSide
          columns={columns}
          onPaginationChange={async () => ({ value: [], totalCount: 0 })}
        />
        {/* TODO: SeatDialog */}
      </div>
    </>
  );
}
