import type { User } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

export function Avatar({ user, size = "md", className }: { user: Pick<User, "name" | "avatarUrl">; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const dims = { sm: "size-8 text-[12px]", md: "size-11 text-sm", lg: "size-16 text-xl", xl: "size-28 text-4xl" }[size];
  if (user.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.name} className={cn("shrink-0 rounded-full object-cover", dims, className)} />;
  }
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-brass-soft to-brass font-serif italic text-white", dims, className)} aria-hidden>
      {initials(user.name) || "A"}
    </span>
  );
}
