import {
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, Navigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { signIn } from "../features/auth/authSlice";

export default function SignInPage() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const fields = useMemo(
    () => [
      {
        name: "email",
        label: "Email address",
        type: "email",
        value: form.email,
        onChange: (event) => setForm({ ...form, email: event.target.value }),
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        value: form.password,
        onChange: (event) => setForm({ ...form, password: event.target.value }),
      },
    ],
    [form]
  );

  if (user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <Container sx={{ py: { xs: 3, md: 6 } }}>
      <Card sx={{ maxWidth: 560, mx: "auto" }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Chip label="Welcome back" color="primary" sx={{ width: "fit-content" }} />
            <Stack spacing={1}>
              <Typography variant="h3">Welcome back</Typography>
              <Typography color="text.secondary">
                Pick up where you left off with mentors, requests, and conversations.
              </Typography>
            </Stack>
            <AuthForm
              fields={fields}
              loading={status === "loading"}
              error={error}
              submitLabel="Sign in"
              onSubmit={(event) => {
                event.preventDefault();
                dispatch(signIn(form));
              }}
            />
            <Typography color="text.secondary">
              Need an account?{" "}
              <Typography
                component={RouterLink}
                to="/signup"
                sx={{ color: "primary.main", textDecoration: "none", fontWeight: 700 }}
              >
                Create one
              </Typography>
              .
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
