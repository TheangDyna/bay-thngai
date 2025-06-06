// src/components/PushNotification/PushNotification.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/configs/config";
import axiosInstance from "@/utils/axiosInstance";
import { urlBase64ToUint8Array } from "@/utils/pushNotifications";
import React, { useEffect, useState } from "react";

const PushNotification: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // Store the exact endpoint so we can DELETE it later
  const [endpoint, setEndpoint] = useState<string>("");

  // Disable buttons until the initial SW + backend check completes
  const [initializing, setInitializing] = useState(true);

  // Tracks subscribe/unsubscribe API calls
  const [loading, setLoading] = useState(false);

  // 1️⃣ On mount: register SW and reconcile with backend
  useEffect(() => {
    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      console.warn("Browser does not support Push notifications.");
      setInitializing(false);
      return;
    }

    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        setRegistration(reg);
        return reg.pushManager.getSubscription();
      })
      .then(async (sub) => {
        if (sub) {
          const ep = sub.endpoint;
          setEndpoint(ep);

          try {
            // Ask backend if this endpoint still exists
            await axiosInstance.get(`/push/check/${encodeURIComponent(ep)}`);
            setIsSubscribed(true);
          } catch {
            // Backend no longer has it → clean up locally
            console.warn(
              "Server doesn't recognize this endpoint anymore; cleaning up locally."
            );
            await sub.unsubscribe();
            setIsSubscribed(false);
            setEndpoint("");
          }
        } else {
          // No local subscription → unsubscribed
          setIsSubscribed(false);
          setEndpoint("");
        }
      })
      .catch((err) => {
        console.error("SW registration or getSubscription failed:", err);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  // 2️⃣ Subscribe handler
  const subscribe = async () => {
    if (!registration) return;
    setLoading(true);

    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey)
      });
      const subJSON = sub.toJSON();

      await axiosInstance.post("/push", subJSON);

      setIsSubscribed(true);
      setEndpoint(subJSON.endpoint ?? "");
    } catch (err) {
      console.error("Subscribe error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Unsubscribe handler
  const unsubscribe = async () => {
    if (!registration) return;
    setLoading(true);

    try {
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await axiosInstance.delete(`/push/${encodeURIComponent(endpoint)}`);
      }
      setIsSubscribed(false);
      setEndpoint("");
    } catch (err) {
      console.error("Error during unsubscribe:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto my-6">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>

        <Button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={loading || initializing}
          variant={isSubscribed ? "destructive" : "default"}
          className="w-full"
        >
          {initializing
            ? "Checking..."
            : loading
              ? isSubscribed
                ? "Disabling…"
                : "Enabling…"
              : isSubscribed
                ? "Disable Notifications"
                : "Enable Notifications"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PushNotification;
