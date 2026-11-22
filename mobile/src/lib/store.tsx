import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchCars } from "./api";
import { fallbackCars } from "./fallbackCars";
import { dicts, type Dict, type Locale } from "./i18n";
import type { Car } from "./types";

const LANG_KEY = "brc.lang";
const CARS_KEY = "brc.cars";

type Store = {
  locale: Locale;
  t: Dict;
  setLocale: (l: Locale) => void;
  cars: Car[];
  loading: boolean;
  offline: boolean;
  refresh: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uz");
  const [cars, setCars] = useState<Car[]>(fallbackCars);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const fresh = await fetchCars();
      setCars(fresh);
      setOffline(false);
      AsyncStorage.setItem(CARS_KEY, JSON.stringify(fresh)).catch(() => {});
    } catch {
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [lang, cached] = await Promise.all([AsyncStorage.getItem(LANG_KEY), AsyncStorage.getItem(CARS_KEY)]);
        if (lang === "uz" || lang === "ru") setLocaleState(lang);
        if (cached) setCars(JSON.parse(cached));
      } catch {}
      refresh();
    })();
  }, [refresh]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    AsyncStorage.setItem(LANG_KEY, l).catch(() => {});
  }, []);

  const value = useMemo(() => ({ locale, t: dicts[locale], setLocale, cars, loading, offline, refresh }), [locale, setLocale, cars, loading, offline, refresh]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("StoreProvider missing");
  return s;
}
