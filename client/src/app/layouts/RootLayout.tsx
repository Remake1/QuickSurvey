import {Outlet} from "react-router";
import Header from "@/shared/components/Header.tsx";

export default function RootLayout() {

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}