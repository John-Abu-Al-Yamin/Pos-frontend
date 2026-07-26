import { Navigate } from "react-router-dom";
import { checkAuthToken } from "@/services/cookies";
import { getStoredUser } from "@/services/authUser";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import useGetData from "@/hooks/curdsHook/useGetData";
import endPoints from "@/hooks/EndPoints/endPoints";
import queryKeys from "@/hooks/EndPoints/queryKeys";
import React from "react";

const ProtectedRoute = ({ children, requiredRole }) => {
    const isAuthenticated = checkAuthToken();
    const user = getStoredUser();
    const shouldResolveUser = isAuthenticated && !!requiredRole && !user;
    const { data, isPending, isError, error } = useGetData({
        url: endPoints.me,
        queryKeys: [queryKeys.me],
        params: {},
        enabled: shouldResolveUser,
    });

    const resolvedUser = user || data?.data?.data;

    React.useEffect(() => {
        if (!user && resolvedUser) {
            localStorage.setItem("user", JSON.stringify(resolvedUser));
        }
    }, [user, resolvedUser]);


    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (requiredRole && shouldResolveUser && isPending) {
        return null;
    }

    if (requiredRole && isError && error?.response?.status === 401) {
        return <Navigate to="/auth/login" replace />;
    }

    if (requiredRole && resolvedUser?.role !== requiredRole) {
        return (
            <ErrorPage
                errorCode="403"
                title="Permission denied"
                message="You do not have permission to access this page."
            />
        );
    }

    return children;
};

export default ProtectedRoute;
