import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import RootLayout from "./Layouts/Root";
import Home from "./pages/Home";
import RegisterPage from "./pages/Register";
import ProtectedRoutes from "./Layouts/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <RegisterPage />,
  },
  {
    path: "/chat-app",
    element: (
      <ProtectedRoutes>
        <RootLayout />
        
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "home",
        element: <Home />,
        errorElement:<><div>404 not found</div></>
      },
    ],
  },
  {
    path: "*",
    element: <div>404 not found</div>,
  },
]);

export default router;
