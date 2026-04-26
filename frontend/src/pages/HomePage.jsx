import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ChatBubbleOutlineRounded from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRounded from "@mui/icons-material/FavoriteBorderRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";

const notes = [
  {
    icon: <SchoolRounded />,
    title: "Learn from real experience",
    text: "Talk with people who have already walked through the choices you are facing.",
  },
  {
    icon: <ChatBubbleOutlineRounded />,
    title: "Ask for a focused session",
    text: "Share what you are working on and request time with a mentor who fits.",
  },
  {
    icon: <FavoriteBorderRounded />,
    title: "Keep it generous",
    text: "Free Mentors is built around people giving time, clarity, and encouragement.",
  },
];

const mentorFaces = [
  { initials: "AK", name: "Amina", role: "Frontend mentor" },
  { initials: "ND", name: "Neo", role: "Career guidance" },
  { initials: "TM", name: "Tariro", role: "Product thinking" },
];

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const primaryPath = user ? "/app" : "/signup";

  return (
    <Box>
      <Box
        sx={{
          minHeight: { xs: "auto", md: "86vh" },
          display: "flex",
          alignItems: "center",
          bgcolor: "#fbfaf7",
          pt: { xs: 5, md: 8 },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 5, md: 8 },
              alignItems: "center",
            }}
          >
            <Box>
              <Stack spacing={3}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.45rem", md: "4.2rem" },
                    color: "text.primary",
                    maxWidth: 680,
                  }}
                >
                  Free Mentors
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.55,
                    maxWidth: 620,
                    fontWeight: 400,
                  }}
                >
                  Find someone kind, experienced, and willing to help you think
                  through your next step.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button
                    component={RouterLink}
                    to={primaryPath}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardRounded />}
                  >
                    {user ? "Open my space" : "Start with a mentor"}
                  </Button>
                  <Button
                    component={RouterLink}
                    to={user ? "/app/mentors" : "/signin"}
                    variant="outlined"
                    size="large"
                  >
                    {user ? "See mentors" : "I already have an account"}
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Box>
              <Box
                sx={{
                  minHeight: { xs: 360, md: 520 },
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  backgroundImage:
                    "linear-gradient(180deg, rgba(24,33,47,0.08), rgba(24,33,47,0.54)), url('/images/auth/auth_1.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    bottom: 24,
                    color: "#ffffff",
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="h4" sx={{ maxWidth: 430 }}>
                      A good conversation can change the shape of a week.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {mentorFaces.map((mentor) => (
                        <Avatar
                          key={mentor.initials}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.92)",
                            color: "primary.main",
                            fontWeight: 700,
                            border: "2px solid rgba(255,255,255,0.5)",
                          }}
                        >
                          {mentor.initials}
                        </Avatar>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "#ffffff", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {notes.map((item) => (
              <Box key={item.title}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Avatar
                        sx={{ bgcolor: "primary.main", color: "#ffffff" }}
                      >
                        {item.icon}
                      </Avatar>
                      <Typography variant="h5">{item.title}</Typography>
                      <Typography color="text.secondary">{item.text}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
