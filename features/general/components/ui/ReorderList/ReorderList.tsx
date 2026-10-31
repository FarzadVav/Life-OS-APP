"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Reorder, useDragControls, type DragControls } from "motion/react";
import { cn } from "cn";
import type { ReorderEntity } from "@/app/api/reorder/route";

/* -------------------------------------------------------------------------- */
/*                               Context & Types                              */
/* -------------------------------------------------------------------------- */

type ReorderItemContextType = {
  dragControls: DragControls;
};

const ReorderItemContext = createContext<ReorderItemContextType | null>(null);

/**
 * Hook to access dragControls within a ReorderList item if building a custom handle.
 */
export function useReorderHandle() {
  return useContext(ReorderItemContext);
}

/**
 * Optional dedicated drag handle component.
 * If placed anywhere inside `renderItem`, touching or dragging this handle
 * initiates drag immediately with 0ms delay even on touch devices.
 */
export interface ReorderHandleProps extends HTMLAttributes<HTMLDivElement> {}

export const ReorderHandle = forwardRef<HTMLDivElement, ReorderHandleProps>(
  ({ className, onPointerDown, ...props }, ref) => {
    const ctx = useContext(ReorderItemContext);

    return (
      <div
        ref={ref}
        data-reorder-handle="true"
        style={{ touchAction: "none" }}
        className={cn(
          "cursor-grab active:cursor-grabbing select-none touch-none",
          className
        )}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          if (e.isDefaultPrevented()) return;
          if (ctx) {
            e.stopPropagation();
            ctx.dragControls.start(e);
          }
        }}
        {...props}
      />
    );
  }
);
ReorderHandle.displayName = "ReorderHandle";

export type ReorderListProps<T extends { id: number }> = {
  /** Server-ordered (and optionally filtered) items for this list */
  items: T[];
  entity: ReorderEntity;
  renderItem: (item: T) => ReactNode;
  /** SWR mutate, used to snap back to server order when persisting fails */
  revalidate?: () => void;
  className?: string;
  /**
   * Hold delay in milliseconds before touch drag begins (prevents conflict with page scroll).
   * Defaults to 220ms. If user moves finger before this, native page scrolling occurs.
   * Desktop mouse drag is always 0ms.
   */
  holdDelayMs?: number;
  /** Viewport boundary zone in px for fast auto-scrolling (defaults to 100) */
  autoScrollThreshold?: number;
  /** Maximum auto-scroll speed in px per frame (defaults to 24) */
  autoScrollMaxSpeed?: number;
};

/* -------------------------------------------------------------------------- */
/*                             Helper Functions                               */
/* -------------------------------------------------------------------------- */

function isInteractiveControl(el: HTMLElement | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable ||
    Boolean(
      el.closest(
        "input, textarea, select, [contenteditable='true'], [data-no-drag]"
      )
    )
  );
}

function findScrollableParent(
  element: HTMLElement | null
): HTMLElement | Window {
  if (typeof window === "undefined") return null as unknown as Window;
  let current = element?.parentElement;
  while (
    current &&
    current !== document.body &&
    current !== document.documentElement
  ) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return window;
}

/* -------------------------------------------------------------------------- */
/*                           Fast Boundary Auto-Scroll                        */
/* -------------------------------------------------------------------------- */

function useAutoScroll({
  threshold = 100,
  maxSpeed = 24,
}: {
  threshold?: number;
  maxSpeed?: number;
} = {}) {
  const isScrollingRef = useRef(false);
  const pointerYRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | Window | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const stopAutoScroll = useCallback(() => {
    isScrollingRef.current = false;
    pointerYRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(
    (groupEl: HTMLElement | null) => {
      stopAutoScroll();
      containerRef.current = findScrollableParent(groupEl);
      isScrollingRef.current = true;

      const loop = () => {
        if (!isScrollingRef.current) {
          rafIdRef.current = null;
          return;
        }

        const container = containerRef.current;
        const y = pointerYRef.current;

        if (!container || y === null) {
          rafIdRef.current = requestAnimationFrame(loop);
          return;
        }

        const isWin = container === window;
        let topBound = 0;
        let bottomBound = window.innerHeight;

        if (!isWin && (container as HTMLElement).getBoundingClientRect) {
          const rect = (container as HTMLElement).getBoundingClientRect();
          topBound = rect.top;
          bottomBound = rect.bottom;
        }

        const distFromTop = y - topBound;
        const distFromBottom = bottomBound - y;

        let speed = 0;

        // Top boundary: accelerate smoothly as user gets closer to edge
        if (distFromTop < threshold && distFromTop >= -60) {
          const intensity = Math.min(
            Math.max((threshold - distFromTop) / threshold, 0),
            1.5
          );
          speed = -Math.round(
            maxSpeed * (intensity * 0.35 + intensity * intensity * 0.65)
          );
        }
        // Bottom boundary: accelerate smoothly as user gets closer to edge
        else if (distFromBottom < threshold && distFromBottom >= -60) {
          const intensity = Math.min(
            Math.max((threshold - distFromBottom) / threshold, 0),
            1.5
          );
          speed = Math.round(
            maxSpeed * (intensity * 0.35 + intensity * intensity * 0.65)
          );
        }

        if (speed !== 0) {
          if (isWin) {
            window.scrollBy({ top: speed, behavior: "instant" as ScrollBehavior });
          } else {
            (container as HTMLElement).scrollTop += speed;
          }
        }

        rafIdRef.current = requestAnimationFrame(loop);
      };

      rafIdRef.current = requestAnimationFrame(loop);
    },
    [maxSpeed, stopAutoScroll, threshold]
  );

  const updatePointer = useCallback((y: number) => {
    pointerYRef.current = y;
  }, []);

  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, [stopAutoScroll]);

  return { startAutoScroll, stopAutoScroll, updatePointer };
}

/* -------------------------------------------------------------------------- */
/*                              Reorder List Item                             */
/* -------------------------------------------------------------------------- */

type ReorderListItemProps<T extends { id: number }> = {
  item: T;
  renderItem: (item: T) => ReactNode;
  isDraggingAnyRef: React.RefObject<boolean>;
  holdDelayMs: number;
  onDragStart: (item: T) => void;
  onDragEnd: (item: T) => void;
  updatePointer: (y: number) => void;
};

function ReorderListItem<T extends { id: number }>({
  item,
  renderItem,
  isDraggingAnyRef,
  holdDelayMs,
  onDragStart,
  onDragEnd,
  updatePointer,
}: ReorderListItemProps<T>) {
  const controls = useDragControls();
  const itemRef = useRef<HTMLDivElement>(null);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const savedPointerEventRef = useRef<PointerEvent | null>(null);
  const touchPreventCleanupRef = useRef<(() => void) | null>(null);
  const holdListenersCleanupRef = useRef<(() => void) | null>(null);

  const [isHeld, setIsHeld] = useState(false);

  // Clean up any active touch-prevention listener
  const cleanupTouchPrevent = useCallback(() => {
    if (touchPreventCleanupRef.current) {
      touchPreventCleanupRef.current();
      touchPreventCleanupRef.current = null;
    }
  }, []);

  // Clean up temporary listeners used while waiting for the hold threshold
  const clearHoldListeners = useCallback(() => {
    if (holdListenersCleanupRef.current) {
      holdListenersCleanupRef.current();
      holdListenersCleanupRef.current = null;
    }
  }, []);

  // Cancel hold timer and reset state
  const clearHold = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    clearHoldListeners();
    startPosRef.current = null;
    savedPointerEventRef.current = null;
    setIsHeld(false);
  }, [clearHoldListeners]);

  // Clean up all timers and listeners on unmount
  useEffect(() => {
    return () => {
      clearHold();
      cleanupTouchPrevent();
    };
  }, [clearHold, cleanupTouchPrevent]);

  // Native capture listener on the DOM element:
  // Guarantees that any click event following a drag is stopped before
  // any child elements (CardView, Drawer trigger, buttons, links) receive it.
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const handleNativeClick = (e: MouseEvent) => {
      if (isDraggingAnyRef.current) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setTimeout(() => {
          isDraggingAnyRef.current = false;
        }, 50);
      }
    };

    el.addEventListener("click", handleNativeClick, { capture: true });
    return () => {
      el.removeEventListener("click", handleNativeClick, { capture: true });
    };
  }, [isDraggingAnyRef]);

  // Handle pointer down
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    // Only primary button
    if (e.button !== 0) return;

    const target = e.target as HTMLElement | null;

    // Do not initiate drag if interacting with an input/editable control
    if (isInteractiveControl(target)) return;

    // If target is inside a dedicated drag handle, let the handle control it
    if (target?.closest("[data-reorder-handle]")) return;

    // 1. Desktop mouse: Immediate drag (0ms delay)
    if (e.pointerType === "mouse") {
      controls.start(e);
      return;
    }

    // 2. Mobile touch: Hold-to-drag logic:
    // If user touches and moves immediately -> native page scroll occurs without interference.
    // If user touches and holds finger still for ~holdDelayMs -> drag mode is activated!
    clearHold();
    cleanupTouchPrevent();

    startPosRef.current = { x: e.clientX, y: e.clientY };
    savedPointerEventRef.current = e.nativeEvent;

    // If finger moves > 14px before the hold timer completes, the user is scrolling the page!
    // Cancel the timer immediately so native page scrolling proceeds with full momentum.
    const handleMoveDuringHold = (ev: TouchEvent | PointerEvent) => {
      if (!startPosRef.current) return;
      const clientX =
        "touches" in ev ? ev.touches[0]?.clientX : (ev as PointerEvent).clientX;
      const clientY =
        "touches" in ev ? ev.touches[0]?.clientY : (ev as PointerEvent).clientY;

      if (clientX === undefined || clientY === undefined) return;

      const dist = Math.hypot(
        clientX - startPosRef.current.x,
        clientY - startPosRef.current.y
      );

      // 14px tolerance accounts for normal resting thumb micro-jitters
      // while promptly recognizing deliberate scroll swipes
      if (dist > 14) {
        clearHold();
      }
    };

    const handleCancelDuringHold = () => {
      clearHold();
    };

    window.addEventListener("pointermove", handleMoveDuringHold, { passive: true });
    window.addEventListener("touchmove", handleMoveDuringHold, { passive: true });
    window.addEventListener("pointerup", handleCancelDuringHold, { once: true });
    window.addEventListener("pointercancel", handleCancelDuringHold, { once: true });
    window.addEventListener("touchend", handleCancelDuringHold, { once: true });

    holdListenersCleanupRef.current = () => {
      window.removeEventListener("pointermove", handleMoveDuringHold);
      window.removeEventListener("touchmove", handleMoveDuringHold);
      window.removeEventListener("pointerup", handleCancelDuringHold);
      window.removeEventListener("pointercancel", handleCancelDuringHold);
      window.removeEventListener("touchend", handleCancelDuringHold);
    };

    holdTimerRef.current = setTimeout(() => {
      clearHoldListeners();

      // Hold threshold reached! The user is holding their finger on the item.
      setIsHeld(true);
      isDraggingAnyRef.current = true;

      // Immediately attach non-passive touchmove preventDefault to window:
      // This prevents the mobile browser from initiating native scroll when the finger starts moving,
      // which keeps the touch gesture alive and prevents pointercancel!
      const preventTouchScroll = (te: TouchEvent) => {
        if (te.cancelable) {
          te.preventDefault();
        }
      };

      window.addEventListener("touchmove", preventTouchScroll, { passive: false });
      touchPreventCleanupRef.current = () => {
        window.removeEventListener("touchmove", preventTouchScroll);
      };

      // Subtle haptic vibration to notify user that item is picked up
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(20);
        } catch {}
      }

      // Initiate Framer Motion drag session
      if (savedPointerEventRef.current) {
        controls.start(savedPointerEventRef.current);
      }
    }, holdDelayMs);
  };

  // React synthetic capture handler as second layer of defense for click suppression
  const handleClickCapture = (e: ReactMouseEvent) => {
    if (isDraggingAnyRef.current) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        isDraggingAnyRef.current = false;
      }, 50);
    }
  };

  return (
    <ReorderItemContext.Provider value={{ dragControls: controls }}>
      <Reorder.Item
        ref={itemRef}
        as="div"
        data-reorder="item"
        value={item.id}
        dragListener={false}
        dragControls={controls}
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onClickCapture={handleClickCapture}
        onDragStart={() => {
          clearHold();
          isDraggingAnyRef.current = true;
          onDragStart(item);
        }}
        onDrag={(event, info) => {
          const clientY =
            (event as PointerEvent)?.clientY ??
            (info?.point?.y !== undefined
              ? info.point.y - window.scrollY
              : null);
          if (clientY !== null) {
            updatePointer(clientY);
          }
        }}
        onDragEnd={() => {
          clearHold();
          cleanupTouchPrevent();
          onDragEnd(item);
        }}
        animate={isHeld ? { scale: 1.03 } : { scale: 1 }}
        whileDrag={{
          scale: 1.03,
          opacity: 0.94,
          zIndex: 50,
          boxShadow:
            "0 12px 28px -4px rgba(0, 0, 0, 0.16), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
        className="touch-pan-y"
      >
        {renderItem(item)}
      </Reorder.Item>
    </ReorderItemContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Reorder List                                 */
/* -------------------------------------------------------------------------- */

function ReorderListComponent<T extends { id: number }>({
  items,
  entity,
  renderItem,
  revalidate,
  className,
  holdDelayMs = 220,
  autoScrollThreshold = 100,
  autoScrollMaxSpeed = 24,
}: ReorderListProps<T>) {
  const [order, setOrder] = useState<number[]>(() => items.map((i) => i.id));
  const orderRef = useRef(order);
  const groupRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const isDraggingAnyRef = useRef(false);

  const { startAutoScroll, stopAutoScroll, updatePointer } = useAutoScroll({
    threshold: autoScrollThreshold,
    maxSpeed: autoScrollMaxSpeed,
  });

  const handleReorder = (next: number[]) => {
    orderRef.current = next;
    setOrder(next);
  };

  // Adopt the server order whenever the set of ids changes (create/delete),
  // but keep the local dragged order while the same ids are displayed.
  useEffect(() => {
    if (isDraggingAnyRef.current) return;

    const serverIds = items.map((i) => i.id);
    if (
      orderRef.current.length === serverIds.length &&
      serverIds.every((id) => orderRef.current.includes(id))
    ) {
      return;
    }

    orderRef.current = serverIds;
    setOrder(serverIds);
  }, [items]);

  const persistOrder = () => {
    fetch("/api/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, ids: orderRef.current }),
    }).then((res) => {
      if (!res.ok) revalidate?.();
    });
  };

  // Window pointermove listener during active drag to feed pointer coordinates
  // continuously to the RAF auto-scroller even between motion animation frames
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientY);
    };

    window.addEventListener("pointermove", handleWindowPointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
    };
  }, [isDragging, updatePointer]);

  const handleDragStart = () => {
    setIsDragging(true);
    isDraggingAnyRef.current = true;
    startAutoScroll(groupRef.current);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    stopAutoScroll();
    persistOrder();

    // Keep dragging flag true for a brief moment to swallow the ensuing click event
    setTimeout(() => {
      isDraggingAnyRef.current = false;
    }, 120);
  };

  const itemById = new Map(items.map((i) => [i.id, i]));
  const orderedItems = order
    .map((id) => itemById.get(id))
    .filter((i): i is T => Boolean(i));

  return (
    <Reorder.Group
      ref={groupRef}
      as="div"
      axis="y"
      data-reorder="group"
      values={order}
      onReorder={handleReorder}
      className={cn("w-full space-y-3", className)}
    >
      {orderedItems.map((item) => (
        <ReorderListItem
          key={item.id}
          item={item}
          renderItem={renderItem}
          isDraggingAnyRef={isDraggingAnyRef}
          holdDelayMs={holdDelayMs}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          updatePointer={updatePointer}
        />
      ))}
    </Reorder.Group>
  );
}

const ReorderList = Object.assign(ReorderListComponent, {
  Handle: ReorderHandle,
});

export default ReorderList;
export { ReorderList };
