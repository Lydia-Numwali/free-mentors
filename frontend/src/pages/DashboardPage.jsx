import { useEffect } from "react";
import { Alert, Box, Button, Chip, Stack, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StatCard from "../components/StatCard";
import { fetchMentors } from "../features/mentors/mentorsSlice";
import { fetchMySessions } from "../features/sessions/sessionsSlice";
import { fetchAdminOverview } from "../features/admin/adminSlice";
import { dashboardCopy, getRoleLabel } from "../utils/role";

function countByStatus(items, status) {
  return items.filter((item) => item.status === status).length;
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const mentors = useSelector((state) => state.mentors.items);
  const sessions = useSelector((state) => state.sessions.items);
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchMentors());

    if (user?.role !== "admin") {
      dispatch(fetchMySessions());
    }

    if (user?.role === "admin") {
      dispatch(fetchAdminOverview());
    }
  }, [dispatch, user?.role]);

  const content = dashboardCopy[user?.role] || dashboardCopy.user;
  const mentorApprovalPending =
    user?.role === "user" &&
    user?.signupGoal === "mentor" &&
    user?.mentorApplicationStatus === "pending";

  const statsByRole = {
    admin: [
      {
        eyebrow: "Waiting",
        value: admin.pendingApplicants.length,
        label: "People who want to mentor",
      },
      {
        eyebrow: "Mentors",
        value: mentors.length,
        label: "People ready to help",
      },
      {
        eyebrow: "Reviews",
        value: admin.reviews.filter((review) => review.isVisible).length,
        label: "Helpful notes from mentees",
      },
    ],
    mentor: [
      {
        eyebrow: "New requests",
        value: countByStatus(sessions, "pending"),
        label: "People hoping to meet with you",
      },
      {
        eyebrow: "Accepted",
        value: countByStatus(sessions, "accepted"),
        label: "Conversations you said yes to",
      },
      {
        eyebrow: "Mentors",
        value: mentors.length,
        label: "Other people giving their time",
      },
    ],
    user: [
      {
        eyebrow: "Mentors",
        value: mentors.length,
        label: "People you can reach out to",
      },
      {
        eyebrow: "Waiting",
        value: countByStatus(sessions, "pending"),
        label: "Messages waiting for a reply",
      },
      {
        eyebrow: "Reviews",
        value: sessions.filter((session) => Boolean(session.review)).length,
        label: "Mentors you have thanked",
      },
    ],
  };

  const actionsByRole = {
    admin: [
      { label: "Review applications", to: "/app/admin" },
      { label: "See mentors", to: "/app/mentors" },
    ],
    mentor: [
      { label: "See requests", to: "/app/sessions" },
      { label: "Meet other mentors", to: "/app/mentors" },
    ],
    user: [
      { label: "Find a mentor", to: "/app/mentors" },
      { label: "My conversations", to: "/app/sessions" },
    ],
  };

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" },
          gap: 3,
          alignItems: "center",
          py: { xs: 1, md: 2 },
        }}
      >
        <Stack spacing={2.5}>
          <Chip label={getRoleLabel(user?.role)} color="primary" sx={{ width: "fit-content" }} />
          <Typography variant="h3">{content.title}</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
            {content.description}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            {actionsByRole[user?.role || "user"].map((action) => (
              <Button
                key={action.to}
                component={RouterLink}
                to={action.to}
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Box
          sx={{
            background: "linear-gradient(135deg, #18212f 0%, #31445f 100%)",
            color: "#ffffff",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.72)" }}>
              Signed in
            </Typography>
            <Typography variant="h5">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.74)" }}>
              {user?.email}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {mentorApprovalPending ? (
        <Alert severity="info">
          Your mentor profile is waiting for review. You can still explore mentors
          while the community team takes a look.
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {statsByRole[user?.role || "user"].map((stat) => (
          <StatCard key={stat.eyebrow} {...stat} />
        ))}
      </Box>
    </Stack>
  );
}
