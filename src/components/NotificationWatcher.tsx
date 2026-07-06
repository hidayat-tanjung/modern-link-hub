import { useEffect, useRef, useCallback } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Ban, Info } from "lucide-react";

const notificationIcons: Record<string, React.ReactNode> = {
  payment_completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  payment_failed: <XCircle className="w-4 h-4 text-red-500" />,
  payment_cancelled: <Ban className="w-4 h-4 text-slate-500" />,
  info: <Info className="w-4 h-4 text-primary" />,
};

const notificationColors: Record<string, string> = {
  payment_completed: "border-l-green-500",
  payment_failed: "border-l-red-500",
  payment_cancelled: "border-l-slate-500",
  info: "border-l-primary",
};

export function NotificationWatcher() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const unreadNotifications = useQuery(api.notifications.unread);
  const seenIds = useRef<Set<string>>(new Set());
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (!isAuthenticated || !unreadNotifications) return;

    // Check for new notifications we haven't seen yet
    for (const notif of unreadNotifications) {
      if (!seenIds.current.has(notif._id)) {
        seenIds.current.add(notif._id);

        // Show toast
        const icon = notificationIcons[notif.type] ?? notificationIcons.info;
        const borderColor = notificationColors[notif.type] ?? "border-l-primary";

        toast(
          <div className={`flex items-start gap-3 border-l-2 ${borderColor} pl-3 -ml-1`}>
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{notif.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
            </div>
          </div>,
          {
            duration: 6000,
            action: notif.link
              ? {
                  label: "View",
                  onClick: () => navigateRef.current(notif.link!),
                }
              : undefined,
          },
        );
      }
    }

    // Clean up old seen IDs (keep only last 50)
    if (seenIds.current.size > 100) {
      const ids = Array.from(seenIds.current);
      const toRemove = ids.slice(0, ids.length - 50);
      toRemove.forEach((id) => seenIds.current.delete(id));
    }
  }, [isAuthenticated, unreadNotifications]);

  return null;
}
