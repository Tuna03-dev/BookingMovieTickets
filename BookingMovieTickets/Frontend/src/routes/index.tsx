import type { RouteObject } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
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

const routes: RouteObject[] = [
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
];

export default routes;
