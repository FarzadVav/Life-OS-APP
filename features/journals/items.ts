"use client";

import { useSyncExternalStore } from "react";
import { Journal, JournalType } from "./types";
import { journals as initialJournals } from "./constants";

const STORAGE_KEY = "lifeos_journals_items";
const CHANGE_EVENT = "lifeos_journals_items_changed";

let inMemoryItems: Journal[] = initialJournals;
let isInitialized = false;

function getItemsSnapshot(): Journal[] {
  if (typeof window !== "undefined" && !isInitialized) {
    isInitialized = true;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryItems = parsed;
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialJournals));
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialJournals));
      }
    } catch {
      // Fallback to in-memory items
    }
  }
  return inMemoryItems;
}

function getServerSnapshot(): Journal[] {
  return initialJournals;
}

function notifySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function subscribeJournals(callback: () => void) {
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

export function getJournals(): Journal[] {
  return getItemsSnapshot();
}

export function getJournal(id: number): Journal | undefined {
  const all = getItemsSnapshot();
  return all.find((item) => item.id === id);
}

export function addJournal(params: {
  title: string;
  content: string;
  type: JournalType;
}): Journal {
  const current = getItemsSnapshot();
  const newItem: Journal = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: params.title.trim(),
    content: params.content,
    type: params.type,
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

export function updateJournal(
  id: number,
  params: {
    title: string;
    content: string;
    type: JournalType;
  },
): Journal | undefined {
  const current = getItemsSnapshot();
  const exists = current.find((item) => item.id === id);
  if (!exists) return undefined;

  const updatedItem: Journal = {
    ...exists,
    title: params.title.trim(),
    content: params.content,
    type: params.type,
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

export function deleteJournal(id: number) {
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

export function useJournals() {
  const items = useSyncExternalStore(
    subscribeJournals,
    getItemsSnapshot,
    getServerSnapshot,
  );

  return {
    journals: items,
    addJournal,
    updateJournal,
    deleteJournal,
  };
}
