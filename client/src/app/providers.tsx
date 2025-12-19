import {useMe} from "@/features/auth/hooks/useMe.ts";
import type {PropsWithChildren} from "react";
import FullPageSpinner from "@/shared/components/FullPageSpinner.tsx";

export function AppProviders({ children }: PropsWithChildren) {
    const { isLoading } = useMe();

    if (isLoading) {
        return <FullPageSpinner />;
    }

    return <>{children}</>;
}
