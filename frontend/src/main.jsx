import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import "./index.css";
import App from "./App.jsx";

// ✅ Public Pages
import Home from "./pages/Home.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/authComponent/ProtectedRoute.jsx";
import Stations from "./components/stations/Stations.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,   // ✅ MAIN LAYOUT
    children: [
      // ✅ PUBLIC ROUTES
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "home",
        element: <Home />,
      },
     
      {
        path: "stations",
        element: (
          <ProtectedRoute>
            <Stations />
          </ProtectedRoute>
        )
      }
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
