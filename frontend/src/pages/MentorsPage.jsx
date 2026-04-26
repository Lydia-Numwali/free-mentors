import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMentors } from "../features/mentors/mentorsSlice";

function formatRating(reviews) {
  if (!reviews?.length) {
    return "New mentor";
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return `${(total / reviews.length).toFixed(1)} / 5`;
}

export default function MentorsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.mentors);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchMentors());
  }, [dispatch]);

  const filteredMentors = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((mentor) =>
      [mentor.firstName, mentor.lastName, mentor.expertise, mentor.bio]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [items, query]);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h3">Find a mentor</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Search by name or skill, then ask for a conversation when someone feels
            like the right fit.
          </Typography>
        </Box>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          label="Search"
          placeholder="Name, skill, or topic"
          sx={{ minWidth: { md: 320 } }}
        />
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {status === "loading" ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Box>
                    <Typography variant="h5">
                      {mentor.firstName} {mentor.lastName}
                    </Typography>
                    <Typography color="primary.main">
                      {mentor.expertise || "General mentorship"}
                    </Typography>
                  </Box>
                  <Chip
                    label={formatRating(mentor.reviews)}
                    color="secondary"
                    sx={{ width: "fit-content" }}
                  />
                </Stack>
                <Typography color="text.secondary">
                  {mentor.bio || "Ready to listen, share experience, and help you think clearly."}
                </Typography>
                <Button
                  component={RouterLink}
                  to={`/app/mentors/${mentor.id}`}
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                >
                  Meet {mentor.firstName}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {status === "succeeded" && filteredMentors.length === 0 ? (
        <Alert severity="info">No mentors matched that search.</Alert>
      ) : null}
    </Stack>
  );
}
