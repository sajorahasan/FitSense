import { useQuery } from "convex/react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { api } from "~/backend/_generated/api";

const OnboardingContext = createContext<any>(undefined);

export function useOnboardingUser() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboardingUser must be used within OnboardingProvider");
  }
  return context; // This can be null while loading, which is fine
}

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const user = useQuery(api.users.getCurrentUser);

  return (
    <OnboardingContext.Provider value={user ?? null}>
      {children}
    </OnboardingContext.Provider>
  );
}
