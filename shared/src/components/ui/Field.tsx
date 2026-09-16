import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-2xl border border-line bg-cream px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/55 transition duration-300 focus:border-brass/70 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brass/10 disabled:opacity-60";

export function Label({ htmlFor, children, hint, className }: { htmlFor?: string; children: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-2 flex items-baseline justify-between gap-3", className)}>
      <span className="text-[13px] font-semibold text-ink-soft">{children}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputClass, className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn(inputClass, "min-h-28 resize-y leading-relaxed", className)} {...props} />;
});

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        inputClass,
        "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2375695f%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pr-10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-2 text-[13px] font-medium text-bordeaux">{children}</p>;
}
