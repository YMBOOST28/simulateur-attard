import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import Order from "./pages/Order";
import Brochure from "./pages/Brochure";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/rendez-vous",
    Component: Appointment,
  },
  {
    path: "/commander",
    Component: Order,
  },
  {
    path: "/brochure",
    Component: Brochure,
  },
]);
