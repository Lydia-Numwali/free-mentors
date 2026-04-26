const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/graphql/";

export async function graphqlRequest(query, variables = {}, token) {
  let response;

  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    throw new Error("Unable to reach the Free Mentors API.");
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.errors?.[0]?.message || "The API request failed.");
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }

  return payload.data;
}
