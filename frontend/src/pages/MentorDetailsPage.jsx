import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { fetchMentor } from "../features/mentors/mentorsSlice";
import { clearSessionFeedback, createSessionRequest } from "../features/sessions/sessionsSlice";

export default function MentorDetailsPage() {
  const { mentorId } = useParams();
  const dispatch = useDispatch();
  const mentor = useSelector((state) => state.mentors.selected);
  const auth = useSelector((state) => state.auth);
  const sessions = useSelector((state) => state.sessions);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ agenda: "", message: "" });

  useEffect(() => {
    if (auth.user) {
      dispatch(fetchMentor(mentorId));
    }
  }, [auth.user, dispatch, mentorId]);

  if (!auth.user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <Stack spacing={3}>
      {sessions.error ? <Alert severity="error">{sessions.error}</Alert> : null}
      {sessions.success ? <Alert severity="success">{sessions.success}</Alert> : null}
      {mentor ? (
        <>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={2}>
                <Typography variant="h3">
                  {mentor.firstName} {mentor.lastName}
                </Typography>
                <Typography color="primary.main">{mentor.expertise}</Typography>
                <Typography color="text.secondary">{mentor.bio}</Typography>
                <Typography>Email: {mentor.email}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    dispatch(clearSessionFeedback());
                    setOpen(true);
                  }}
                  disabled={auth.user.role !== "user"}
                >
                  Request mentorship session
                </Button>
                {auth.user.role !== "user" ? (
                  <Alert severity="info">Only end users looking for mentors can create new session requests.</Alert>
                ) : null}
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Visible reviews</Typography>
                {mentor.reviews?.length ? (
                  mentor.reviews.map((review, index) => (
                    <Stack key={review.id} spacing={1}>
                      {index > 0 ? <Divider /> : null}
                      <Typography variant="subtitle1">{`Rating: ${review.rating}/5`}</Typography>
                      <Typography color="text.secondary">{review.comment}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Shared by {review.mentee?.firstName} {review.mentee?.lastName}
                      </Typography>
                    </Stack>
                  ))
                ) : (
                  <Alert severity="info">No visible reviews have been published for this mentor yet.</Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Request mentorship session</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Agenda"
              value={form.agenda}
              onChange={(event) => setForm({ ...form, agenda: event.target.value })}
              required
            />
            <TextField
              label="Message"
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
            Send request
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
