// import "./App.css";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import MainDashboard from "./pages/Main-Dashboard/MainDashboard";
// import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";
// import { route } from "./routes/AppRoutes";
// import Profile from "./pages/Profile/Profile";
// import Settings from "./pages/Settings/Settings";
// import TransactionHistory from "./pages/Transaction/TransactionHistory";
// import Milestones from "./pages/MileStone/MileStone";
// import VerifyEmail from "./pages/Auth/VerifyEmail";
// import ForgotPassword from "./pages/Auth/ForgotPassword";
// import ResetPassword from "./pages/Auth/ResetPassword";

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: route.LOGIN,
//       element: <Login />,
//     },
//     {
//       path: route.REGISTER,
//       element: <Register />,
//     },
//     {
//       path: route.VERIFY,
//       element: <VerifyEmail />,
//     },
//     {
//       path: route.FORGOT_PASSWORD,
//       element: <ForgotPassword />,
//     },
//     {
//       path: route.RESET_PASSWORD,
//       element: <ResetPassword />,
//     },
//     {
//       path: route.AFFILIATE,
//       element: <MainDashboard />,
//       children: [
//         {
//           path: route.DASHBOARD,
//           element: <Dashboard />,
//         },
//         {
//           path: route.PROFILE,
//           element: <Profile />,
//         },
//         {
//           path: route.TRANSACTION,
//           element: <TransactionHistory />,
//         },
//         {
//           path: route.MILESTONES,
//           element: <Milestones />,
//         },
//         {
//           path: route.SETTINGS,
//           element: <Settings />,
//         },
//       ],
//     },
//   ]);
//   return (
//     <>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             background: "#09090b", // zinc-950
//             color: "#fafafa", // white
//             border: "1px solid #27272a", // zinc-800
//             borderRadius: "12px",
//             padding: "12px 16px",
//           },

//           success: {
//             style: {
//               background: "linear-gradient(to right, #09090b, #18181b)", // subtle gradient
//             },
//             iconTheme: {
//               primary: "#22c55e", // green-500 (success)
//               secondary: "#09090b",
//             },
//           },

//           error: {
//             style: {
//               background: "linear-gradient(to right, #09090b, #18181b)",
//             },
//             iconTheme: {
//               primary: "#ef4444", // red-500
//               secondary: "#09090b",
//             },
//           },
//         }}
//       />
//       <RouterProvider router={router} />
//     </>
//   );
// }

// export default App;

import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainDashboard from "./pages/Main-Dashboard/MainDashboard";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { route } from "./routes/AppRoutes";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import TransactionHistory from "./pages/Transaction/TransactionHistory";
import Milestones from "./pages/MileStone/MileStone";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// --- AUTH LOGIC HELPERS ---

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("t");
  if (!token) {
    return <Navigate to={route.LOGIN} replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("t");
  if (token) {
    return <Navigate to={"/affiliate/dashboard"} replace />;
  }
  return <>{children}</>;
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Navigate
          to={
            localStorage.getItem("token") ? "/affiliate/dashboard" : route.LOGIN
          }
          replace
        />
      ),
    },

    {
      path: route.LOGIN,
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: route.REGISTER,
      element: (
        <PublicRoute>
          <Register />
        </PublicRoute>
      ),
    },
    {
      path: route.FORGOT_PASSWORD,
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      path: route.RESET_PASSWORD,
      element: (
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      ),
    },
    {
      path: route.VERIFY,
      element: <VerifyEmail />,
    },

    {
      path: route.AFFILIATE,
      element: (
        <ProtectedRoute>
          <MainDashboard />
        </ProtectedRoute>
      ),
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

    // 404 handler (Optional)
    {
      path: "*",
      element: (
        <Navigate
          to={localStorage.getItem("token") ? route.DASHBOARD : route.LOGIN}
          replace
        />
      ),
    },
  ]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#09090b",
            color: "#fafafa",
            border: "1px solid #27272a",
            borderRadius: "12px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "linear-gradient(to right, #09090b, #18181b)",
            },
            iconTheme: { primary: "#22c55e", secondary: "#09090b" },
          },
          error: {
            style: {
              background: "linear-gradient(to right, #09090b, #18181b)",
            },
            iconTheme: { primary: "#ef4444", secondary: "#09090b" },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
