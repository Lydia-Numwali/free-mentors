import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../app/graphqlClient";

function readStoredAuth() {
  if (typeof window === "undefined") {
    return { token: "", user: null };
  }

  try {
    const raw = localStorage.getItem("free-mentors-auth");
    return raw ? JSON.parse(raw) : { token: "", user: null };
  } catch {
    return { token: "", user: null };
  }
}

function persistAuth(payload) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("free-mentors-auth", JSON.stringify(payload));
}

function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("free-mentors-auth");
}

const stored = readStoredAuth();

const userFields = `
  id
  firstName
  lastName
  email
  role
  signupGoal
  mentorApplicationStatus
  bio
  expertise
`;

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (form, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(
        `
          mutation SignUp($input: SignUpInput!) {
            signUp(input: $input) {
              token
              user {
                ${userFields}
              }
            }
          }
        `,
        {
          input: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            password: form.password,
            signupGoal: form.signupGoal,
          },
        }
      );

      return data.signUp;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to create account.");
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (form, { rejectWithValue }) => {
    try {
      const data = await graphqlRequest(
        `
          mutation SignIn($email: String!, $password: String!) {
            signIn(email: $email, password: $password) {
              token
              user {
                ${userFields}
              }
            }
          }
        `,
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      return data.signIn;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to sign in.");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const data = await graphqlRequest(
        `
          query Me {
            me {
              ${userFields}
            }
          }
        `,
        {},
        token
      );

      return data.me;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to refresh your session.");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: stored.token || "",
    user: stored.user || null,
    status: "idle",
    error: "",
    initializing: Boolean(stored.token),
  },
  reducers: {
    signOut(state) {
      state.token = "";
      state.user = null;
      state.status = "idle";
      state.error = "";
      state.initializing = false;
      clearStoredAuth();
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
        persistAuth(action.payload);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to create account.";
      })
      .addCase(signIn.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        persistAuth(action.payload);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to sign in.";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.initializing = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
        state.error = "";
        persistAuth({ token: state.token, user: action.payload });
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.initializing = false;
        state.error = action.payload || "Your session has expired.";
        state.user = null;
        state.token = "";
        clearStoredAuth();
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
