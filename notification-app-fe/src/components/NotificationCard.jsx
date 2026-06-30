import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";

const typeConfig = {
  Placement: {
    icon: <WorkIcon />,
    color: "#2196f3", // Blue
    bg: "#e3f2fd",
  },
  Result: {
    icon: <AssessmentIcon />,
    color: "#ff9800", // Orange
    bg: "#fff3e0",
  },
  Event: {
    icon: <EventIcon />,
    color: "#4caf50", // Green
    bg: "#e8f5e9",
  },
};

export function NotificationCard({ notification }) {
  const type = notification.Type || "Default";
  const config = typeConfig[type] || {
    icon: <NotificationsIcon />,
    color: "#9e9e9e",
    bg: "#f5f5f5",
  };

  // Safe date parsing for "YYYY-MM-DD HH:MM:SS" format
  let dateFormatted = notification.Timestamp;
  try {
    if (notification.Timestamp) {
      const standardDateStr = notification.Timestamp.replace(" ", "T");
      dateFormatted = new Date(standardDateStr).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  } catch (err) {
    console.error("Error formatting timestamp:", err);
  }

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: config.bg, color: config.color }}>
            {config.icon}
          </Avatar>
        }
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              {type} Notification
            </Typography>
            <Chip 
              label={`ID: ${notification.ID ? notification.ID.substring(0, 8) : "N/A"}`} 
              size="small" 
              variant="outlined" 
              sx={{ color: "text.secondary", borderColor: "divider", fontSize: "0.75rem" }} 
            />
          </Box>
        }
        subheader={dateFormatted}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-line" }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}