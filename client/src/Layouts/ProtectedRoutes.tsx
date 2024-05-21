import useAuthStore from "@/Zustand/useAuth";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const { isAuthenticated, checkAuthStatus, isLoading } = useAuthStore(
    (state) => ({
      isAuthenticated: state.isAuthenticated,
      checkAuthStatus: state.checkAuthStatus,
      isLoading: state.isLoading,
    })
  );
  useEffect(() => {
    async function auth() {
      await checkAuthStatus();
    }
    auth();
  }, [checkAuthStatus]);

  if (isLoading) {
    return <div>Loading......</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoutes;
