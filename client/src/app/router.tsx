import {createBrowserRouter} from "react-router";
import RootLayout from "./layouts/RootLayout.tsx";
import GuestGuard from "@/app/guards/GuestGuard.tsx";
import AuthGuard from "@/app/guards/AuthGuard.tsx";

import RouteErrorPage from "@/pages/RouteErrorPage.tsx";

import HomePage from "@/pages/HomePage.tsx";
import LoginPage from "@/features/auth/pages/LoginPage.tsx";
import RegisterPage from "@/features/auth/pages/RegisterPage.tsx";

import SurveyListPage from "@/features/surveys/pages/SurveyListPage.tsx";
import SurveyEditorPage from "@/features/surveys/pages/SurveyEditorPage.tsx";
import SurveyPublicPage from "@/features/surveys/pages/SurveyPublicPage.tsx";
import AccountPage from "@/features/auth/pages/AccountPage.tsx";

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
                    { path: "surveys", element: <SurveyListPage /> },
                    { path: "surveys/:id/edit", element: <SurveyEditorPage /> },
                ],
            },

            { path: "s/:id", element: <SurveyPublicPage /> },
        ],
    },
]);


export default router