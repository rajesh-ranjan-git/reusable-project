import { RefObject, useEffect, useRef } from "react";
import { UseOutsideClickProps } from "@/types/props/hooks.props.types";

export const useOutsideClick = ({
  ref,
  when,
  callback,
  eventType = "click",
  defer = false,
}: UseOutsideClickProps) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    if (!when) return;

    const refs = (Array.isArray(ref) ? ref : [ref]).filter(
      (r): r is RefObject<HTMLElement | null> => !!r,
    );

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInside = refs.some((r) => {
        const el = r.current;
        return el && el.contains(target);
      });

      if (!clickedInside) {
        savedCallback.current();
      }
    };

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const addListener = () => {
      document.addEventListener(eventType, handleOutsideClick);
    };

    if (defer) {
      timeoutId = setTimeout(addListener, 0);
    } else {
      addListener();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener(eventType, handleOutsideClick);
    };
  }, [defer, eventType, ref, when]);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
};
