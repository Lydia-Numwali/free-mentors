import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../app/graphqlClient";

const sessionFields = `
  id
  requestId
  agenda
  message
  status
  mentor {
    id
    firstName
    lastName
  }
  mentee {
    id
    firstName
    lastName
  }
  review {
    id
    rating
    comment
    isVisible
  }
`;

export const fetchMySessions = createAsyncThunk(
  "sessions/fetchMine",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const data = await graphqlRequest(
        `
          query MySessions {
            mySessions {
              ${sessionFields}
            }
          }
        `,
        {},
        token
      );

      return data.mySessions;
    } catch (error) {
      return rejectWithValue(error.message || "Could not load sessions.");
    }
  }
);

export const createSessionRequest = createAsyncThunk(
  "sessions/createRequest",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const data = await graphqlRequest(
        `
          mutation CreateSessionRequest($input: SessionRequestInput!) {
            createSessionRequest(input: $input) {
              ${sessionFields}
            }
          }
        `,
        { input: payload },
        token
      );

      return data.createSessionRequest;
    } catch (error) {
      return rejectWithValue(error.message || "Could not create the request.");
    }
  }
);

export const updateSessionStatus = createAsyncThunk(
  "sessions/updateStatus",
  async ({ sessionId, decision }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const field =
        decision === "accepted" ? "acceptSessionRequest" : "declineSessionRequest";
      const data = await graphqlRequest(
        `
          mutation UpdateSession($sessionId: ID!) {
            ${field}(sessionId: $sessionId) {
              id
              status
            }
          }
        `,
        { sessionId },
        token
      );

      return data[field];
    } catch (error) {
      return rejectWithValue(error.message || "Could not update this session.");
    }
  }
);

export const createReview = createAsyncThunk(
  "sessions/createReview",
  async ({ sessionId, rating, comment }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const data = await graphqlRequest(
        `
          mutation CreateReview($input: CreateReviewInput!) {
            createReview(input: $input) {
              id
              rating
              comment
              isVisible
            }
          }
        `,
        {
          input: {
            sessionId,
            rating,
            comment,
          },
        },
        token
      );

      return {
        sessionId,
        review: data.createReview,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Could not save the review.");
    }
  }
);

const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    items: [],
    status: "idle",
    error: "",
    success: "",
  },
  reducers: {
    clearSessionFeedback(state) {
      state.error = "";
      state.success = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySessions.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchMySessions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMySessions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Could not load sessions.";
      })
      .addCase(createSessionRequest.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.success = "Mentorship request sent.";
        state.error = "";
      })
      .addCase(createSessionRequest.rejected, (state, action) => {
        state.error = action.payload || "Could not create the request.";
        state.success = "";
      })
      .addCase(updateSessionStatus.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status }
            : item
        );
        state.success = "Session status updated.";
        state.error = "";
      })
      .addCase(updateSessionStatus.rejected, (state, action) => {
        state.error = action.payload || "Could not update the session.";
        state.success = "";
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.sessionId
            ? { ...item, review: action.payload.review }
            : item
        );
        state.success = "Review submitted successfully.";
        state.error = "";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload || "Could not save the review.";
        state.success = "";
      });
  },
});

export const { clearSessionFeedback } = sessionsSlice.actions;
export default sessionsSlice.reducer;
