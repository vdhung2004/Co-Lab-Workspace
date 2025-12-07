export async function getWorkspace(id: string) {
  const res = await fetch(`http://localhost:5000/api/workspace/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch workspace");
  }
  return res.json();
}
