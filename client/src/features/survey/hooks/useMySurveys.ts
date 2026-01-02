import {useQuery} from "@tanstack/react-query";
import {fetchMySurveys} from "@/features/survey/api/surveys.api.ts";

export function useMySurveys() {
    return useQuery({
        queryKey: ["my-surveys"],
        queryFn: fetchMySurveys,
        staleTime: 30_000, // reasonable for lists
    });
}
