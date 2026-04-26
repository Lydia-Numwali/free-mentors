import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearSelectedMentor, fetchMentor } from "../features/mentors/mentorsSlice";
import {
  clearSessionFeedback,
  createSessionRequest,
} from "../features/sessions/sessionsSlice";

export default function MentorDetailsPage() {
  const { mentorId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const mentorState = useSelector((state) => state.mentors);
  const sessionState = useSelector((state) => state.sessions);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    agenda: "",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchMentor(mentorId));

    return () => {
      dispatch(clearSelectedMentor());
    };
  }, [dispatch, mentorId]);

  const mentor = mentorState.selected;

  return (
    <Stack spacing={3}>
      {sessionState.error ? <Alert severity="error">{sessionState.error}</Alert> : null}
      {sessionState.success ? (
        <Alert severity="success">{sessionState.success}</Alert>
      ) : null}

      {mentorState.detailStatus === "loading" ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : null}

      {mentorState.error && mentorState.detailStatus === "failed" ? (
        <Alert severity="error">{mentorState.error}</Alert>
      ) : null}

      {mentor ? (
        <>
          <Card>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" },
                  gap: 3,
                }}
              >
                <Stack spacing={2}>
                  <Chip label="Mentor" color="primary" sx={{ width: "fit-content" }} />
                  <Typography variant="h3">
                    {mentor.firstName} {mentor.lastName}
                  </Typography>
                  <Typography color="primary.main" variant="h6">
                    {mentor.expertise || "General mentorship"}
                  </Typography>
                  <Typography color="text.secondary">
                    {mentor.bio || "Ready to listen, share experience, and help you think clearly."}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    background: "#ffffff",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                    <Stack spacing={2}>
                      <Typography variant="overline" color="text.secondary">
                        Reach out
                      </Typography>
                      <Typography>{mentor.email}</Typography>
                      <Button
                        variant="contained"
                        onClick={() => {
                          dispatch(clearSessionFeedback());
                          setOpen(true);
                        }}
                        disabled={user?.role !== "user"}
                      >
                        Ask for a session
                      </Button>
                      {user?.role !== "user" ? (
                        <Alert severity="info">
                          Only mentees can ask for a new session.
                        </Alert>
                      ) : null}
                    </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={2}>
                <Typography variant="h5">What mentees have shared</Typography>
                {mentor.reviews?.length ? (
                  mentor.reviews.map((review, index) => (
                    <Stack key={review.id} spacing={1.25}>
                      {index > 0 ? <Divider /> : null}
                      <Typography variant="subtitle1">
                        Rating: {review.rating}/5
                      </Typography>
                      <Typography color="text.secondary">{review.comment}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Shared by {review.mentee?.firstName} {review.mentee?.lastName}
                      </Typography>
                    </Stack>
                  ))
                ) : (
                  <Alert severity="info">
                    No reviews have been shared yet.
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Ask for a session</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="What would you like to talk about?"
              value={form.agenda}
              onChange={(event) => setForm({ ...form, agenda: event.target.value })}
              required
            />
            <TextField
              label="A short message"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              multiline
              minRows={4}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await dispatch(createSessionRequest({ mentorId, ...form }));
              setOpen(false);
              setForm({ agenda: "", message: "" });
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
