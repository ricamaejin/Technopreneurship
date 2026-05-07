import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import ListingsPage from "./pages/ListingsPage";
import RequestsPage from "./pages/RequestsPage";
import OverduePage from "./pages/OverduePage";
import DisputesPage from "./pages/DisputesPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export const adminRouter = createBrowserRouter([
  {
    path: "/",
    Component: () => <Navigate to="/admin" replace />,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/users",
    Component: UsersPage,
  },
  {
    path: "/admin/listings",
    Component: ListingsPage,
  },
  {
    path: "/admin/requests",
    Component: RequestsPage,
  },
  {
    path: "/admin/overdue",
    Component: OverduePage,
  },
  {
    path: "/admin/disputes",
    Component: DisputesPage,
  },
  {
    path: "/admin/analytics",
    Component: AnalyticsPage,
  },
]);
