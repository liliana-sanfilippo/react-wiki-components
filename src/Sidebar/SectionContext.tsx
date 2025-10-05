import { createContext, useContext } from "react";

interface SectionContextType {
    sectionId: string;
    sectionTitle: string;
}

export const SectionContext = createContext<SectionContextType | null>(null);

export function useSection() {
    const context = useContext(SectionContext);
    if (!context) {
        throw new Error("useSection must be used within a Section");
    }
    return context;
}
