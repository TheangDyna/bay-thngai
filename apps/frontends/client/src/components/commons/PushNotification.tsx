import { Switch } from "@/components/ui/switch";
import { config } from "@/configs/config";
import axiosInstance from "@/utils/axiosInstance";
import { urlBase64ToUint8Array } from "@/utils/pushNotifications";
import React, { useEffect, useState } from "react";

export const PushNotification: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [endpoint, setEndpoint] = useState<string>("");
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

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
            await axiosInstance.get(`/push/check/${encodeURIComponent(ep)}`);
            setIsSubscribed(true);
          } catch {
            console.warn(
              "Server doesn't recognize this endpoint anymore; cleaning up locally."
            );
            await sub.unsubscribe();
            setIsSubscribed(false);
            setEndpoint("");
          }
        } else {
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
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm">Enable Notifications</h3>
        <p className="text-xs text-gray-500">
          Receive updates about orders & promotions
        </p>
      </div>
      <Switch
        checked={isSubscribed}
        onCheckedChange={(checked) => {
          if (checked) subscribe();
          else unsubscribe();
        }}
        disabled={loading || initializing}
      />
    </div>
  );
};
