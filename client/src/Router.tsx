import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import RootLayout from "./Layouts/Root";
import Home from "./pages/Home";
import RegisterPage from "./pages/Register";
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
    element: <RootLayout />,
    children: [{ path: "home", element: <Home /> }],
  },
]);

export default router;
