import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { graphqlRequest } from "../../app/graphqlClient";

const mentorListFields = `
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
  }
`;

export const fetchMentors = createAsyncThunk(
  "mentors/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const data = await graphqlRequest(
        `
          query Mentors {
            mentors {
              ${mentorListFields}
            }
          }
        `,
        {},
        token
      );

      return data.mentors;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load mentors.");
    }
  }
);

export const fetchMentor = createAsyncThunk(
  "mentors/fetchOne",
  async (mentorId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const data = await graphqlRequest(
        `
          query Mentor($mentorId: ID!) {
            mentor(mentorId: $mentorId) {
              ${mentorListFields}
              signupGoal
              mentorApplicationStatus
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
        `,
        { mentorId },
        token
      );

      return data.mentor;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load this mentor.");
    }
  }
);

const mentorsSlice = createSlice({
  name: "mentors",
  initialState: {
    items: [],
    selected: null,
    status: "idle",
    detailStatus: "idle",
    error: "",
  },
  reducers: {
    clearSelectedMentor(state) {
      state.selected = null;
      state.detailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load mentors.";
      })
      .addCase(fetchMentor.pending, (state) => {
        state.detailStatus = "loading";
        state.error = "";
      })
      .addCase(fetchMentor.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchMentor.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.error = action.payload || "Unable to load this mentor.";
      });
  },
});

export const { clearSelectedMentor } = mentorsSlice.actions;
export default mentorsSlice.reducer;
