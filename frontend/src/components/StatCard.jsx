import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function StatCard({ eyebrow, value, label }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {eyebrow}
          </Typography>
          <Typography variant="h3">{value}</Typography>
          <Typography color="text.secondary">{label}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
