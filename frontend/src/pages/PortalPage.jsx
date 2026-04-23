import { Alert, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const dashboardCopy = {
  admin: {
    title: "Admin dashboard",
    description:
      "Approve mentor applications, review all users, and hide any review that should not stay public.",
    actions: [
      { label: "Open admin tools", to: "/admin", variant: "contained" },
      { label: "View mentors", to: "/mentors", variant: "outlined" },
    ],
  },
  mentor: {
    title: "Mentor dashboard",
    description:
      "Review incoming mentorship requests, accept or decline them, and keep track of your mentorship sessions.",
    actions: [
      { label: "Open sessions", to: "/sessions", variant: "contained" },
      { label: "View mentor profile list", to: "/mentors", variant: "outlined" },
    ],
  },
  user: {
    title: "End user dashboard",
    description:
      "Browse available mentors, request mentorship sessions, follow up on your session history, and leave reviews after completed sessions.",
    actions: [
      { label: "Explore mentors", to: "/mentors", variant: "contained" },
      { label: "View my sessions", to: "/sessions", variant: "outlined" },
    ],
  },
};

export default function PortalPage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const details = dashboardCopy[user.role] || dashboardCopy.user;
  const mentorApprovalPending =
    user.role === "user" &&
    user.signupGoal === "mentor" &&
    user.mentorApplicationStatus === "pending";

  return (
    <Stack spacing={4}>
      <Card sx={{ overflow: "hidden" }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h3">{details.title}</Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 1 }}>
                {details.description}
              </Typography>
            </Box>

            {mentorApprovalPending ? (
              <Alert severity="info">
                Your mentor application has been submitted. An admin needs to approve you before you can accept or decline mentorship requests.
              </Alert>
            ) : null}

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h5">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color="text.secondary">
                    Signed in as <strong>{user.email}</strong>.
                  </Typography>
                  <Typography color="text.secondary">
                    Current access level: <strong>{user.role}</strong>.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {details.actions.map((action) => (
                      <Button key={action.to} component={RouterLink} to={action.to} variant={action.variant}>
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
