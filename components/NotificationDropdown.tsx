"use client";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // FIX: All fetch logic moved INSIDE useEffect to prevent dependency loops
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          // Only update state if component is still mounted
          if (isMounted) {
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => !n.isRead).length);
          }
        }
      } catch (e) {
        console.error("Error fetching notifications:", e);
      }
    };

    // 1. Initial Fetch
    fetchNotifications();

    // 2. Set up polling (every 30s)
    const intervalId = setInterval(fetchNotifications, 30000);

    // 3. Cleanup function
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array = runs only once on mount

  // Handle opening dropdown
  const toggleOpen = async () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    // If opening and there are unread messages, mark them read
    if (nextState && unreadCount > 0) {
      try {
        // Optimistic UI update (feels faster)
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        
        // Background API call
        await fetch("/api/notifications", { method: "PATCH" });
      } catch (e) {
        console.error("Failed to mark read:", e);
      }
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL BUTTON */}
      <button 
        onClick={toggleOpen} 
        className="relative p-2 text-[#FFB368] hover:text-[#FFECDC] transition rounded-full hover:bg-[#3B1E11]"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-[#1a0e0f]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN LIST */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#2A1710] border border-[#4B3329] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="px-4 py-3 border-b border-[#4B3329] bg-[#1F100C]">
            <h3 className="text-sm font-bold text-[#FFECDC]">Notifications</h3>
          </div>
          
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#D9A47E]">
                No new notifications. 🌙
              </div>
            ) : (
              notifications.map((note) => (
                <Link 
                  href={note.link} 
                  key={note._id}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 border-b border-[#3D2326] last:border-0 hover:bg-[#3B251C] transition ${
                    !note.isRead ? "bg-[#331C15]" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-semibold ${!note.isRead ? "text-[#FFB368]" : "text-[#D9A47E]"}`}>
                      {note.title}
                    </span>
                    <span className="text-[10px] text-[#8A6A5C] whitespace-nowrap ml-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#C4A489] line-clamp-2">
                    {note.message}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}