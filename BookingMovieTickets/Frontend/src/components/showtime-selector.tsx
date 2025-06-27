import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ShowtimeSelectorProps {
  movieId: string;
}

export function ShowtimeSelector({ movieId }: ShowtimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedCinema, setSelectedCinema] = useState("cinema1");
  const [selectedTime, setSelectedTime] = useState("");

  const dates = [
    { id: "today", label: "Hôm nay", date: "21 Thg 5" },
    { id: "tomorrow", label: "Ngày mai", date: "22 Thg 5" },
    { id: "day3", label: "Thứ Tư", date: "23 Thg 5" },
    { id: "day4", label: "Thứ Năm", date: "24 Thg 5" },
    { id: "day5", label: "Thứ Sáu", date: "25 Thg 5" },
    { id: "day6", label: "Thứ Bảy", date: "26 Thg 5" },
    { id: "day7", label: "Chủ Nhật", date: "27 Thg 5" },
  ];

  // Sample cinema data
  const cinemas = [
    {
      id: "cinema1",
      name: "CineWorld Trung tâm",
      times: ["10:30", "13:15", "16:00", "19:30", "22:15"],
      prices: [100000, 100000, 120000, 140000, 120000],
    },
    {
      id: "cinema2",
      name: "MoviePlex Trung tâm",
      times: ["11:00", "14:30", "17:45", "20:30"],
      prices: [90000, 110000, 130000, 150000],
    },
    {
      id: "cinema3",
      name: "Star Cinemas",
      times: ["12:15", "15:30", "18:45", "21:30"],
      prices: [110000, 110000, 130000, 130000],
    },
  ];

  return (
    <div>
      {/* Chọn ngày */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Chọn ngày</h3>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {dates.map((date) => (
            <Button
              key={date.id}
              variant={selectedDate === date.id ? "default" : "secondary"}
              className={`flex flex-col h-auto py-3 ${
                selectedDate === date.id ? "bg-red-600 hover:bg-red-700" : ""
              }`}
              onClick={() => setSelectedDate(date.id)}
            >
              <span className="text-sm font-normal">{date.label}</span>
              <span className="text-xs opacity-80">{date.date}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Chọn rạp */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Chọn rạp</h3>
        <Tabs
          value={selectedCinema}
          onValueChange={setSelectedCinema}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3">
            {cinemas.map((cinema) => (
              <TabsTrigger
                key={cinema.id}
                value={cinema.id}
                className="data-[state=active]:bg-red-600"
              >
                {cinema.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {cinemas.map((cinema) => (
            <TabsContent key={cinema.id} value={cinema.id} className="mt-4">
              <Card className="border-gray-800 bg-gray-800/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-white">
                    <Calendar className="h-4 w-4" />
                    Suất chiếu cho{" "}
                    {dates.find((d) => d.id === selectedDate)?.date}
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {cinema.times.map((time, index) => (
                      <Button
                        key={time}
                        variant={
                          selectedTime === `${cinema.id}-${time}`
                            ? "default"
                            : "outline"
                        }
                        className={`flex flex-col h-auto py-2 ${
                          selectedTime === `${cinema.id}-${time}`
                            ? "bg-red-600 hover:bg-red-700"
                            : ""
                        }`}
                        onClick={() => setSelectedTime(`${cinema.id}-${time}`)}
                      >
                        <span className="text-sm font-medium">{time}</span>
                        <span className="text-xs opacity-80">
                          {cinema.prices[index].toLocaleString()}₫
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Nút tiếp tục */}
      <div className="flex justify-end">
        <Link to={selectedTime ? `/movies/${movieId}/seats` : "#"}>
          <Button
            className="bg-red-600 hover:bg-red-700 px-8"
            disabled={!selectedTime}
          >
            Tiếp tục
          </Button>
        </Link>
      </div>
    </div>
  );
}
