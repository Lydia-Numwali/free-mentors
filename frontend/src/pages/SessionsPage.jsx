import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  clearSessionFeedback,
  createReview,
  fetchMySessions,
  updateSessionStatus,
} from "../features/sessions/sessionsSlice";

function statusColor(status) {
  if (status === "accepted") {
    return "success";
  }

  if (status === "declined") {
    return "error";
  }

  return "warning";
}

export default function SessionsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, error, success } = useSelector((state) => state.sessions);
  const [selectedSession, setSelectedSession] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: "5",
    comment: "",
  });

  useEffect(() => {
    dispatch(fetchMySessions());
  }, [dispatch]);

  if (user?.role === "admin") {
    return <Navigate to="/app/admin" replace />;
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h3">
          {user?.role === "mentor" ? "Requests" : "My conversations"}
        </Typography>
        <Typography color="text.secondary">
          {user?.role === "mentor"
            ? "See who has reached out and choose the conversations you can take on."
            : "Follow the people you have contacted and leave a note after a helpful session."}
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}
      {items.length === 0 ? (
        <Alert severity="info">No session requests yet.</Alert>
      ) : null}

      {items.map((session) => (
        <Card key={session.id}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={1.5}
              >
                <Box>
                  <Typography variant="h5">{session.agenda}</Typography>
                </Box>
                <Chip
                  label={session.status}
                  color={statusColor(session.status)}
                  sx={{ width: "fit-content" }}
                />
              </Stack>

              <Typography color="text.secondary">{session.message}</Typography>
              <Typography>
                Mentor: {session.mentor?.firstName} {session.mentor?.lastName}
              </Typography>
              <Typography>
                Mentee: {session.mentee?.firstName} {session.mentee?.lastName}
              </Typography>

              {session.review ? (
                <Alert severity={session.review.isVisible ? "success" : "warning"}>
                  Your review: {session.review.rating}/5.{" "}
                  {session.review.isVisible
                    ? "Thanks for sharing it."
                    : "It is no longer public."}
                </Alert>
              ) : null}

              {user?.role === "mentor" && session.status === "pending" ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      dispatch(clearSessionFeedback());
                      dispatch(
                        updateSessionStatus({
                          sessionId: session.id,
                          decision: "accepted",
                        })
                      );
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      dispatch(clearSessionFeedback());
                      dispatch(
                        updateSessionStatus({
                          sessionId: session.id,
                          decision: "declined",
                        })
                      );
                    }}
                  >
                    Decline
                  </Button>
                </Stack>
              ) : null}

              {user?.role === "user" &&
              session.status === "accepted" &&
              !session.review ? (
                <Button
                  variant="outlined"
                  onClick={() => {
                    dispatch(clearSessionFeedback());
                    setSelectedSession(session);
                  }}
                >
                  Share a review
                </Button>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Share a review</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Rating"
              value={reviewForm.rating}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, rating: event.target.value })
              }
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <MenuItem key={rating} value={String(rating)}>
                  {rating}/5
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Review"
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm({ ...reviewForm, comment: event.target.value })
              }
              multiline
              minRows={4}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSession(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await dispatch(
                createReview({
                  sessionId: selectedSession.id,
                  rating: Number(reviewForm.rating),
                  comment: reviewForm.comment,
                })
              );
              setSelectedSession(null);
              setReviewForm({ rating: "5", comment: "" });
            }}
          >
            Save review
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
