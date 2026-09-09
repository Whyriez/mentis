"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  BookOpen,
  HelpCircle,
  Bot,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { MentisLogo } from "@/components/ui/mentis-logo";
import { Badge } from "@/components/ui/badge";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Modules", href: "/admin/modules", icon: FolderTree, placeholder: true },
  { label: "Lessons", href: "/admin/lessons", icon: BookOpen, placeholder: true },
  { label: "Questions", href: "/admin/questions", icon: HelpCircle, placeholder: true },
  { label: "AI Content", href: "/admin/ai", icon: Bot },
  { label: "Users", href: "/admin/users", icon: Users, placeholder: true },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, placeholder: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, placeholder: true },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col justify-between hidden md:flex shrink-0 min-h-screen">
      <div className="p-4 space-y-6">
        {/* Brand */}
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-2">
          <MentisLogo size={32} className="rounded-lg shadow-xs" />
          <div>
            <span className="font-extrabold text-base tracking-tight block">Mentis Admin</span>
            <span className="text-[10px] text-muted-foreground font-semibold">Control Center</span>
          </div>
        </Link>

        {/* Navigation List */}
        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>

                {item.placeholder && !isActive && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0 opacity-60">
                    Soon
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-border">
        <div className="p-3 rounded-lg bg-muted/40 text-[11px] text-muted-foreground space-y-1">
          <div className="font-bold text-foreground">Mentis v1.2 Admin</div>
          <div>RBAC Enforced</div>
        </div>
      </div>
    </aside>
  );
}
