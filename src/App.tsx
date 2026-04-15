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
import TransactionHistory from "./pages/Transaction/TransactionHistory";
import Milestones from "./pages/MileStone/MileStone";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import NotFound from "./pages/NotFound/NotFound";
import RecaptchaLoader from "./utils/recaptchaLoader";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCompleteProfileModal, getProfile } from "./features/profileSlice";
import type { AppDispatch, RootState } from "./app/store";
import ProfileBlockedModal from "./components/common/ProfileBlockModal";
import { openProfileBlockedModal } from "./features/uiSlice";
import CompleteProfileModal from "./components/common/CompleteProfileModal";

const getToken = () => localStorage.getItem("t");

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!getToken()) {
    return <Navigate to={route.LOGIN} replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (getToken()) {
    return <Navigate to="/affiliate/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isProfileBlocked } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (isProfileBlocked) {
      dispatch(openProfileBlockedModal());
    }
  }, [isProfileBlocked, dispatch]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Navigate
          to={getToken() ? "/affiliate/dashboard" : route.LOGIN}
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
        // {
        //   path: route.SETTINGS,
        //   element: <Settings />,
        // },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
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
        }}
      />
      <RouterProvider router={router} />
      <RecaptchaLoader />
      {/* <ProfileBlockedModal
        isOpen={isProfileBlockedModalOpen}
        reason={blockedNote}
      />
      <CompleteProfileModal
        isOpen={completeProfileModalOpen ?? false}
        onClose={() => dispatch(closeCompleteProfileModal())}
      /> */}
    </>
  );
}

export default App;
