"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MarketplaceListing } from "@/data/marketplace";
import { Language } from "@/lib/i18n";

export interface DiagnosticHistoryItem {
  id: string;
  crop: string;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  region: string;
  woreda: string;
  timestamp: string;
  language: string;
  severity: "low" | "medium" | "high";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "diagnosis" | "marketplace" | "farm" | "system";
  read: boolean;
  link?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  listings: MarketplaceListing[];
  addListing: (listing: Omit<MarketplaceListing, "id">) => void;
  diagnoses: DiagnosticHistoryItem[];
  addDiagnosis: (diagnosis: Omit<DiagnosticHistoryItem, "id" | "timestamp">) => void;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  addNotification: (notification: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Deterministic initial state to ensure server and client match during hydration
  const [language, setLanguageState] = useState<Language>("en");
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [diagnoses, setDiagnoses] = useState<DiagnosticHistoryItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Synchronize stored preferences after hydration on the client
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedLang = localStorage.getItem("gebere_lang") as Language;
        if (storedLang === "en" || storedLang === "om" || storedLang === "am") {
          setLanguageState(storedLang);
        }
        const storedNotes = localStorage.getItem("gebere_notifications");
        if (storedNotes) {
          setNotifications(JSON.parse(storedNotes));
        }
      } catch {
        // Ignore storage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync document html lang attribute with current language selection
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("gebere_lang", lang);
    } catch {
      // Ignore storage errors
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addNotification = (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem("gebere_notifications", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  const addListing = (newListingData: Omit<MarketplaceListing, "id">) => {
    const newListing: MarketplaceListing = {
      ...newListingData,
      id: `lst-${Date.now()}`,
    };
    setListings((prev) => [newListing, ...prev]);
  };

  const addDiagnosis = (newDiagData: Omit<DiagnosticHistoryItem, "id" | "timestamp">) => {
    const newDiag: DiagnosticHistoryItem = {
      ...newDiagData,
      id: `diag-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setDiagnoses((prev) => [newDiag, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        listings,
        addListing,
        diagnoses,
        addDiagnosis,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
