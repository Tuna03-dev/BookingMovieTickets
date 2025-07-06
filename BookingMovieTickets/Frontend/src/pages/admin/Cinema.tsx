import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnHeader } from "../../components/admin/columns";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cinemaApis } from "@/services/cinemaApis";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Cinema = {
  cinemaId: string;
  name: string;
  address: string;
  city?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  roomCount?: number;
};

export default function CinemaPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null);
  const [formData, setFormData] = useState<Partial<Cinema>>({});
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(false);
  const [cinemaToDelete, setCinemaToDelete] = useState<Cinema | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityList, setCityList] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (cityList.length === 0) {
        const res = await fetch("/VietNamCity.json");
        const data = await res.json();
        console.log("City data loaded:", data);
        setCityList(data);
      }
      reloadCinemas();
    }
    fetchData();
  }, []);

  const reloadCinemas = async () => {
    setLoading(true);
    const data = await cinemaApis.getCinemas();
    console.log("Cinemas data loaded:", data);
    // Type assertion to help TypeScript understand the structure
    if (
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray((data as any).items)
    ) {
      setCinemas((data as { items: Cinema[] }).items);
    } else if (Array.isArray(data)) {
      setCinemas(data as Cinema[]);
    } else {
      setCinemas([]);
    }
    setLoading(false);
  };

  const filteredCinemas = cinemas.filter((cinema) => {
    const search = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      cinema.name?.toLowerCase().includes(search) ||
      cinema.address?.toLowerCase().includes(search) ||
      cinema.city?.toLowerCase().includes(search)
    );
  });

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
      accessorKey: "roomCount",
      header: ({ column }) => <ColumnHeader column={column} title="Rooms" />,
      cell: ({ row }) => row.original.roomCount || 0,
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCinema(row.original);
              setFormData({
                name: row.original.name,
                address: row.original.address,
                city: row.original.city,
              });
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => setCinemaToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  // Xử lý xóa cinema
  const handleDeleteCinema = async (cinema: Cinema) => {
    setLoading(true);
    try {
      await cinemaApis.deleteCinema(cinema.cinemaId);
      toast.success(`Đã xóa rạp "${cinema.name}"!`);
      await reloadCinemas();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      toast.error("Không thể xóa rạp này!");
    } finally {
      setLoading(false);
      setCinemaToDelete(null);
    }
  };

  // Xử lý lưu cinema (thêm/sửa)
  const handleSaveCinema = async (formData: unknown) => {
    setLoading(true);
    try {
      if (selectedCinema) {
        await cinemaApis.updateCinema(selectedCinema.cinemaId, formData);
        toast.success("Cập nhật rạp thành công!");
      } else {
        await cinemaApis.createCinema(formData);
        toast.success("Thêm rạp thành công!");
      }
      setIsDialogOpen(false);
      setSelectedCinema(null);
      setFormData({});
      await reloadCinemas();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast.error("Có lỗi khi lưu rạp!");
    } finally {
      setLoading(false);
    }
  };

  const openDialog = async (cinema: Cinema | null) => {
    setSelectedCinema(cinema);
    setFormData({
      name: cinema?.name || "",
      address: cinema?.address || "",
      city: cinema?.city || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cinemas</h1>
          <p className="text-muted-foreground">
            Manage cinema locations and facilities
          </p>
        </div>
        <Button onClick={() => openDialog(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cinema
        </Button>
      </div>
      <div className="flex gap-4 items-center mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cinemas, address, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing {filteredCinemas.length} of {cinemas.length} cinemas
      </div>
      <DataTable columns={columns} data={filteredCinemas} />

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedCinema ? "Edit Cinema" : "Add Cinema"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = Object.fromEntries(
                  new FormData(e.currentTarget as HTMLFormElement)
                );
                await handleSaveCinema(formData);
              }}
              className="space-y-4"
            >
              <input
                name="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Cinema Name"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                name="address"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Address"
                className="w-full border rounded px-3 py-2"
                required
              />
              <Select
                name="city"
                value={formData.city || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, city: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {cityList.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedCinema(null);
                    setFormData({});
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{selectedCinema ? "Save" : "Add"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Alert Dialog xác nhận xóa */}
      <AlertDialog
        open={!!cinemaToDelete}
        onOpenChange={() => setCinemaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa rạp</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa rạp "{cinemaToDelete?.name}"? Thao tác
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                cinemaToDelete && handleDeleteCinema(cinemaToDelete)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa rạp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
