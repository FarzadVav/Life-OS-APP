"use client";

import { useSyncExternalStore } from "react";
import { FrameworkItem, FrameworkCategory, FrameworkSection } from "./types";
import { INITIAL_FRAMEWORK_ITEMS } from "./constants";

const STORAGE_KEY = "lifeos_framework_items";
const CHANGE_EVENT = "lifeos_framework_items_changed";

let inMemoryItems: FrameworkItem[] = INITIAL_FRAMEWORK_ITEMS;
let isInitialized = false;

function getItemsSnapshot(): FrameworkItem[] {
  if (typeof window !== "undefined" && !isInitialized) {
    isInitialized = true;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryItems = parsed;
        } else {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(INITIAL_FRAMEWORK_ITEMS),
          );
        }
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(INITIAL_FRAMEWORK_ITEMS),
        );
      }
    } catch {
      // Fallback to in-memory items
    }
  }
  return inMemoryItems;
}

function getServerSnapshot(): FrameworkItem[] {
  return INITIAL_FRAMEWORK_ITEMS;
}

function notifySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function subscribeFrameworkItems(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getFrameworkItems(): FrameworkItem[] {
  return getItemsSnapshot();
}

export function getFrameworkItem(id: number): FrameworkItem | undefined {
  const all = getItemsSnapshot();
  return all.find((item) => item.id === id);
}

export function addFrameworkItem(params: {
  title: string;
  content: string;
  category: FrameworkCategory;
  section: FrameworkSection;
}): FrameworkItem {
  const current = getItemsSnapshot();
  const newItem: FrameworkItem = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: params.title.trim(),
    content: params.content,
    category: params.category,
    section: params.section,
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  inMemoryItems = updated;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }
  }

  notifySubscribers();
  return newItem;
}

export function updateFrameworkItem(
  id: number,
  params: {
    title: string;
    content: string;
    category: FrameworkCategory;
    section: FrameworkSection;
  },
): FrameworkItem | undefined {
  const current = getItemsSnapshot();
  const exists = current.find((item) => item.id === id);
  if (!exists) return undefined;

  const updatedItem: FrameworkItem = {
    ...exists,
    title: params.title.trim(),
    content: params.content,
    category: params.category,
    section: params.section,
  };

  const updated = current.map((item) => (item.id === id ? updatedItem : item));
  inMemoryItems = updated;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }
  }

  notifySubscribers();
  return updatedItem;
}

export function deleteFrameworkItem(id: number) {
  const current = getItemsSnapshot();
  const updated = current.filter((item) => item.id !== id);
  inMemoryItems = updated;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }
  }

  notifySubscribers();
}

export function useFrameworkItems() {
  const items = useSyncExternalStore(
    subscribeFrameworkItems,
    getItemsSnapshot,
    getServerSnapshot,
  );

  return {
    items,
    addItem: addFrameworkItem,
    updateItem: updateFrameworkItem,
    deleteItem: deleteFrameworkItem,
  };
}
