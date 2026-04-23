const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/graphql/";

export async function graphqlRequest(query, variables = {}, token) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }

  return payload.data;
}
