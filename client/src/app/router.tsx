import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import PublicLayout from "./layouts/PublicLayout.tsx";
import GuestGuard from "@/app/guards/GuestGuard.tsx";
import AuthGuard from "@/app/guards/AuthGuard.tsx";

import RouteErrorPage from "@/pages/RouteErrorPage.tsx";

import HomePage from "@/pages/HomePage.tsx";
import LoginPage from "@/features/auth/pages/LoginPage.tsx";
import RegisterPage from "@/features/auth/pages/RegisterPage.tsx";
import AccountPage from "@/features/auth/pages/AccountPage.tsx";

import SurveyListPage from "@/features/survey/pages/SurveyListPage.tsx";
import SurveyCreatePage from "@/features/survey/pages/SurveyCreatePage.tsx";
import SurveyEditorPage from "@/features/survey/pages/SurveyEditorPage.tsx";
import SurveyPublicPage from "@/features/survey/pages/SurveyPublicPage.tsx";
import SurveyResponsesPage from "@/features/survey/pages/SurveyResponsesPage.tsx";

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <RouteErrorPage />,
        children: [
            { index: true, element: <HomePage /> },

            {
                element: <GuestGuard />,
                children: [
                    { path: "login", element: <LoginPage /> },
                    { path: "register", element: <RegisterPage /> },
                ],
            },

            {
                element: <AuthGuard />,
                children: [
                    { path: "account", element: <AccountPage /> },
                    { path: "surveys/new", element: <SurveyCreatePage /> },
                    { path: "surveys", element: <SurveyListPage /> },
                    { path: "survey/:id/edit", element: <SurveyEditorPage /> },
                    { path: "survey/:id/responses", element: <SurveyResponsesPage /> },
                ],
            },
        ],
    },
    {
        element: <PublicLayout />,
        errorElement: <RouteErrorPage />,
        children: [
            { path: "s/:id", element: <SurveyPublicPage /> },
        ],
    },
]);


export default router