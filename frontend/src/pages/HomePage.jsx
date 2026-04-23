import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const highlights = [
  "Users can sign up and sign in",
  "Admins approve mentor applicants and moderate reviews",
  "End users browse mentors and request mentorship sessions",
  "Mentors accept or decline mentorship session requests",
];

export default function HomePage() {
  return (
    <Stack spacing={4}>
      <Card sx={{ overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.5fr 1fr" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Stack spacing={3}>
              <Chip label="Mentor matching platform" color="secondary" sx={{ width: "fit-content" }} />
              <Typography variant="h2">Free Mentors with a simple admin, mentor, and end-user flow.</Typography>
              <Typography color="text.secondary">
                Sign up, choose whether you want to become a mentor or find one, let the admin approve mentors, and manage mentorship requests from one shared system.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button component={RouterLink} to="/signup" variant="contained" size="large">
                  Create account
                </Button>
                <Button component={RouterLink} to="/signin" variant="outlined" size="large">
                  Sign in
                </Button>
              </Stack>
            </Stack>
            <Stack spacing={2}>
              {highlights.map((item) => (
                <Card key={item} variant="outlined">
                  <CardContent>
                    <Typography>{item}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
