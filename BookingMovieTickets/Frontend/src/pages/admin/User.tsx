import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { AdminLayout } from "../../layouts/AdminLayout";
import { DataTableServerSide } from "../../components/admin/data-table-server-side";
import { ColumnHeader } from "../../components/admin/columns";

// TODO: Tạo UserDialog nếu cần
// import { UserDialog } from "../../components/admin/UserDialog";

type User = {
  id: string;
  userName: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  status?: string;
};

export default function UserPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns: ColumnDef<User>[] = [
    { accessorKey: "userName", header: ({ column }) => <ColumnHeader column={column} title="Username" /> },
    { accessorKey: "email", header: ({ column }) => <ColumnHeader column={column} title="Email" /> },
    { accessorKey: "fullName", header: ({ column }) => <ColumnHeader column={column} title="Full Name" /> },
    { accessorKey: "phoneNumber", header: ({ column }) => <ColumnHeader column={column} title="Phone" /> },
    { accessorKey: "address", header: ({ column }) => <ColumnHeader column={column} title="Address" /> },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(row.original); setIsDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
      </div>
    ), enableSorting: false },
  ];

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage users</p>
          </div>
          <Button onClick={() => { setSelectedUser(null); setIsDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add User</Button>
        </div>
        <DataTableServerSide columns={columns} onPaginationChange={async () => ({ value: [], totalCount: 0 })} />
        {/* TODO: UserDialog */}
      </div>
  );
} 