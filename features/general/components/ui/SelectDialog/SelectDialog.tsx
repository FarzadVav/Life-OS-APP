"use client";

import {
  ReactElement,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { Check, Maximize2, Search, X } from "lucide-react";
import { cn } from "cn";

import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export type SelectDialogItem<T = string | number> = {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type BaseSelectDialogProps<T = string | number> = {
  /** Array of selectable items */
  items: SelectDialogItem<T>[];
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Accessible title shown in the dialog header */
  title?: string;
  /** Accessible description shown in the dialog header */
  description?: string;
  /** Whether to show a search filter input (defaults to true when items >= 6) */
  searchable?: boolean;
  /** Disables the select trigger */
  disabled?: boolean;
  /** Name attribute for HTML form submission */
  name?: string;
  /** HTML form required attribute */
  required?: boolean;

  /** Controlled dialog open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;

  /** Optional custom trigger element */
  trigger?: ReactElement;

  /** Additional classes applied to the trigger element */
  className?: string;
  /** Additional classes applied specifically to the trigger */
  triggerClassName?: string;
  /** Additional classes applied to the dialog popup */
  dialogClassName?: string;
};

export type SingleSelectDialogProps<T = string | number> =
  BaseSelectDialogProps<T> & {
    multiple?: false;
    value?: T | null;
    onChange?: (value: T) => void;
    onValueChange?: (value: T) => void;
    renderValue?: (value: T | null | undefined) => ReactNode;
  };

export type MultiSelectDialogProps<T = string | number> =
  BaseSelectDialogProps<T> & {
    multiple: true;
    value?: T[] | null;
    onChange?: (value: T[]) => void;
    onValueChange?: (value: T[]) => void;
    renderValue?: (value: T[] | null | undefined) => ReactNode;
  };

export type SelectDialogProps<T = string | number> =
  | SingleSelectDialogProps<T>
  | MultiSelectDialogProps<T>;

function checkSelected<T>(
  val: T,
  target: T | T[] | null | undefined,
  multiple?: boolean,
): boolean {
  if (target === null || target === undefined) return false;
  if (multiple) {
    if (!Array.isArray(target)) return false;
    return target.some((v) => String(v) === String(val));
  }
  return String(target) === String(val);
}

export function SelectDialog<T = string | number>(
  props: SelectDialogProps<T>,
) {
  const {
    items,
    multiple = false,
    placeholder,
    title,
    description,
    searchable,
    disabled = false,
    name,
    required = false,
    open: controlledOpen,
    onOpenChange,
    trigger,
    className,
    triggerClassName,
    dialogClassName,
  } = props;

  const value = props.value;
  const onChange = props.onChange as ((v: unknown) => void) | undefined;
  const onValueChange = props.onValueChange as ((v: unknown) => void) | undefined;
  const renderValue = props.renderValue as ((v: unknown) => ReactNode) | undefined;

  const { t } = useLocale();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [searchQuery, setSearchQuery] = useState("");
  const [stagedValues, setStagedValues] = useState<T[]>(() => {
    if (multiple) {
      return Array.isArray(value) ? [...(value as T[])] : value != null ? [value as T] : [];
    }
    return [];
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && multiple) {
      setStagedValues(
        Array.isArray(value) ? [...(value as T[])] : value != null ? [value as T] : [],
      );
    }
    if (!nextOpen) {
      setSearchQuery("");
    }
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const notifyChange = (nextValue: unknown) => {
    onChange?.(nextValue);
    onValueChange?.(nextValue);
  };

  const handleSingleSelect = (itemValue: T) => {
    notifyChange(itemValue);
    handleOpenChange(false);
  };

  const handleToggleMultiple = (itemValue: T) => {
    setStagedValues((prev) => {
      const exists = prev.some((v) => String(v) === String(itemValue));
      if (exists) {
        return prev.filter((v) => String(v) !== String(itemValue));
      } else {
        return [...prev, itemValue];
      }
    });
  };

  const handleConfirmMultiple = () => {
    notifyChange(stagedValues);
    handleOpenChange(false);
  };

  // Determine selection existence
  const hasSelection = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== null && value !== undefined && value !== "";
  }, [value, multiple]);

  // Compute label shown in the trigger
  const displayLabel = useMemo(() => {
    if (renderValue) {
      return renderValue(value);
    }

    if (multiple) {
      const selected = items.filter((item) =>
        checkSelected(item.value, value as T[] | null | undefined, true),
      );
      if (selected.length === 0) {
        return placeholder || t("common.select") || "Select...";
      }
      return selected
        .map((item) =>
          typeof item.label === "string" ? item.label : String(item.value),
        )
        .join(", ");
    }

    const selected = items.find((item) =>
      checkSelected(item.value, value as T | null | undefined, false),
    );
    if (!selected) {
      return placeholder || t("common.select") || "Select...";
    }
    return selected.label;
  }, [items, value, multiple, renderValue, placeholder, t]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const labelText =
        typeof item.label === "string" ? item.label : String(item.value);
      const descText =
        typeof item.description === "string" ? item.description : "";
      return (
        labelText.toLowerCase().includes(q) ||
        descText.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  const showSearch = searchable ?? items.length >= 6;

  // Default trigger button styled like an input field with Maximize2 icon
  const computedTrigger = trigger || (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "input flex items-center justify-between gap-2 text-start select-none cursor-pointer",
        "bg-card/40 hover:border-foreground/40 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        triggerClassName,
        className,
      )}
      aria-label={title || placeholder || "Select"}
    >
      <span
        className={cn(
          "truncate flex-1 text-sm font-normal",
          !hasSelection && "opacity-50",
        )}
      >
        {displayLabel}
      </span>
      <Maximize2 className="size-4 shrink-0 opacity-60 transition-opacity" />
    </button>
  );

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        trigger={computedTrigger}
        nativeButton
        className={cn("w-[92vw] sm:w-[420px] max-w-[420px] p-4 gap-3", dialogClassName)}
      >
        {/* Header with Title and Close X */}
        <div className="flex items-center justify-between pb-2 border-b border-foreground/10">
          <div className="flex flex-col min-w-0 pr-2">
            <Dialog.Title className="text-sm sm:text-base font-bold text-foreground truncate">
              {title || placeholder || t("common.select") || "Select"}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="sub-text text-xs mt-0.5 line-clamp-2">
                {description}
              </Dialog.Description>
            ) : null}
          </div>

          <Dialog.Close
            render={
              <Button
                type="button"
                variant="ghost"
                square
                className="size-8 rounded-full shrink-0"
                aria-label={t("common.close") || "Close"}
              >
                <X className="size-4" />
              </Button>
            }
          />
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="relative">
            <Search className="size-4 opacity-50 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.search") || "Search..."}
              className="input ps-9 pe-8 text-sm"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 p-0.5 cursor-pointer"
                aria-label={t("common.clear") || "Clear search"}
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        )}

        {/* Multiple mode selection summary and bulk actions */}
        {multiple && items.length > 2 && (
          <div className="flex items-center justify-between text-xs px-1 text-foreground/70">
            <span>
              {stagedValues.length} / {items.length} {t("common.selected") || "selected"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setStagedValues(
                    items.filter((i) => !i.disabled).map((i) => i.value),
                  )
                }
                className="underline hover:text-foreground cursor-pointer"
              >
                {t("common.all") || "All"}
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setStagedValues([])}
                className="underline hover:text-foreground cursor-pointer"
              >
                {t("common.clear") || "Clear"}
              </button>
            </div>
          </div>
        )}

        {/* List of items */}
        <div className="max-h-[50vh] sm:max-h-[55vh] overflow-y-auto space-y-1 p-0.5 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm opacity-50">
              {t("common.noResults") || "No results found"}
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelectedItem = multiple
                ? checkSelected(item.value, stagedValues, true)
                : checkSelected(item.value, value as T | null | undefined, false);

              return (
                <button
                  key={String(item.value)}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    if (multiple) {
                      handleToggleMultiple(item.value);
                    } else {
                      handleSingleSelect(item.value);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-component text-start transition-colors cursor-pointer select-none",
                    isSelectedItem
                      ? "bg-foreground/10 font-medium text-foreground border border-foreground/20"
                      : "hover:bg-foreground/5 text-foreground/80 border border-transparent",
                    item.disabled &&
                      "opacity-40 cursor-not-allowed pointer-events-none",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.icon ? (
                      <span className="shrink-0">{item.icon}</span>
                    ) : null}
                    <div className="min-w-0">
                      <div className="truncate text-sm">{item.label}</div>
                      {item.description ? (
                        <div className="sub-text text-xs line-clamp-1">
                          {item.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {isSelectedItem && (
                    <Check className="size-4 shrink-0 text-foreground" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer actions for multiple mode */}
        {multiple && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-foreground/10">
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleOpenChange(false)}
                >
                  {t("common.cancel") || "Cancel"}
                </Button>
              }
            />
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmMultiple}
            >
              {t("common.confirm") || t("common.save") || "Confirm"}
            </Button>
          </div>
        )}
      </Dialog>

      {/* Hidden input for HTML form submission */}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={
            multiple
              ? Array.isArray(value)
                ? (value as unknown[]).join(",")
                : ""
              : value != null
                ? String(value)
                : ""
          }
          required={required && !hasSelection}
        />
      ) : null}
    </>
  );
}

export default SelectDialog;
