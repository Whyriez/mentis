"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Shield, RotateCcw, X, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserService } from "../services/user-service";
import { UserDetailProfile, UserRole, UserAccountStatus } from "../types";
import { updateUserRoleAction, toggleUserStatusAction, resetUserProgressAction } from "../actions/user-actions";

const userService = new UserService();

export function UserDetailDialog({
  userId,
  isOpen,
  onClose,
  onUserUpdated,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: () => void;
}) {
  const [profile, setProfile] = useState<UserDetailProfile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = useCallback(() => {
    userService.getUserDetail(userId).then(setProfile);
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) fetchProfile();
  }, [isOpen, userId, fetchProfile]);

  if (!isOpen || !profile) return null;

  const handleRoleChange = async (newRole: UserRole) => {
    setIsUpdating(true);
    try {
      await updateUserRoleAction(userId, newRole);
      fetchProfile();
      if (onUserUpdated) onUserUpdated();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    const nextStatus: UserAccountStatus = profile.status === "active" ? "deactivated" : "active";
    try {
      await toggleUserStatusAction(userId, nextStatus);
      fetchProfile();
      if (onUserUpdated) onUserUpdated();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetProgress = async () => {
    if (!confirm("Are you sure you want to reset learning progress for this user? Learning statistics will be soft-reset.")) return;
    setIsUpdating(true);
    try {
      await resetUserProgressAction(userId);
      fetchProfile();
      if (onUserUpdated) onUserUpdated();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden space-y-4 p-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-sm">
              {profile.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {profile.fullName}
                <Badge variant={profile.role === "super_admin" ? "destructive" : "accent"} className="text-[10px]">
                  {profile.role.toUpperCase()}
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <Button size="xs" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border/70 bg-muted/20 text-center p-3">
            <div className="text-xs text-muted-foreground">Level & XP</div>
            <div className="text-base font-extrabold text-primary">Lvl {profile.level} ({profile.xp} XP)</div>
          </Card>
          <Card className="border-border/70 bg-muted/20 text-center p-3">
            <div className="text-xs text-muted-foreground">Streak</div>
            <div className="text-base font-extrabold text-amber-500">{profile.streakDays} Days 🔥</div>
          </Card>
          <Card className="border-border/70 bg-muted/20 text-center p-3">
            <div className="text-xs text-muted-foreground">Accuracy</div>
            <div className="text-base font-extrabold text-emerald-500">{profile.averageAccuracy}%</div>
          </Card>
          <Card className="border-border/70 bg-muted/20 text-center p-3">
            <div className="text-xs text-muted-foreground">Roadmap %</div>
            <div className="text-base font-extrabold text-blue-500">{profile.roadmapProgress}%</div>
          </Card>
        </div>

        {/* Quiz History */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs text-muted-foreground flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-primary" />
            Recent Quiz History
          </h4>
          <div className="space-y-1.5">
            {profile.quizHistory.map((q) => (
              <div key={q.id} className="p-2.5 rounded-lg border border-border bg-background flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{q.quizTitle}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="text-[10px]">Score: {q.score}%</Badge>
                  <span className="text-[11px] text-muted-foreground">{q.takenAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Super Admin Control Actions */}
        <div className="pt-3 border-t border-border space-y-3">
          <span className="font-bold text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-primary" />
            Super Admin Controls
          </span>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/20 p-3 rounded-xl border border-border/80">
            {/* Role Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Change Role:</span>
              <select
                value={profile.role}
                disabled={isUpdating}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="p-1.5 rounded-lg border border-border bg-background text-xs font-bold"
              >
                <option value="user">User</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            {/* Toggle Status & Reset */}
            <div className="flex items-center gap-2">
              <Button
                size="xs"
                variant={profile.status === "active" ? "destructive" : "default"}
                disabled={isUpdating}
                onClick={handleStatusToggle}
                className="text-xs font-semibold"
              >
                {profile.status === "active" ? "Deactivate User" : "Activate User"}
              </Button>

              <Button
                size="xs"
                variant="outline"
                disabled={isUpdating}
                onClick={handleResetProgress}
                className="gap-1 text-xs font-semibold text-destructive"
              >
                <RotateCcw className="h-3 w-3" />
                Reset Progress
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
