import type { RouteObject } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import HomeLayout from "../layouts/HomeLayout";
import { lazy } from "react";

import { ProtectedRoute, AdminRoute } from "@/components/auth/guards";

// const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const Movies = lazy(() => import("../pages/admin/Movie"));
const Cinemas = lazy(() => import("../pages/admin/Cinema"));
const Showtimes = lazy(() => import("../pages/admin/ShowtimeCalendarPage"));
const Bookings = lazy(() => import("../pages/admin/Booking"));
const Users = lazy(() => import("../pages/admin/User"));
const Rooms = lazy(() => import("../pages/admin/Room"));
const Seats = lazy(() => import("../pages/admin/Seat"));
const TimeSlots = lazy(() => import("../pages/admin/TimeSlot"));
// const Payments = lazy(() => import('@/pages/admin/Payments'))
// const Notifications = lazy(() => import('@/pages/admin/Notifications'))
// const Settings = lazy(() => import('@/pages/admin/Settings'))
const Login = lazy(() => import("../pages/login/index"));
const Register = lazy(() => import("../pages/register/index"));
const HomePage = lazy(() => import("../pages/HomePage"));
const MoviePage = lazy(() => import("../pages/movies/MoviePage"));
const ComingSoonPage = lazy(() => import("../pages/movies/ComingSoon"));
const CinemaPage = lazy(() => import("../pages/cinemas/CinemaPage"));
const MovieDetail = lazy(() => import("../pages/movies/MovieDetail"));
const BookingSeatPage = lazy(() => import("../pages/movies/BookingSeatPage"));
const Checkout = lazy(() => import("../pages/movies/CheckoutPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const EditProfilePage = lazy(() => import("../pages/profile/EditProfile"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "movies",
        element: <MoviePage />,
      },
      {
        path: "coming-soon",
        element: <ComingSoonPage />,
      },
      {
        path: "cinemas",
        element: <CinemaPage />,
      },
      {
        path: "movies/:id",
        element: <MovieDetail />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "movies/:id/seats",
        element: <BookingSeatPage />,
      },
      {
        path: "movies/:id/checkout",
        element: <Checkout />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "profile/edit",
        element: <EditProfilePage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "cinemas", element: <Cinemas /> },
          { path: "movies", element: <Movies /> },
          { path: "showtimes", element: <Showtimes /> },
          { path: "bookings", element: <Bookings /> },
          { path: "users", element: <Users /> },
          { path: "rooms", element: <Rooms /> },
          { path: "seats", element: <Seats /> },
          { path: "timeslots", element: <TimeSlots /> },
          // { path: "payments", element: <Payments /> },
          // { path: "notifications", element: <Notifications /> },
          // { path: "settings", element: <Settings /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

export default routes;
