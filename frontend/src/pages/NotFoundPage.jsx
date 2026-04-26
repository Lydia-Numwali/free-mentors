import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Card sx={{ maxWidth: 620, mx: "auto" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h3">Page not found</Typography>
            <Typography color="text.secondary">
              The page you requested does not exist in the Free Mentors frontend.
            </Typography>
            <Box>
              <Button component={RouterLink} to="/" variant="contained">
                Back home
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
