import React from "react";
import { AlertCircle, FileX, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import { Card, CardContent } from "./card";

export function LoadingState({ message = "Loading content..." }: { message?: string }) {
  return (
    <div className="space-y-4 max-w-3xl mx-auto py-8">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <p className="text-center text-xs text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "No Items Found",
  description = "There are no lessons or questions available at the moment.",
  onAction,
  actionLabel = "Return",
}: {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <Card className="border-dashed border-border/80 p-8 text-center max-w-md mx-auto my-12 space-y-4">
      <CardContent className="pt-4 space-y-3">
        <FileX className="h-10 w-10 text-muted-foreground mx-auto" />
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        {onAction && (
          <Button onClick={onAction} variant="outline" size="sm" className="font-semibold">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an issue fetching your learning data. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-destructive/40 bg-destructive/5 p-8 text-center max-w-md mx-auto my-12 space-y-4">
      <CardContent className="pt-4 space-y-3">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="destructive" size="sm" className="gap-2 font-semibold">
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
