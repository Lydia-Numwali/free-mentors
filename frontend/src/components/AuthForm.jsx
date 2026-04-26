import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";

export default function AuthForm({
  fields,
  onSubmit,
  loading,
  error,
  submitLabel,
}) {
  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {fields.map((field) => {
          const { options = [], helperText, ...inputProps } = field;

          return (
            <TextField
              key={field.name}
              {...inputProps}
              helperText={helperText}
              required
              fullWidth
            >
              {field.select
                ? options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))
                : null}
            </TextField>
          );
        })}
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? "Please wait..." : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}
