"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserService } from "../services/user-service";
import { AdminUserItem } from "../types";
import { UserDetailDialog } from "./user-detail-dialog";

const userService = new UserService();

export function UserTable() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    userService.getUsers({ search, role: roleFilter, status: statusFilter }).then(setUsers);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleExportCSV = () => {
    const csvContent = userService.exportToCSV(users);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentis-users-roster-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-border/80 bg-card shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="pl-9 text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 rounded-lg border border-border bg-background text-xs font-semibold"
            >
              <option value="ALL">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded-lg border border-border bg-background text-xs font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>

            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 font-semibold text-xs">
              <Download className="h-3.5 w-3.5" />
              Export Roster
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Table List */}
      <div className="space-y-3">
        {users.map((u) => {
          const isActive = u.status === "active";
          return (
            <Card key={u.id} className="border-border/80 bg-card shadow-xs hover:border-primary/40 transition-all">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-sm shrink-0">
                    {u.fullName.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-foreground">{u.fullName}</span>
                      <Badge
                        variant={
                          u.role === "super_admin"
                            ? "destructive"
                            : u.role === "admin"
                            ? "accent"
                            : u.role === "editor"
                            ? "amber"
                            : "outline"
                        }
                        className="text-[10px]"
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                      <Badge variant={isActive ? "accent" : "secondary"} className="text-[10px]">
                        {u.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {u.email} • Level <strong>{u.level}</strong> ({u.xp} XP) • Streak: <strong>{u.streakDays} days</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  {/* Roadmap Progress Bar */}
                  <div className="w-28 text-right hidden md:block">
                    <div className="text-[11px] font-semibold text-muted-foreground">Roadmap: {u.roadmapProgress}%</div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary" style={{ width: `${u.roadmapProgress}%` }} />
                    </div>
                  </div>

                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setSelectedUserId(u.id)}
                    className="gap-1 font-semibold text-xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User Detail Dialog */}
      {selectedUserId && (
        <UserDetailDialog
          userId={selectedUserId}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
}
