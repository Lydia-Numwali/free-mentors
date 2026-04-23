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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { graphqlRequest } from "../app/graphqlClient";

export default function AdminPage() {
  const { user, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ bio: "", expertise: "" });
  const [feedback, setFeedback] = useState({ error: "", success: "" });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const data = await graphqlRequest(
          `
            query AdminData {
              users {
                id
                firstName
                lastName
                email
                role
                signupGoal
                mentorApplicationStatus
                bio
                expertise
              }
              pendingMentorApplicants {
                id
                firstName
                lastName
                email
                signupGoal
                mentorApplicationStatus
              }
              reviews {
                id
                rating
                comment
                isVisible
                mentor {
                  id
                  firstName
                  lastName
                }
                mentee {
                  id
                  firstName
                  lastName
                }
              }
            }
          `,
          {},
          token
        );
        setUsers(data.users);
        setPendingApplicants(data.pendingMentorApplicants);
        setReviews(data.reviews);
      } catch (error) {
        setFeedback({ error: error.message, success: "" });
      }
    }

    if (user?.role === "admin") {
      loadAdminData();
    }
  }, [token, user]);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/portal" replace />;
  }

  async function promoteUser() {
    try {
      const data = await graphqlRequest(
        `
          mutation Promote($input: PromoteMentorInput!) {
            promoteToMentor(input: $input) {
              id
              role
              bio
              expertise
              mentorApplicationStatus
            }
          }
        `,
        {
          input: {
            userId: selected.id,
            bio: form.bio,
            expertise: form.expertise,
          },
        },
        token
      );

      setUsers((current) =>
        current.map((entry) =>
          entry.id === selected.id
            ? {
                ...entry,
                role: data.promoteToMentor.role,
                bio: data.promoteToMentor.bio,
                expertise: data.promoteToMentor.expertise,
                mentorApplicationStatus: data.promoteToMentor.mentorApplicationStatus,
              }
            : entry
        )
      );
      setPendingApplicants((current) => current.filter((entry) => entry.id !== selected.id));
      setFeedback({ error: "", success: "Mentor application approved." });
      setSelected(null);
      setForm({ bio: "", expertise: "" });
    } catch (error) {
      setFeedback({ error: error.message, success: "" });
    }
  }

  async function hideReview(reviewId) {
    try {
      const data = await graphqlRequest(
        `
          mutation HideReview($reviewId: ID!) {
            hideReview(reviewId: $reviewId) {
              id
              isVisible
            }
          }
        `,
        { reviewId },
        token
      );

      setReviews((current) =>
        current.map((review) =>
          review.id === reviewId ? { ...review, isVisible: data.hideReview.isVisible } : review
        )
      );
      setFeedback({ error: "", success: "Review hidden from mentor pages." });
    } catch (error) {
      setFeedback({ error: error.message, success: "" });
    }
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h3">Admin tools</Typography>
        <Typography color="text.secondary">
          Approve mentor applicants, review all accounts, and hide inappropriate mentor reviews.
        </Typography>
      </Stack>
      {feedback.error ? <Alert severity="error">{feedback.error}</Alert> : null}
      {feedback.success ? <Alert severity="success">{feedback.success}</Alert> : null}

      <Stack spacing={2}>
        <Typography variant="h5">Pending mentor approvals</Typography>
        {pendingApplicants.length ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
            {pendingApplicants.map((entry) => (
              <Card key={entry.id}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      {entry.firstName} {entry.lastName}
                    </Typography>
                    <Typography>{entry.email}</Typography>
                    <Chip label="Pending approval" color="warning" sx={{ width: "fit-content" }} />
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelected(entry);
                        setFeedback({ error: "", success: "" });
                      }}
                    >
                      Approve as mentor
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Alert severity="info">There are no pending mentor applications right now.</Alert>
        )}
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h5">All users</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          {users.map((entry) => (
            <Card key={entry.id}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">
                    {entry.firstName} {entry.lastName}
                  </Typography>
                  <Typography>{entry.email}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={entry.role} sx={{ width: "fit-content" }} color={entry.role === "mentor" ? "success" : "default"} />
                    <Chip label={entry.mentorApplicationStatus} variant="outlined" sx={{ width: "fit-content" }} />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h5">Review moderation</Typography>
        {reviews.length ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 3 }}>
            {reviews.map((review) => (
              <Card key={review.id} variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                      <Typography variant="h6">{review.rating}/5 review</Typography>
                      <Chip
                        label={review.isVisible ? "Visible" : "Hidden"}
                        color={review.isVisible ? "success" : "warning"}
                        sx={{ width: "fit-content" }}
                      />
                    </Stack>
                    <Typography color="text.secondary">{review.comment}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mentor: {review.mentor?.firstName} {review.mentor?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mentee: {review.mentee?.firstName} {review.mentee?.lastName}
                    </Typography>
                    <Button variant="outlined" color="error" disabled={!review.isVisible} onClick={() => hideReview(review.id)}>
                      Hide review
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Alert severity="info">No reviews have been submitted yet.</Alert>
        )}
      </Stack>

      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Approve mentor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Mentor bio"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              multiline
              minRows={3}
            />
            <TextField
              label="Expertise"
              value={form.expertise}
              onChange={(event) => setForm({ ...form, expertise: event.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button variant="contained" onClick={promoteUser}>
            Save mentor profile
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
