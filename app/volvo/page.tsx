import ZoneSelector from "ui/ZoneSelector";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/gpt`);
  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Volvo() {
  return (
    <div>
      <h2>Vovlo</h2>
    </div>
  );
}
