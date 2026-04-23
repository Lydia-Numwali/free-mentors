import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
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
        helperText:
          "Choose whether you want to mentor others or you are looking for a mentor.",
        value: form.signupGoal,
        onChange: (e) => setForm({ ...form, signupGoal: e.target.value }),
        select: true,
        options: [
          { value: "mentor", label: "Become a mentor" },
          { value: "mentee", label: "Find a mentor" },
        ],
      },
      {
        name: "firstName",
        label: "First name",
        value: form.firstName,
        onChange: (e) => setForm({ ...form, firstName: e.target.value }),
      },
      {
        name: "lastName",
        label: "Last name",
        value: form.lastName,
        onChange: (e) => setForm({ ...form, lastName: e.target.value }),
      },
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
    return <Navigate to={user.role === "admin" ? "/admin" : user.signupGoal === "mentee" ? "/mentors" : "/portal"} replace />;
  }

  return (
    <Card sx={{ maxWidth: 560, mx: "auto" }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4">Sign up</Typography>
          <Typography color="text.secondary">
            Create your account, choose whether you want to mentor or find a mentor, and continue through the matching flow.
          </Typography>
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
        </Stack>
      </CardContent>
    </Card>
  );
}
