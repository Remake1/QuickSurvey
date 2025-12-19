import { useAuthStore } from "@/features/auth/store/auth.store.ts";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "@/features/auth/api/auth.api.ts";
import { useEffect } from "react";

export function useMeQuery() {
    return useQuery({
        queryKey: ["me"],
        queryFn: fetchMe,
        retry: false,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}

export function useMe() {
    const setUser = useAuthStore(s => s.setUser);
    const query = useMeQuery();

    useEffect(() => {
        // undefined = not fetched yet
        if (query.data !== undefined) {
            setUser(query.data);
        }
    }, [query.data, setUser]);

    return query;
}