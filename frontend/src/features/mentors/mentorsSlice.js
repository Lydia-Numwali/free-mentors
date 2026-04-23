import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../app/graphqlClient";

export const fetchMentors = createAsyncThunk("mentors/fetchAll", async (_, { getState }) => {
  const token = getState().auth.token;
  const query = `
    query Mentors {
      mentors {
        id
        firstName
        lastName
        email
        role
        bio
        expertise
      }
    }
  `;
  const data = await graphqlRequest(query, {}, token);
  return data.mentors;
});

export const fetchMentor = createAsyncThunk("mentors/fetchOne", async (mentorId, { getState }) => {
  const token = getState().auth.token;
  const query = `
    query Mentor($mentorId: ID!) {
      mentor(mentorId: $mentorId) {
        id
        firstName
        lastName
        email
        role
        bio
        expertise
        reviews {
          id
          rating
          comment
          mentee {
            id
            firstName
            lastName
          }
        }
      }
    }
  `;
  const data = await graphqlRequest(query, { mentorId }, token);
  return data.mentor;
});

const mentorsSlice = createSlice({
  name: "mentors",
  initialState: {
    items: [],
    selected: null,
    status: "idle",
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unable to load mentors.";
      })
      .addCase(fetchMentor.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export default mentorsSlice.reducer;
