import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import { ColumnHeader } from "../../components/admin/columns";

type Booking = {
  bookingId: string;
  userId: string;
  showtimeId: string;
  totalPrice: number;
  status: string;
};

export default function BookingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "bookingId",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Booking ID" />
      ),
    },
    {
      accessorKey: "userId",
      header: ({ column }) => <ColumnHeader column={column} title="User ID" />,
    },
    {
      accessorKey: "showtimeId",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Showtime ID" />
      ),
    },
    {
      accessorKey: "totalPrice",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Total Price" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
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
              setSelectedBooking(row.original);
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
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage bookings</p>
        </div>
        <Button
          onClick={() => {
            setSelectedBooking(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Booking
        </Button>
      </div>
      <DataTableServerSide
        columns={columns}
        onPaginationChange={async () => ({ value: [], totalCount: 0 })}
      />
      {/* TODO: BookingDialog */}
    </div>
  );
}


