"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseIntersectionObserverOptions {
  /** Margin around the root. Default: "0px" */
  rootMargin?: string;
  /** Visibility ratio to trigger. Default: 0.1 (10%) */
  threshold?: number | number[];
  /** Only trigger once, then stop observing. Default: true */
  triggerOnce?: boolean;
}

/**
 * Scroll animation hook using IntersectionObserver.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 *
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
 * return <div ref={ref} className={isIntersecting ? "opacity-100" : "opacity-0"}>...</div>;
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): { ref: RefObject<T | null>; isIntersecting: boolean } {
  const { rootMargin = "0px", threshold = 0.1, triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) observer.unobserve(el);
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return { ref, isIntersecting };
}
