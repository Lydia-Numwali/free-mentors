import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../app/graphqlClient";

export const fetchMySessions = createAsyncThunk("sessions/fetchMine", async (_, { getState }) => {
  const token = getState().auth.token;
  const query = `
    query MySessions {
      mySessions {
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
      }
    }
  `;
  const data = await graphqlRequest(query, {}, token);
  return data.mySessions;
});

export const createSessionRequest = createAsyncThunk(
  "sessions/createRequest",
  async (payload, { getState }) => {
    const token = getState().auth.token;
    const query = `
      mutation CreateSessionRequest($input: SessionRequestInput!) {
        createSessionRequest(input: $input) {
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
        }
      }
    `;
    const data = await graphqlRequest(query, { input: payload }, token);
    return data.createSessionRequest;
  }
);

export const updateSessionStatus = createAsyncThunk(
  "sessions/updateStatus",
  async ({ sessionId, decision }, { getState }) => {
    const token = getState().auth.token;
    const field = decision === "accepted" ? "acceptSessionRequest" : "declineSessionRequest";
    const query = `
      mutation UpdateStatus($sessionId: ID!) {
        ${field}(sessionId: $sessionId) {
          id
          status
        }
      }
    `;
    const data = await graphqlRequest(query, { sessionId }, token);
    return data[field];
  }
);

export const createReview = createAsyncThunk(
  "sessions/createReview",
  async ({ sessionId, rating, comment }, { getState }) => {
    const token = getState().auth.token;
    const query = `
      mutation CreateReview($input: CreateReviewInput!) {
        createReview(input: $input) {
          id
          rating
          comment
          isVisible
        }
      }
    `;
    const data = await graphqlRequest(
      query,
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
        state.error = action.error.message || "Could not load sessions.";
      })
      .addCase(createSessionRequest.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.success = "Mentorship request sent.";
      })
      .addCase(createSessionRequest.rejected, (state, action) => {
        state.error = action.error.message || "Could not create request.";
      })
      .addCase(updateSessionStatus.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, status: action.payload.status } : item
        );
        state.success = "Session status updated.";
      })
      .addCase(updateSessionStatus.rejected, (state, action) => {
        state.error = action.error.message || "Could not update the session.";
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.sessionId ? { ...item, review: action.payload.review } : item
        );
        state.success = "Review submitted successfully.";
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.error.message || "Could not save review.";
      });
  },
});

export const { clearSessionFeedback } = sessionsSlice.actions;
export default sessionsSlice.reducer;
