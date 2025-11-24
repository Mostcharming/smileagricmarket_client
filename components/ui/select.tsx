"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { SelectOptions, SelectProps } from "@/types";
import { ChevronIcon } from "@/components/icons";
import clsx from "clsx";

export default function Select({
  variant = "v1",
  className = "",
  options = [],
  value,
  onChange,
  placeholder,
  emptyState = "No options available",
  defaultValue = "",
  dropdownPosition = "left",
  minWidth,
  hasMore = false,
  onLoadMore,
  loadMoreLabel = "Load more",
  loadMoreLoading = false,
  label,
  labelClassName = "",
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || ""
  );
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});
  const isControlled = value !== undefined;
  const selectedValue = (isControlled ? value : internalValue) || "";

  const flatOptions = Array.isArray(options) ? options : [];
  const selectedOption = flatOptions.find((opt) => opt.value === selectedValue);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        !(dropdownRef.current && dropdownRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    const MAX_DROPDOWN_HEIGHT = 420;

    const compute = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const winX = window.scrollX || window.pageXOffset;
      const winY = window.scrollY || window.pageYOffset;

      const widthPx =
        typeof minWidth === "number"
          ? minWidth
          : typeof minWidth === "string" && minWidth.endsWith("px")
          ? parseInt(minWidth, 10)
          : Math.round(rect.width);

      let dropdownHeightEstimate = MAX_DROPDOWN_HEIGHT;

      if (dropdownRef.current) {
        const measured =
          dropdownRef.current.offsetHeight || dropdownRef.current.scrollHeight;
        if (measured && measured > 0)
          dropdownHeightEstimate = Math.min(measured, MAX_DROPDOWN_HEIGHT);
      }

      const availableBelow = window.innerHeight - rect.bottom;
      const availableAbove = rect.top;

      const preferAbove =
        dropdownHeightEstimate + 8 > availableBelow &&
        availableAbove > availableBelow;

      let topPos: number;
      let finalMaxHeight = dropdownHeightEstimate;

      if (preferAbove) {
        finalMaxHeight = Math.min(
          dropdownHeightEstimate,
          Math.max(64, Math.floor(availableAbove - 8))
        );
        topPos = rect.top + winY - finalMaxHeight - 4;
      } else {
        finalMaxHeight = Math.min(
          dropdownHeightEstimate,
          Math.max(64, Math.floor(availableBelow - 8))
        );
        topPos = rect.bottom + winY + 4;
      }

      const left =
        dropdownPosition === "right"
          ? rect.right + winX - widthPx
          : rect.left + winX;

      setDropdownStyles({
        position: "absolute",
        top: topPos,
        left,
        width: `${widthPx}px`,
        maxHeight: `${finalMaxHeight}px`,
        zIndex: 9999,
        transformOrigin: preferAbove ? "bottom left" : "top left",
      });

      if (!dropdownRef.current) {
        requestAnimationFrame(() => {
          if (!dropdownRef.current) return;
          const measured =
            dropdownRef.current.offsetHeight ||
            dropdownRef.current.scrollHeight ||
            MAX_DROPDOWN_HEIGHT;
          const newEstimate = Math.min(measured, MAX_DROPDOWN_HEIGHT);
          const newPreferAbove =
            newEstimate + 8 > availableBelow && availableAbove > availableBelow;
          const newFinalMaxHeight = newPreferAbove
            ? Math.min(
                newEstimate,
                Math.max(64, Math.floor(availableAbove - 8))
              )
            : Math.min(
                newEstimate,
                Math.max(64, Math.floor(availableBelow - 8))
              );
          const newTop = newPreferAbove
            ? rect.top + winY - newFinalMaxHeight - 4
            : rect.bottom + winY + 4;

          setDropdownStyles((s) => ({
            ...s,
            top: newTop,
            maxHeight: `${newFinalMaxHeight}px`,
            transformOrigin: newPreferAbove ? "bottom left" : "top left",
          }));
        });
      }
    };

    if (open) {
      compute();
      window.addEventListener("resize", compute);
      window.addEventListener("scroll", compute, true);
    }
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open, dropdownPosition, minWidth]);

  const [highlighted, setHighlighted] = useState<number>(-1);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!open) setHighlighted(-1);
  }, [open, options]);

  const handleSelect = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.({ target: { value: val } });
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const total = flatOptions.length;
    if (!open) {
      if (e.key === "Enter" || e.key === " ") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      setHighlighted((h) => Math.min(h + 1, Math.max(0, total - 1)));
    } else if (e.key === "ArrowUp") {
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (
      e.key === "Enter" &&
      highlighted >= 0 &&
      flatOptions[highlighted]
    ) {
      const opt = flatOptions[highlighted];
      if (opt.value && typeof opt.value === "string") handleSelect(opt.value);
      if (opt.value && typeof opt.value === "function") opt.value();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const baseClasses =
    "border border-border px-3 py-4 cursor-pointer relative";
  const variantClasses =
    variant === "v1" ? "bg-appWhite rounded-lg" : "bg-transparent rounded-full";

  const hasValue = Boolean(selectedValue);
  const isFloating = hasValue;

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={twMerge(
        baseClasses,
        variantClasses,
        className,
        "outline-none select-none"
      )}
      onClick={() => setOpen((o) => !o)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {label && (
        <label
          className={`absolute left-3 transition-all duration-300 ease-in-out pointer-events-none ${labelClassName} ${
            isFloating
              ? '-top-2 text-xs bg-appWhite px-1 text-border'
              : 'top-4 text-sm text-border'
          }`}
        >
          {label}
        </label>
      )}

      <div className="flex items-center justify-between w-full">
        <span className="truncate flex items-center text-xs sm:text-sm gap-2">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? (
            <span className={twMerge("truncate", selectedOption.color ?? "")}>
              {selectedOption.label}
            </span>
          ) : (
            <span className="truncate text-border">{placeholder}</span>
          )}
        </span>
        <div>
          <ChevronIcon
            size={16}
            className={twMerge("ml-2 smooth-transition", open && "rotate-180")}
          />
        </div>
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyles}
            className="p-1 bg-appWhite border border-border rounded-lg shadow-lg overflow-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {flatOptions.length === 0 ? (
              <div className="px-2 py-2 sm:px-4 sm:py-3 text-border text-xs sm:text-base truncate">
                {emptyState}
              </div>
            ) : (
              <>
                {(flatOptions as SelectOptions[]).map((opt, i) => (
                  <button
                    key={
                      typeof opt.value === "string" ||
                      typeof opt.value === "number"
                        ? (opt.value as React.Key)
                        : `option-${i}`
                    }
                    type="button"
                    className={clsx(
                      "w-full rounded-lg cursor-pointer text-left px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm hover:bg-background/50 focus:bg-background100 transition-all",
                      selectedValue === opt.value &&
                        "bg-primary/10 font-medium",
                      highlighted === i && "bg-background100",
                      "outline-none"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof opt.value === "string") {
                        handleSelect(opt.value);
                      } else if (typeof opt.value === "function") {
                        (opt.value as () => void)();
                      }
                    }}
                    onMouseEnter={() => setHighlighted(i)}
                    tabIndex={-1}
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      {opt.icon && <span>{opt.icon}</span>}
                      <span className={twMerge("truncate", opt.color ?? "")}>
                        {opt.label}
                      </span>
                    </span>
                  </button>
                ))}

                {onLoadMore && hasMore && (
                  <div className="px-3 py-2 border-t border-border flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!loadMoreLoading) onLoadMore();
                      }}
                      className="text-xs sm:text-base px-3 py-1 rounded-md bg-white border border-border hover:bg-background/50 disabled:opacity-60"
                      disabled={!!loadMoreLoading}
                    >
                      {loadMoreLoading ? "Loading..." : loadMoreLabel}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}