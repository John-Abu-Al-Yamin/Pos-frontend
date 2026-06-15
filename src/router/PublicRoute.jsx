import { Navigate } from "react-router-dom";
import { checkAuthToken } from "@/services/cookies";

const PublicRoute = ({ children }) => {
    const isAuthenticated = checkAuthToken();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
