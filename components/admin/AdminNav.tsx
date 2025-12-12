"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "📊",
  },
  {
    label: "Tools",
    href: "/admin/tools",
    icon: "🔧",
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: "📅",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: "📈",
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="py-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}

      <div className="border-t border-gray-200 mt-4 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">🏠</span>
          View Site
        </Link>
      </div>
    </nav>
  );
}
