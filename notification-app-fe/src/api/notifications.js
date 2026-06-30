import { CLIENT_CREDENTIALS, BASE_URL } from "./config";
import { logToService } from "./logger";

let cachedToken = null;

export async function authenticate() {
  if (cachedToken) return cachedToken;

  const url = `${BASE_URL}/auth`;
  await logToService("info", `Attempting authentication at ${url}`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(CLIENT_CREDENTIALS)
    });

    if (!res.ok) {
      let errorMsg;
      try {
        const errObj = await res.json();
        errorMsg = errObj.message || JSON.stringify(errObj);
      } catch {
        errorMsg = await res.text();
      }
      await logToService("error", `Authentication failed with status ${res.status}: ${errorMsg}`);
      throw new Error(`Authentication failed (${res.status}): ${errorMsg}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    await logToService("info", "Authentication successful. Token acquired.", cachedToken);
    return cachedToken;
  } catch (err) {
    await logToService("error", `Authentication exception: ${err.message}`);
    throw err;
  }
}

export async function fetchNotifications({ page = 1, limit = 10, notification_type = "All" } = {}) {
  let token;
  try {
    token = await authenticate();
  } catch (err) {
    throw new Error(`Auth Error: ${err.message}`, { cause: err });
  }

  const method = "GET";
  let url = `${BASE_URL}/notifications?page=${page}&limit=${limit}`;
  if (notification_type && notification_type !== "All") {
    url += `&notification_type=${notification_type}`;
  }

  await logToService("info", `Request: ${method} ${url}`, token);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      await logToService("error", `Response Status ${res.status}: ${errorText}`, token);
      throw new Error(`Failed to fetch notifications: ${errorText}`);
    }

    const data = await res.json();
    await logToService("info", `Response Status 200: Fetched ${data.notifications?.length || 0} notifications`, token);
    return data;
  } catch (err) {
    await logToService("error", `Request exception: ${err.message}`, token);
    throw err;
  }
}