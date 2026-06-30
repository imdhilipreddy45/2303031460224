import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications(page = 1, filter = "All") {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchNotifications({ page, notification_type: filter });
        
        if (active) {
          setNotifications(data.notifications ?? []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to fetch notifications");
          setNotifications([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [page, filter]);

  // Dynamically calculate totalPages: if page returns 10 items (the page limit), we assume
  // there could be a next page and set count to page + 1. Otherwise, we cap it at current page.
  const totalPages = notifications.length === 10 ? page + 1 : page;

  return {
    notifications,
    totalPages,
    loading,
    error,
  };
}