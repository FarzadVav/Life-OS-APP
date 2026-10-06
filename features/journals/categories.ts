"use client";

import { useSyncExternalStore } from "react";
import { JournalCategory } from "./types";

export type { JournalCategory };

const STORAGE_KEY = "lifeos_journal_categories";
const CHANGE_EVENT = "lifeos_journal_categories_changed";

let inMemoryCategories: JournalCategory[] = [];
let isInitialized = false;

function getCategoriesSnapshot(): JournalCategory[] {
  if (typeof window !== "undefined" && !isInitialized) {
    isInitialized = true;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        inMemoryCategories = JSON.parse(data);
      }
    } catch {
      // Ignore localStorage read errors
    }
  }
  return inMemoryCategories;
}

const emptyServerCategories: JournalCategory[] = [];

function getServerSnapshot(): JournalCategory[] {
  return emptyServerCategories;
}

function notifySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function subscribeJournalCategories(callback: () => void) {
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

export function getJournalCategories(): JournalCategory[] {
  return getCategoriesSnapshot();
}

export function addJournalCategory(name: string): JournalCategory {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Category name is required");
  }

  const current = getCategoriesSnapshot();
  const newCat: JournalCategory = {
    id: Date.now(),
    name: trimmed,
  };

  const updated = [...current, newCat];
  inMemoryCategories = updated;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }
  }

  notifySubscribers();
  return newCat;
}

export function updateJournalCategory(id: number, name: string): JournalCategory {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Category name is required");
  }

  const current = getCategoriesSnapshot();
  const updated = current.map((item) =>
    item.id === id ? { ...item, name: trimmed } : item,
  );
  inMemoryCategories = updated;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }
  }

  notifySubscribers();
  return { id, name: trimmed };
}

export function deleteJournalCategory(id: number) {
  const current = getCategoriesSnapshot();
  const updated = current.filter((item) => item.id !== id);
  inMemoryCategories = updated;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }
  }

  notifySubscribers();
}

export function useJournalCategories() {
  const categories = useSyncExternalStore(
    subscribeJournalCategories,
    getCategoriesSnapshot,
    getServerSnapshot,
  );

  return {
    categories,
    addCategory: addJournalCategory,
    updateCategory: updateJournalCategory,
    deleteCategory: deleteJournalCategory,
  };
}
