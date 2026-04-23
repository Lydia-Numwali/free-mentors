import { AppBar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../features/auth/authSlice";

const roleLabel = {
  admin: "Admin",
  mentor: "Mentor",
  user: "End user",
};

export default function Layout() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(11,110,79,0.16), transparent 26%), radial-gradient(circle at top right, rgba(230,153,44,0.16), transparent 24%), linear-gradient(180deg, #f3f0e8 0%, #ffffff 100%)",
      }}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between", py: 1.5, gap: 2, alignItems: { xs: "flex-start", md: "center" }, flexWrap: "wrap" }}>
          <Stack spacing={0.75}>
            <Typography component={RouterLink} to="/" variant="h6" sx={{ color: "primary.main", textDecoration: "none", fontWeight: 700 }}>
              Free Mentors
            </Typography>
            {user ? <Chip label={roleLabel[user.role] || user.role} size="small" variant="outlined" sx={{ width: "fit-content" }} /> : null}
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            {user ? (
              <>
                <Button component={RouterLink} to="/portal" color="inherit">
                  Dashboard
                </Button>
                <Button component={RouterLink} to="/mentors" color="inherit">
                  Mentors
                </Button>
                <Button component={RouterLink} to="/sessions" color="inherit">
                  Sessions
                </Button>
                {user.role === "admin" ? (
                  <Button component={RouterLink} to="/admin" color="inherit">
                    Admin
                  </Button>
                ) : null}
                <Button onClick={() => dispatch(signOut())} variant="contained">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/signin" color="inherit">
                  Sign in
                </Button>
                <Button component={RouterLink} to="/signup" variant="contained">
                  Create account
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
