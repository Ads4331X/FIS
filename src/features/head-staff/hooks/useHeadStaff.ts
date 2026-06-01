import { useEffect, useState } from "react";
import { fetchHeadStaff } from "../services/headStaffService";
import type { HeadStaffMember } from "../types/headStaff.types";

export function useHeadStaff() {
  const [staff, setStaff] = useState<HeadStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const list = await fetchHeadStaff();
        if (!active) return;
        setStaff(list);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Unable to load head staff.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { staff, loading, error };
}
