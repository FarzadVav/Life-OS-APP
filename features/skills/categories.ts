"use client";

import { useSyncExternalStore } from "react";
import { SkillCategory } from "./types";

export type { SkillCategory };

const STORAGE_KEY = "lifeos_skill_categories";
const CHANGE_EVENT = "lifeos_skill_categories_changed";

let inMemoryCategories: SkillCategory[] = [];
let isInitialized = false;

function getCategoriesSnapshot(): SkillCategory[] {
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

const emptyServerCategories: SkillCategory[] = [];

function getServerSnapshot(): SkillCategory[] {
  return emptyServerCategories;
}

function notifySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function subscribeSkillCategories(callback: () => void) {
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

export function getSkillCategories(): SkillCategory[] {
  return getCategoriesSnapshot();
}

export function addSkillCategory(name: string): SkillCategory {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Category name is required");
  }

  const current = getCategoriesSnapshot();
  const newCat: SkillCategory = {
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

export function updateSkillCategory(id: number, name: string): SkillCategory {
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

export function deleteSkillCategory(id: number) {
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

export function useSkillCategories() {
  const categories = useSyncExternalStore(
    subscribeSkillCategories,
    getCategoriesSnapshot,
    getServerSnapshot,
  );

  return {
    categories,
    addCategory: addSkillCategory,
    updateCategory: updateSkillCategory,
    deleteCategory: deleteSkillCategory,
  };
}
