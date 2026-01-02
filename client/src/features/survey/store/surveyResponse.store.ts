import { create } from "zustand";
import { persist } from "zustand/middleware";

type SurveyData = Record<string, any>;

interface SurveyResponseState {
    responses: Record<string, SurveyData>;
    saveResponse: (surveyId: string, data: SurveyData) => void;
    clearResponse: (surveyId: string) => void;
    getResponse: (surveyId: string) => SurveyData;
}

export const useSurveyResponseStore = create<SurveyResponseState>()(
    persist(
        (set, get) => ({
            responses: {},
            saveResponse: (surveyId, data) =>
                set((state) => ({
                    responses: {
                        ...state.responses,
                        [surveyId]: data,
                    },
                })),
            clearResponse: (surveyId) =>
                set((state) => {
                    const newResponses = { ...state.responses };
                    delete newResponses[surveyId];
                    return { responses: newResponses };
                }),
            getResponse: (surveyId) => get().responses[surveyId] || {},
        }),
        {
            name: "survey-responses-storage",
        }
    )
);
