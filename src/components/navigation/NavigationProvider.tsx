"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { RouteProgressBar } from "./RouteProgressBar";

type NavigationContextValue = {
  isNavigating: boolean;
};

const NavigationContext = createContext<NavigationContextValue>({
  isNavigating: false,
});

export function useNavigation() {
  return useContext(NavigationContext);
}

function isInternalNavigation(href: string, pathname: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:")) return false;
  if (href.startsWith("http") && !href.startsWith(window.location.origin)) {
    return false;
  }
  const path = href.startsWith("http")
    ? new URL(href).pathname
    : href.split("?")[0] ?? href;
  return path !== pathname;
}

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const completeNavigation = useCallback(() => {
    setIsNavigating(false);
  }, []);

  useEffect(() => {
    completeNavigation();
  }, [pathname, completeNavigation]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalNavigation(href, pathname)) return;

      setIsNavigating(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isNavigating }}>
      <RouteProgressBar active={isNavigating} />
      {children}
    </NavigationContext.Provider>
  );
}
