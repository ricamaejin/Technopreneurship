import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import ItemDetail from "./pages/ItemDetail";
import AddListing from "./pages/AddListing";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
    path: "*",
    Component: NotFound,
  },
]);