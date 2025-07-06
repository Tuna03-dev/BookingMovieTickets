import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Armchair,
  Grid3X3,
  Plus,
  Save,
  Loader2,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";
import { seatApi, type Seat } from "@/services/seatApi";
import { cinemaApis } from "@/services/cinemaApis";
import { showtimeApi, type RoomResponseDTO } from "@/services/showTimeApi";

interface Cinema {
  cinemaId: string;
  name: string;
  address: string;
  city: string;
}

interface SeatStats {
  totalSeats: number;
  activeSeats: number;
  inactiveSeats: number;
  hasBooking: boolean;
}

export default function SeatsManagementPage() {
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [rooms, setRooms] = useState<RoomResponseDTO[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatLayout, setSeatLayout] = useState<{
    rows: number;
    columns: number;
  }>({ rows: 10, columns: 12 });
  const [loading, setLoading] = useState(false);
  const [hasBooking, setHasBooking] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [seatStats, setSeatStats] = useState<SeatStats>({
    totalSeats: 0,
    activeSeats: 0,
    inactiveSeats: 0,
    hasBooking: false,
  });

  // Load data from APIs
  useEffect(() => {
    loadCinemas();
  }, []);

  useEffect(() => {
    if (selectedCinema) {
      loadRooms(selectedCinema);
    }
  }, [selectedCinema]);

  useEffect(() => {
    if (selectedRoom) {
      loadSeats(selectedRoom);
      checkHasBooking(selectedRoom);
    } else {
      setSeats([]);
      setHasBooking(false);
      setSeatStats({
        totalSeats: 0,
        activeSeats: 0,
        inactiveSeats: 0,
        hasBooking: false,
      });
    }
  }, [selectedRoom]);

  // Update seat stats when seats change
  useEffect(() => {
    const totalSeats = seats.length;
    const activeSeats = seats.filter((seat) => !seat.deletedAt).length;
    const inactiveSeats = seats.filter((seat) => seat.deletedAt).length;

    setSeatStats({
      totalSeats,
      activeSeats,
      inactiveSeats,
      hasBooking,
    });
  }, [seats, hasBooking]);

  const loadCinemas = async () => {
    try {
      setLoading(true);
      const response = await cinemaApis.getCinemas();

      let cinemaData: Cinema[] = [];
      if (
        typeof response === "object" &&
        response !== null &&
        "items" in response &&
        Array.isArray((response as any).items)
      ) {
        cinemaData = (response as { items: Cinema[] }).items;
      } else if (Array.isArray(response)) {
        cinemaData = response as Cinema[];
      }
      setCinemas(cinemaData);
      if (cinemaData.length > 0) {
        setSelectedCinema(cinemaData[0].cinemaId);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách rạp chiếu");
      console.error("Error loading cinemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async (cinemaId: string) => {
    try {
      setLoading(true);
      const roomsData = await showtimeApi.getRoomsByCinema(cinemaId);
      setRooms(roomsData);
      if (roomsData.length > 0) {
        setSelectedRoom(roomsData[0].roomId);
      } else {
        setSelectedRoom(""); // Không có phòng nào
        setSeats([]); // Xóa danh sách ghế
      }
    } catch (error) {
      toast.error("Không thể tải danh sách phòng chiếu");
      console.error("Error loading rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSeats = async (roomId: string) => {
    try {
      setLoading(true);
      const response = await seatApi.getSeatsByRoom(roomId);
      setSeats(response);
    } catch (error) {
      toast.error("Không thể tải danh sách ghế ngồi");
      console.error("Error loading seats:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkHasBooking = async (roomId: string) => {
    try {
      setLoadingBooking(true);
      const result = await seatApi.hasBooking(roomId);
      setHasBooking(result);
    } catch (error) {
      console.error("Error checking booking status:", error);
      setHasBooking(false);
    } finally {
      setLoadingBooking(false);
    }
  };

  const filteredRooms = rooms;
  const filteredSeats = seats.filter((seat) => seat.roomId === selectedRoom);

  const validateLayoutInput = () => {
    if (seatLayout.rows < 1 || seatLayout.rows > 26) {
      toast.error("Số hàng phải từ 1 đến 26");
      return false;
    }
    if (seatLayout.columns < 1 || seatLayout.columns > 20) {
      toast.error("Số cột phải từ 1 đến 20");
      return false;
    }
    if (seatLayout.rows * seatLayout.columns > 500) {
      toast.error("Tổng số ghế không được vượt quá 500");
      return false;
    }
    return true;
  };

  const generateSeatLayout = async () => {
    if (!selectedRoom) {
      toast.error("Vui lòng chọn phòng chiếu");
      return;
    }

    if (!validateLayoutInput()) {
      return;
    }

    try {
      setLoading(true);

      const response = await seatApi.generateSeatLayout({
        roomId: selectedRoom,
        rows: seatLayout.rows,
        columns: seatLayout.columns,
      });

      setSeats(response);
      toast.success(
        `Đã tạo ${response.length} ghế cho phòng ${
          rooms.find((r) => r.roomId === selectedRoom)?.roomNumber
        }`
      );
    } catch (error) {
      toast.error("Không thể tạo layout ghế");
      console.error("Error generating seat layout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      await seatApi.addRow(selectedRoom);
      await loadSeats(selectedRoom);
      toast.success("Đã thêm 1 hàng ghế mới!");
    } catch (error) {
      toast.error("Không thể thêm hàng ghế mới");
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      await seatApi.addColumn(selectedRoom);
      await loadSeats(selectedRoom);
      toast.success("Đã thêm 1 cột ghế mới!");
    } catch (error) {
      toast.error("Không thể thêm cột ghế mới");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedRoomInfo = () => {
    return rooms.find((r) => r.roomId === selectedRoom);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản Lý Ghế Ngồi
          </h1>
          <p className="text-muted-foreground">
            Thiết kế và quản lý sơ đồ ghế ngồi cho từng phòng chiếu
          </p>
        </div>
        {selectedRoom && (
          <div className="flex items-center gap-2">
            {loadingBooking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : hasBooking ? (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Có booking</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Chưa có booking</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Rạp Chiếu
              </label>
              <Select
                value={selectedCinema}
                onValueChange={setSelectedCinema}
                disabled={loading}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Chọn rạp chiếu" />
                </SelectTrigger>
                <SelectContent>
                  {cinemas.map((cinema) => (
                    <SelectItem key={cinema.cinemaId} value={cinema.cinemaId}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {cinema.name} - {cinema.city}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Phòng Chiếu
              </label>
              <Select
                value={selectedRoom}
                onValueChange={setSelectedRoom}
                disabled={loading}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Chọn phòng chiếu" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRooms.map((room) => (
                    <SelectItem key={room.roomId} value={room.roomId}>
                      <div className="flex items-center gap-2">
                        <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {room.roomNumber} ({room.totalSeats} ghế)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="layout" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-lg">
          <TabsTrigger
            value="layout"
            className="data-[state=inactive]:bg-gray-200"
          >
            Sơ Đồ Ghế
          </TabsTrigger>
          <TabsTrigger
            value="generator"
            className="data-[state=inactive]:bg-gray-200"
          >
            Tạo Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-6">
          {/* Seat Layout */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl">
                Sơ Đồ Ghế Ngồi - Phòng {getSelectedRoomInfo()?.roomNumber}
              </CardTitle>
              <div className="text-center text-sm text-muted-foreground font-medium">
                MÀN HÌNH
              </div>
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full mx-auto w-3/4 shadow-inner"></div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Armchair className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    Rạp này chưa có phòng chiếu nào
                  </p>
                  <p className="text-sm">
                    Vui lòng tạo phòng chiếu trước khi quản lý ghế
                  </p>
                </div>
              ) : selectedRoom === "" ? (
                <div className="text-center text-muted-foreground py-12">
                  <Armchair className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    Vui lòng chọn phòng chiếu
                  </p>
                  <p className="text-sm">Chọn phòng chiếu để xem sơ đồ ghế</p>
                </div>
              ) : seats.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Armchair className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Phòng này chưa có ghế</p>
                  <p className="text-sm">
                    Sử dụng tab "Tạo Layout" để tạo ghế cho phòng
                  </p>
        </div>
              ) : (
                <div className="space-y-3 overflow-x-auto">
                  {/* Lấy danh sách row và column duy nhất */}
                  {(() => {
                    const rows = Array.from(
                      new Set(filteredSeats.map((s) => s.row))
                    ).sort();
                    const columns = Array.from(
                      new Set(
                        filteredSeats
                          .filter((s) => s.row === rows[0])
                          .map((s) => s.seatColumn)
                      )
                    ).sort((a, b) => a - b);

  return (
                      <div className="min-w-max mx-auto">
                        {/* SeatColumn label phía trên */}
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="w-10" />
                          {columns.map((col) => (
                            <div
                              key={col}
                              className="w-10 text-center text-xs text-muted-foreground font-medium"
                            >
                              {col}
                            </div>
                          ))}
                          <div className="w-10" />
                        </div>

                        {/* Ma trận ghế */}
                        {rows.map((row) => (
                          <div
                            key={row}
                            className="flex items-center justify-center gap-2"
                          >
                            {/* Row Label Left */}
                            <div className="w-10 text-center font-semibold text-sm text-muted-foreground">
                              {row}
                            </div>
                            {/* Seats */}
                            <div className="flex gap-1">
                              {columns.map((col) => {
                                const seat = filteredSeats.find(
                                  (s) => s.row === row && s.seatColumn === col
                                );
                                if (!seat) {
                                  return (
                                    <div key={col} className="w-10 h-10" />
                                  );
                                }
                                const isInactive = seat.deletedAt;
                                return (
                                  <div
                                    key={seat.seatId}
                                    className="relative flex flex-col items-center"
                                  >
                                    <div
                                      className={`
                                        w-10 h-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                                        ${
                                          isInactive
                                            ? "bg-gray-300 hover:bg-gray-400 border-gray-400 text-gray-600"
                                            : "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white"
                                        }
                                        text-xs font-medium shadow-sm cursor-pointer
                                      `}
                                      title={`${seat.seatNumber}${
                                        isInactive ? " (Không hoạt động)" : ""
                                      }`}
                                    >
                                      <Armchair className="h-4 w-4" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Row Label Right */}
                            <div className="w-10 text-center font-semibold text-sm text-muted-foreground">
                              {row}
                            </div>
                          </div>
                        ))}

                        {/* SeatColumn label phía dưới */}
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <div className="w-10" />
                          {columns.map((col) => (
                            <div
                              key={col}
                              className="w-10 text-center text-xs text-muted-foreground font-medium"
                            >
                              {col}
                            </div>
                          ))}
                          <div className="w-10" />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Legend */}
              {seats.length > 0 && (
                <div className="mt-12 p-6 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-4 text-center">Chú Thích</h4>
                  <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                        <Armchair className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">Ghế Hoạt Động</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                        <Armchair className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">
                        Ghế Không Hoạt Động
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {hasBooking ? "Thêm Hàng/Cột Ghế" : "Tạo Layout Ghế Tự Động"}
              </CardTitle>
              {hasBooking && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">
                    Phòng này đã có booking. Chỉ có thể thêm hàng/cột mới để
                    tránh ảnh hưởng đến dữ liệu hiện có.
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {hasBooking ? (
                <div className="flex flex-col gap-4 items-center">
                  <Button
                    onClick={handleAddRow}
                    className="w-full max-w-xs h-11"
                    disabled={loading || !selectedRoom}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Thêm 1 Hàng Ghế
                  </Button>
                  <Button
                    onClick={handleAddColumn}
                    className="w-full max-w-xs h-11"
                    disabled={loading || !selectedRoom}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Thêm 1 Cột Ghế
                  </Button>
                  <div className="text-center text-muted-foreground text-sm mt-2">
                    Không thể tạo lại layout khi phòng đã có booking. Chỉ có thể
                    thêm hàng/cột mới.
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Số Hàng
                      </label>
                      <Input
                        type="number"
                        value={seatLayout.rows}
                        onChange={(e) =>
                          setSeatLayout((prev) => ({
                            ...prev,
                            rows: Number.parseInt(e.target.value) || 1,
                          }))
                        }
                        min="1"
                        max="26"
                        disabled={loading}
                        className="h-10"
                        placeholder="Nhập số hàng (1-26)"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tối đa 26 hàng (A-Z)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Số Cột
                      </label>
                      <Input
                        type="number"
                        value={seatLayout.columns}
                        onChange={(e) =>
                          setSeatLayout((prev) => ({
                            ...prev,
                            columns: Number.parseInt(e.target.value) || 1,
                          }))
                        }
                        min="1"
                        max="20"
                        disabled={loading}
                        className="h-10"
                        placeholder="Nhập số cột (1-20)"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tối đa 20 cột
                      </p>
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Tổng ghế sẽ tạo:{" "}
                        <span className="font-semibold text-foreground">
                          {seatLayout.rows * seatLayout.columns}
                        </span>
                      </p>
                      {seatLayout.rows * seatLayout.columns > 500 && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠️ Số ghế quá lớn có thể ảnh hưởng đến hiệu suất
                        </p>
                      )}
          </div>
          <Button
                      onClick={generateSeatLayout}
                      className="w-full max-w-xs h-11"
                      disabled={loading || !selectedRoom}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Tạo Layout Ghế
          </Button>
        </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
  );
}
