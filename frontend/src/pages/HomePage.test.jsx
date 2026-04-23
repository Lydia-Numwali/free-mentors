import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import HomePage from "./HomePage";
import { store } from "../app/store";
import { theme } from "../theme";

test("renders hero content", () => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

  expect(screen.getByText(/simple admin, mentor, and end-user flow/i)).toBeInTheDocument();
});
