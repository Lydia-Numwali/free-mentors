import { Alert, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { fetchMentors } from "../features/mentors/mentorsSlice";

export default function MentorsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, status, error } = useSelector((state) => state.mentors);

  useEffect(() => {
    if (user) {
      dispatch(fetchMentors());
    }
  }, [dispatch, user]);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h3">Available mentors</Typography>
      <Typography color="text.secondary">
        Browse approved mentors and open a profile to request a mentorship appointment.
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        {items.map((mentor) => (
          <Card key={mentor.id} sx={{ height: "100%" }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5">
                  {mentor.firstName} {mentor.lastName}
                </Typography>
                <Typography color="primary.main">{mentor.expertise || "General mentorship"}</Typography>
                <Typography color="text.secondary">{mentor.bio || "This mentor is ready to support a learner."}</Typography>
                <Button component={RouterLink} to={`/mentors/${mentor.id}`} variant="contained">
                  View profile
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
      {status === "succeeded" && items.length === 0 ? (
        <Alert severity="info">No mentors are available yet.</Alert>
      ) : null}
    </Stack>
  );
}
