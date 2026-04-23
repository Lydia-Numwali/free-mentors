import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PortalPage from "./pages/PortalPage";
import MentorsPage from "./pages/MentorsPage";
import MentorDetailsPage from "./pages/MentorDetailsPage";
import SessionsPage from "./pages/SessionsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/portal" element={<PortalPage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/mentors/:mentorId" element={<MentorDetailsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}
