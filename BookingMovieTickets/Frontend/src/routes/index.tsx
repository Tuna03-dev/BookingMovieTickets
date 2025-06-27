import type { RouteObject } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import HomeLayout from "../layouts/HomeLayout";
import { lazy } from "react";

// const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
// const Movies = lazy(() => import('@/pages/admin/Movies'))
const Cinemas = lazy(() => import("../pages/admin/Cinema"));
// const Showtimes = lazy(() => import('@/pages/admin/Showtimes'))
// const Bookings = lazy(() => import('@/pages/admin/Bookings'))
// const Users = lazy(() => import('@/pages/admin/Users'))
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
    path: "/admin",
    element: <AdminLayout />,
    children: [
      // { index: true, element: <Dashboard /> },
      // { path: 'movies', element: <Movies /> },
      { path: "cinemas", element: <Cinemas /> },
      // { path: 'showtimes', element: <Showtimes /> },
      // { path: 'bookings', element: <Bookings /> },
      // { path: 'users', element: <Users /> },
      // { path: 'payments', element: <Payments /> },
      // { path: 'notifications', element: <Notifications /> },
      // { path: 'settings', element: <Settings /> },
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
