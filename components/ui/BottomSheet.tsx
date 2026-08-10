'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Called once after open so callers can auto-focus an input. */
  autoFocusRef?: React.RefObject<HTMLInputElement | null>;
}

const DRAG_CLOSE_PX = 80;

/**
 * Feature 5 — Mobile bottom sheet (<768px).
 * - Slides up over content; Escape, backdrop tap, and drag-down all close it.
 * - Locks body scroll while open.
 * - pb-safe keeps content clear of the iOS home indicator.
 * Renders null on desktop — callers should keep their inline desktop UI and
 * mount this sheet only as the mobile variant.
 */
export function BottomSheet({ open, onClose, title, children, autoFocusRef }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Mount with entrance transition.
  useEffect(() => {
    if (open) {
      const id = window.requestAnimationFrame(() => setMounted(true));
      return () => window.cancelAnimationFrame(id);
    }
    setMounted(false);
    setDragOffset(0);
    return undefined;
  }, [open]);

  // Body scroll lock + Escape key.
  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Auto-focus the target input shortly after opening.
  useEffect(() => {
    if (!open) return undefined;
    const id = window.setTimeout(() => autoFocusRef?.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [open, autoFocusRef]);

  if (!open) return null;

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) dragStartY.current = e.touches[0].clientY;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    if (dy > 0) setDragOffset(dy);
  }
  function onTouchEnd() {
    if (dragOffset > DRAG_CLOSE_PX) onClose();
    dragStartY.current = null;
    setDragOffset(0);
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={title}>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: `translateY(${mounted ? dragOffset : 100}%)` }}
        className={`absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl border-t border-app bg-card pb-safe shadow-elevated transition-transform duration-200 ease-out ${
          dragOffset > 0 ? 'transition-none' : ''
        }`}
      >
        {/* Drag handle + title */}
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <span className="mx-auto h-1.5 w-10 rounded-full bg-muted/40" aria-hidden="true" />
        </div>
        <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-1">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn btn-secondary h-9 w-9 p-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
