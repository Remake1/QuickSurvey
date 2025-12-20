import { isRouteErrorResponse, useRouteError } from "react-router";
import NotFoundPage from "@/pages/NotFoundPage";

export default function RouteErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) return <NotFoundPage />;
        if (error.status === 401) return <p>Unauthorized</p>;
    }

    return <p>Something went wrong.</p>;
}