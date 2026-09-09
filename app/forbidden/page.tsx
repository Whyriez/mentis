import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 Forbidden | Mentis Admin",
  description: "Access denied. Admin privileges required.",
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">403 Forbidden</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You do not have administrative privileges to access this page. Please contact your system administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto font-bold gap-2">
              <Home className="h-4 w-4" />
              Return to User Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold gap-2">
              <ArrowLeft className="h-4 w-4" />
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
