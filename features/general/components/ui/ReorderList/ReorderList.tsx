"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Reorder } from "motion/react";
import { cn } from "cn";
import type { ReorderEntity } from "@/app/api/reorder/route";

type ReorderListProps<T extends { id: number }> = {
  /** Server-ordered (and optionally filtered) items for this list */
  items: T[];
  entity: ReorderEntity;
  renderItem: (item: T) => ReactNode;
  /** SWR mutate, used to snap back to server order when persisting fails */
  revalidate?: () => void;
  className?: string;
};

function ReorderList<T extends { id: number }>({
  items,
  entity,
  renderItem,
  revalidate,
  className,
}: ReorderListProps<T>) {
  const [order, setOrder] = useState<number[]>(() => items.map((i) => i.id));
  const orderRef = useRef(order);

  const draggingRef = useRef(false);

  const handleReorder = (next: number[]) => {
    orderRef.current = next;
    setOrder(next);
  };

  // Adopt the server order whenever the set of ids changes (create/delete),
  // but keep the local dragged order while the same ids are displayed.
  useEffect(() => {
    if (draggingRef.current) return;

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

  const itemById = new Map(items.map((i) => [i.id, i]));
  const orderedItems = order
    .map((id) => itemById.get(id))
    .filter((i): i is T => Boolean(i));

  return (
    <Reorder.Group
      as="div"
      axis="y"
      data-reorder="group"
      values={order}
      onReorder={handleReorder}
      className={cn("w-full space-y-3", className)}
    >
      {orderedItems.map((item) => (
        <Reorder.Item
          key={item.id}
          as="div"
          data-reorder="item"
          value={item.id}
          onDragStart={() => {
            draggingRef.current = true;
          }}
          onDragEnd={() => {
            draggingRef.current = false;
            persistOrder();
          }}
          whileDrag={{ scale: 1.02, opacity: 0.9 }}
        >
          {renderItem(item)}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

export default ReorderList;
