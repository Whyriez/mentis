"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/auth/rbac";
import Link from "next/link";

export function AdminHeader({ role = "super_admin" }: { role?: UserRole }) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
        <Link href="/admin/dashboard" className="hover:text-foreground">
          Admin
        </Link>
        {pathSegments.slice(1).map((segment) => (
          <React.Fragment key={segment}>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="capitalize text-foreground font-bold">
              {segment.replace("-", " ")}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* User Info & Actions */}
      <div className="flex items-center gap-3">
        <Badge variant="accent" className="text-xs font-bold gap-1 px-2.5 py-0.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          {role.toUpperCase()}
        </Badge>

        <Link href="/login">
          <Button variant="ghost" size="xs" className="gap-1.5 text-xs text-muted-foreground hover:text-destructive">
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </Button>
        </Link>
      </div>
    </header>
  );
}
