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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import StatCard from "../components/StatCard";
import {
  clearAdminFeedback,
  fetchAdminOverview,
  hideReview,
  promoteApplicant,
} from "../features/admin/adminSlice";

export default function AdminPage() {
  const dispatch = useDispatch();
  const { users, pendingApplicants, reviews, error, success } = useSelector(
    (state) => state.admin
  );
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    bio: "",
    expertise: "",
  });

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h3">Community care</Typography>
        <Typography color="text.secondary">
          Welcome new mentors, check public reviews, and keep the community feeling safe.
        </Typography>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        <StatCard
          eyebrow="Pending applications"
          value={pendingApplicants.length}
          label="People who want to mentor"
        />
        <StatCard
          eyebrow="Total accounts"
          value={users.length}
          label="People in Free Mentors"
        />
        <StatCard
          eyebrow="Reviews"
          value={reviews.filter((review) => review.isVisible).length}
          label="Reviews currently public"
        />
      </Box>

      <Stack spacing={2}>
        <Typography variant="h5">People waiting to mentor</Typography>
        {pendingApplicants.length ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {pendingApplicants.map((entry) => (
              <Card key={entry.id}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6">
                      {entry.firstName} {entry.lastName}
                    </Typography>
                    <Typography color="text.secondary">{entry.email}</Typography>
                    <Chip
                      label="Pending approval"
                      color="warning"
                      sx={{ width: "fit-content" }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(clearAdminFeedback());
                        setSelected(entry);
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
          <Alert severity="info">
            Nobody is waiting for review right now.
          </Alert>
        )}
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h5">Members</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 3,
          }}
        >
          {users.map((entry) => (
            <Card key={entry.id}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="h6">
                    {entry.firstName} {entry.lastName}
                  </Typography>
                  <Typography color="text.secondary">{entry.email}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={entry.role === "user" ? "mentee" : entry.role}
                      color={entry.role === "mentor" ? "success" : "default"}
                    />
                    <Chip
                      label={entry.mentorApplicationStatus}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h5">Reviews</Typography>
        {reviews.length ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {reviews.map((review) => (
              <Card key={review.id} variant="outlined">
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Typography variant="h6">{review.rating}/5</Typography>
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
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={!review.isVisible}
                      onClick={() => dispatch(hideReview(review.id))}
                    >
                      Hide
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
              label="A short mentor bio"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              multiline
              minRows={3}
            />
            <TextField
              label="Expertise"
              value={form.expertise}
              onChange={(event) =>
                setForm({ ...form, expertise: event.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await dispatch(
                promoteApplicant({
                  userId: selected.id,
                  bio: form.bio,
                  expertise: form.expertise,
                })
              );
              setSelected(null);
              setForm({ bio: "", expertise: "" });
            }}
          >
            Approve mentor
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
