import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
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
        onChange: (e) => setForm({ ...form, email: e.target.value }),
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        value: form.password,
        onChange: (e) => setForm({ ...form, password: e.target.value }),
      },
    ],
    [form]
  );

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/portal"} replace />;
  }

  return (
    <Card sx={{ maxWidth: 560, mx: "auto" }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Sign in</Typography>
          <Typography color="text.secondary">
            Sign in as an admin, mentor, or end user to continue with mentorship requests and reviews.
          </Typography>
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
        </Stack>
      </CardContent>
    </Card>
  );
}
