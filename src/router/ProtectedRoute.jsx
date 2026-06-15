import { Navigate } from "react-router-dom";
import { checkAuthToken } from "@/services/cookies";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = checkAuthToken();


    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
