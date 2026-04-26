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
import { signUp } from "../features/auth/authSlice";

export default function SignUpPage() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    signupGoal: "mentee",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const fields = useMemo(
    () => [
      {
        name: "signupGoal",
        label: "I want to",
        value: form.signupGoal,
        onChange: (event) => setForm({ ...form, signupGoal: event.target.value }),
        select: true,
        helperText:
          "Choose whether you want to become a mentor or find a mentor.",
        options: [
          { value: "mentor", label: "Become a mentor" },
          { value: "mentee", label: "Find a mentor" },
        ],
      },
      {
        name: "firstName",
        label: "First name",
        value: form.firstName,
        onChange: (event) => setForm({ ...form, firstName: event.target.value }),
      },
      {
        name: "lastName",
        label: "Last name",
        value: form.lastName,
        onChange: (event) => setForm({ ...form, lastName: event.target.value }),
      },
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
      <Card sx={{ maxWidth: 620, mx: "auto" }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Chip label="Join Free Mentors" color="secondary" sx={{ width: "fit-content" }} />
            <Stack spacing={1}>
              <Typography variant="h3">Start with the kind of help you need</Typography>
              <Typography color="text.secondary">
                Join as someone looking for guidance, or offer your time as a mentor.
              </Typography>
            </Stack>
            <AuthForm
              fields={fields}
              loading={status === "loading"}
              error={error}
              submitLabel="Create account"
              onSubmit={(event) => {
                event.preventDefault();
                dispatch(signUp(form));
              }}
            />
            <Typography color="text.secondary">
              Already have an account?{" "}
              <Typography
                component={RouterLink}
                to="/signin"
                sx={{ color: "primary.main", textDecoration: "none", fontWeight: 700 }}
              >
                Sign in
              </Typography>
              .
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
