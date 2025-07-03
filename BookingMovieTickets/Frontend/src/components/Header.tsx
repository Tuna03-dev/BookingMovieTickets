import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Ticket, User, Settings, LogOut, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "../store/slices/authSlice";
import authAPI from "@/services/auth/authAPI";
import { movieApis, type Movie } from "@/services/movieApis";

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    dispatch(logout());
    navigate("/");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setLoadingSearch(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await movieApis.getOdataMovies(`$top=30`);
        const filtered = (Array.isArray(data) ? data : []).filter((movie) =>
          movie.title?.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 8));
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
  };

  const handleSelectMovie = (movieId: string) => {
    setSearchTerm("");
    setShowDropdown(false);
    setSearchResults([]);
    navigate(`/movies/${movieId}`);
    if (inputRef.current) inputRef.current.blur();
  };

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      const isClickInsideInput = inputRef.current?.contains(target);
      const isClickInsideDropdown = dropdownRef.current?.contains(target);

      if (!isClickInsideInput && !isClickInsideDropdown) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showDropdown]);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            CinemaTickets
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="hover:text-red-500 transition-colors font-medium"
          >
            Trang chủ
          </Link>
          <Link
            to="/movies"
            className="hover:text-red-500 transition-colors font-medium"
          >
            Phim
          </Link>
          <Link
            to="/coming-soon"
            className="hover:text-red-500 transition-colors font-medium"
          >
            Sắp chiếu
          </Link>
          <Link
            to="/cinemas"
            className="hover:text-red-500 transition-colors font-medium"
          >
            Rạp phim
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block" style={{ minWidth: 250 }}>
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              ref={inputRef}
              placeholder="Tìm kiếm phim..."
              className="pl-10 bg-gray-900/50 border-gray-700 text-white w-[250px] focus-visible:ring-red-500 focus-visible:border-red-500"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  navigate(
                    `/movies?search=${encodeURIComponent(searchTerm.trim())}`
                  );
                  setShowDropdown(false);
                }
              }}
            />
            {/* Dropdown search results */}
            {showDropdown && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
              >
                {loadingSearch && (
                  <div className="p-4 text-gray-400 text-center">
                    Đang tìm kiếm...
                  </div>
                )}
                {!loadingSearch &&
                  searchResults.map((movie) => (
                    <div
                      key={movie.movieId}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleSelectMovie(movie.movieId || "")}
                    >
                      <img
                        src={movie.posterUrl || "/placeholder.svg"}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium text-white line-clamp-1">
                          {movie.title}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1">
                          {movie.genre}
                        </div>
                      </div>
                    </div>
                  ))}
                {!loadingSearch && searchResults.length === 0 && (
                  <div className="p-4 text-gray-400 text-center">
                    Không tìm thấy phim phù hợp
                  </div>
                )}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-950 hover:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user?.fullName || user?.email || "Tài khoản"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-gray-900 border-gray-800"
              >
                <DropdownMenuLabel className="text-gray-300">
                  Tài khoản của tôi
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                  <User className="mr-2 h-4 w-4" />
                  <Link to="/profile">Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                  <Ticket className="mr-2 h-4 w-4" />
                  <Link to="/bookings">Lịch sử đặt vé</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                  <Bell className="mr-2 h-4 w-4" />
                  <Link to="/notifications">Thông báo</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <Link to="/settings">Cài đặt</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-gray-300 hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-950"
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-red-600 hover:bg-red-700">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
