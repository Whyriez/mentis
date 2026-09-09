"use client";

import React from "react";
import { Users } from "lucide-react";
import { UserTable } from "@/features/admin-users/components/user-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Users className="h-4 w-4" />
          <span>Learner Roster & Access Control</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">User Management</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Manage platform accounts, review learner progress, modify security roles, and reset statistics.
        </p>
      </div>

      <UserTable />
    </div>
  );
}
