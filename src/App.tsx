import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainDashboard from "./pages/Main-Dashboard/MainDashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { route } from "./routes/AppRoutes";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import TransactionHistory from "./pages/Transaction/TransactionHistory";
import Milestones from "./pages/MileStone/MileStone";

function App() {
  const router = createBrowserRouter([
    {
      path: route.LOGIN,
      element: <Login />,
    },
    {
      path: route.REGISTER,
      element: <Register />,
    },
    {
      path: route.AFFILIATE,
      element: <MainDashboard />,
      children: [
        {
          path: route.DASHBOARD,
          element: <Dashboard />,
        },
        {
          path: route.PROFILE,
          element: <Profile />,
        },
        {
          path: route.TRANSACTION,
          element: <TransactionHistory />,
        },
        {
          path: route.MILESTONES,
          element: <Milestones />,
        },
        {
          path: route.SETTINGS,
          element: <Settings />,
        },
      ],
    },
  ]);
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#09090b", // zinc-950
            color: "#fafafa", // white
            border: "1px solid #27272a", // zinc-800
            borderRadius: "12px",
            padding: "12px 16px",
          },

          success: {
            style: {
              background: "linear-gradient(to right, #09090b, #18181b)", // subtle gradient
            },
            iconTheme: {
              primary: "#22c55e", // green-500 (success)
              secondary: "#09090b",
            },
          },

          error: {
            style: {
              background: "linear-gradient(to right, #09090b, #18181b)",
            },
            iconTheme: {
              primary: "#ef4444", // red-500
              secondary: "#09090b",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
