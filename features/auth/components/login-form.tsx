"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type LoginSchemaType } from "../utils/validation";
import { loginAction } from "../actions/auth-actions";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const res = await loginAction(null, formData);
      if (res && !res.success && res.error) {
        setServerError(res.error);
        setIsSubmitting(false);
      } else {
        setSuccessMsg("Logged in successfully! Redirecting...");
      }
    } catch (err: unknown) {
      // Next.js redirect throws a special error when redirecting
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        setSuccessMsg("Logged in successfully! Redirecting...");
        return;
      }
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setServerError(
        msg.includes("fetch failed")
          ? "Gagal terhubung ke server Supabase. Pastikan project Supabase aktif (tidak paused) dan URL di .env.local benar."
          : msg
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full border-border/60 bg-card/80 backdrop-blur-sm shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your credentials to access your Mentis dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isSubmitting}
              {...register("email")}
              className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isSubmitting}
              {...register("password")}
              className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full gap-2 font-semibold shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </Button>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
