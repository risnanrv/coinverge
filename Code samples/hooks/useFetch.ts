import { useEffect, useRef, useState } from "react";

export function useFetch<T>(url: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    async function run() {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as T;
        setData(json);
        setError(null);
      } catch (e: unknown) {
        if (e instanceof Error) {
          if (e.name !== "AbortError") setError(e.message ?? "Error");
        } else {
          setError("Error");
        }
      } finally {
        setLoading(false);
      }
    }
    run();

    return () => ctrl.abort();
  
  }, [url, ...deps]);

  return { data, loading, error };
}
