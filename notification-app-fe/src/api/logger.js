import { BASE_URL } from "./config";

export async function logToService(level, message, token = null) {
  const formattedMessage = `[AppLog] [${level.toUpperCase()}] ${message}`;
  console.log(formattedMessage);

  if (!token) {
    return; // Cannot send logs to the service without a token
  }

  const payload = {
    level,
    package: "middleware",
    message,
    stack: "frontend"
  };

  try {
    const res = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      console.warn(`[LogService] Failed to ship log: ${res.status}`);
    }
  } catch (err) {
    console.error("[LogService] Failed to send log:", err.message);
  }
}
