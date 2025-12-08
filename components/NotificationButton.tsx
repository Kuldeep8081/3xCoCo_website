"use client";
import { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';

export default function NotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setPermission(Notification.permission);
      
      // Check initial subscription state
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setIsSubscribed(true);
        });
      });
    }
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      // 1. Register Service Worker first
      await navigator.serviceWorker.register('/sw.js');

      // 2. CRITICAL FIX: Wait for the Service Worker to be ready
      const reg = await navigator.serviceWorker.ready;

      // 3. Double check if active
      if (!reg.active) {
        throw new Error("Service Worker not active yet. Please try again.");
      }

      // 4. Subscribe to Push Manager
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("VAPID Public Key missing");

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });

      // 5. Send to Backend
      const res = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (!res.ok) throw new Error("Failed to save subscription on server");

      setIsSubscribed(true);
      alert("Notifications Enabled! 🍫");
    } catch (error: any) {
      console.error("Subscription Error:", error);
      alert(`Error: ${error.message || "Failed to enable notifications."}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper to convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Don't show if denied or already subscribed
  if (isSubscribed || permission === 'denied') return null;

  return (
    <button 
      onClick={subscribe} 
      disabled={loading}
      className="fixed bottom-4 right-4 bg-[#c8924b] text-[#3b241f] p-3 rounded-full shadow-xl hover:bg-[#ffe6c9] transition z-50 flex items-center gap-2 text-sm font-bold animate-bounce"
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : <Bell size={20} />}
      {loading ? "Enabling..." : "Get Updates"}
    </button>
  );
}