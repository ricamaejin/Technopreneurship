import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import AddListing from "./pages/AddListing";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "../../Frontend Admin/app/pages/AdminDashboard";
import UsersPage from "../../Frontend Admin/app/pages/UsersPage";
import ListingsPage from "../../Frontend Admin/app/pages/ListingsPage";
import RequestsPage from "../../Frontend Admin/app/pages/RequestsPage";
import OverduePage from "../../Frontend Admin/app/pages/OverduePage";
import DisputesPage from "../../Frontend Admin/app/pages/DisputesPage";
import AnalyticsPage from "../../Frontend Admin/app/pages/AnalyticsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Faq from "./pages/Faq";
import Community from "./pages/Community";
import HowItWorks from "./pages/HowItWorks";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import Support from "./pages/Support";
import ContactUs from "./pages/ContactUs";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/account",
    Component: Account,
  },
  {
    path: "/faq",
    Component: Faq,
  },
  {
    path: "/community",
    Component: Community,
  },
  {
    path: "/how-it-works",
    Component: HowItWorks,
  },
  {
    path: "/safety-guidelines",
    Component: SafetyGuidelines,
  },
  {
    path: "/support",
    Component: Support,
  },
  {
    path: "/contact-us",
    Component: ContactUs,
  },
  {
    path: "/terms-of-service",
    Component: TermsOfService,
  },
  {
    path: "/privacy-policy",
    Component: PrivacyPolicy,
  },
  {
    path: "/item/:id",
    Component: ItemDetail,
  },
  {
    path: "/add-listing",
    Component: AddListing,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
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
  {
    path: "*",
    Component: NotFound,
  },
]);