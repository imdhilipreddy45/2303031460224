import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Pagination,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { NotificationCard } from "../components/NotificationCard.jsx";
import { NotificationFilter } from "../components/NotificationFilter.jsx";
import { useNotifications } from "../hooks/useNotifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const { notifications, totalPages, loading, error } = useNotifications(page, filter);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset page to 1 on filter changes
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          backgroundColor: "#ffffff", 
          borderColor: "divider",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)"
        }}
      >
        {/* Header Block */}
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 2, 
              backgroundColor: "primary.light", 
              color: "primary.main",
              display: "flex",
              alignItems: "center"
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Campus Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay updated with the latest events, results, and placement announcements.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Filter Controls */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
            Filter by Category
          </Typography>
          <NotificationFilter value={filter} onChange={handleFilterChange} />
        </Box>

        {/* Loading State */}
        {loading && (
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              py: 8, 
              gap: 2 
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Fetching campus notifications...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Box sx={{ my: 2 }}>
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Empty State */}
        {!loading && !error && notifications.length === 0 && (
          <Box 
            sx={{ 
              textAlign: "center", 
              py: 8, 
              border: "1px dashed", 
              borderColor: "divider", 
              borderRadius: 2,
              backgroundColor: "#fafafa"
            }}
          >
            <NotificationsIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
              No Notifications Found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              There are no {filter !== "All" ? filter.toLowerCase() : ""} notifications available at this moment.
            </Typography>
          </Box>
        )}

        {/* Notification Cards list */}
        {!loading && !error && notifications.length > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Showing {notifications.length} item(s) on Page {page}
            </Typography>
            <Stack spacing={2}>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.ID || notification.id}
                  notification={notification}
                />
              ))}
            </Stack>

            {/* Pagination Controls */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
              />
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}