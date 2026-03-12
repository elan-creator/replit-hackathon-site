'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

interface Cohort {
  id: number;
  event_date: string;
  company: string | null;
  is_active: boolean;
}

interface CohortContextType {
  cohorts: Cohort[];
  selectedCohortId: number | null;
  setSelectedCohortId: (id: number | null) => void;
  refreshCohorts: () => Promise<Cohort[]>;
  isLoading: boolean;
}

const CohortContext = createContext<CohortContextType>({
  cohorts: [],
  selectedCohortId: null,
  setSelectedCohortId: () => {},
  refreshCohorts: async () => [],
  isLoading: true,
});

export function useCohort() {
  return useContext(CohortContext);
}

function findDefaultCohort(cohorts: Cohort[]): Cohort | null {
  if (cohorts.length === 0) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const future = cohorts
    .filter(c => new Date(c.event_date) >= today)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  if (future.length > 0) return future[0];

  const past = cohorts
    .filter(c => new Date(c.event_date) < today)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  return past.length > 0 ? past[0] : cohorts[0];
}

export function CohortProvider({ children }: { children: ReactNode }) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  const refreshCohorts = useCallback(async (): Promise<Cohort[]> => {
    try {
      const res = await fetch('/api/cohorts');
      if (res.ok) {
        const data: Cohort[] = await res.json();
        setCohorts(data);
        return data;
      }
    } catch {
      // silently fail (e.g., on login page before auth)
    }
    return [];
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    refreshCohorts().then(data => {
      if (data.length > 0) {
        const def = findDefaultCohort(data);
        if (def) setSelectedCohortId(def.id);
      }
      setIsLoading(false);
    });
  }, [refreshCohorts]);

  return (
    <CohortContext.Provider value={{ cohorts, selectedCohortId, setSelectedCohortId, refreshCohorts, isLoading }}>
      {children}
    </CohortContext.Provider>
  );
}
