import { Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Film,
  MapPin,
  Ticket,
  Users,
  Settings,
  LogOut,
  Menu,
  Armchair,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Cinemas", href: "/admin/cinemas", icon: MapPin },
  { name: "Rooms", href: "/admin/rooms", icon: Calendar },
  { name: "Seats", href: "/admin/seats", icon: Armchair },
  { name: "Movies", href: "/admin/movies", icon: Film },
  { name: "Showtimes", href: "/admin/showtimes", icon: Calendar },
  { name: "Bookings", href: "/admin/bookings", icon: Ticket },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Time Slots", href: "/admin/timeslots", icon: Calendar },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6">
        <Link to="/admin" className="flex items-center gap-2">
          <Film className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold">Cinema Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-gray-800 text-white" 
                  : "hover:bg-gray-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="flex h-screen max-h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar cố định */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Sidebar mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
