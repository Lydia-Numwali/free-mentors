import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../app/graphqlClient";

const stored = localStorage.getItem("free-mentors-auth");
const parsed = stored ? JSON.parse(stored) : { token: "", user: null };

const authFragment = `
  fragment AuthFields on AuthPayload {
    token
    user {
      id
      firstName
      lastName
      email
      role
      signupGoal
      mentorApplicationStatus
      bio
      expertise
    }
  }
`;

export const signUp = createAsyncThunk("auth/signUp", async (form) => {
  const query = `
    ${authFragment}
    mutation SignUp($input: SignUpInput!) {
      signUp(input: $input) {
        ...AuthFields
      }
    }
  `;
  const data = await graphqlRequest(query, {
    input: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      signupGoal: form.signupGoal || "mentee",
    },
  });
  return data.signUp;
});

export const signIn = createAsyncThunk("auth/signIn", async (form) => {
  const query = `
    ${authFragment}
    mutation SignIn($email: String!, $password: String!) {
      signIn(email: $email, password: $password) {
        ...AuthFields
      }
    }
  `;
  const data = await graphqlRequest(query, {
    email: form.email,
    password: form.password,
  });
  return data.signIn;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: parsed.token,
    user: parsed.user,
    status: "idle",
    error: "",
  },
  reducers: {
    signOut(state) {
      state.token = "";
      state.user = null;
      localStorage.removeItem("free-mentors-auth");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("free-mentors-auth", JSON.stringify(action.payload));
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to sign up.";
      })
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("free-mentors-auth", JSON.stringify(action.payload));
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to sign in.";
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
