import type { DataPreview, SimulationCard } from "./Interface";

const mode = import.meta.env.VITE_MODE;
const ip = import.meta.env.VITE_IP;
let BASE_URL = "localhost";
if (mode === "production" && ip) {
  BASE_URL = ip;
}

export async function getSimulationDataByDay(): Promise<DataPreview[]> {
  const url = `http://${BASE_URL}:5001/names`;

  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[getSimulationDataByDay] Error response:", errorText);
    throw new Error("Failed to fetch file names");
  }

  const filesByDate = await res.json();
  const result: DataPreview[] = [];

  for (const day of filesByDate) {
    const date = day.date;
    const SimulationData: SimulationCard[] = day.files.map((file: string) => ({
      title: file.replace(".csv", ""), // Only the hour as title
    }));
    result.push({
      date: new Date(date.split("-").reverse().join("-")),
      SimulationData,
        })
  }
  return result;
}

export async function getCsvFile(date: string, time: string) {
  // Convert date from YYYY-MM-DD to DD-MM-YYYY
  const [yyyy, mm, dd] = date.split("-");
  const apiDate = `${dd}-${mm}-${yyyy}`;

  const apiTime = time

  const url = new URL(`http://${BASE_URL}:5001/data`);
  url.searchParams.append("date", apiDate);
  url.searchParams.append("time", apiTime);

  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[getCsvFile] Error response:", errorText);
    throw new Error("Failed to fetch CSV file");
  }
  const text = await res.text();
  return text;
}

export async function deleteSimulation(date: string, time: string) {
  const apiDate = date;
  const apiTime = time.replace(/:/g, "-");
  const url = new URL(`http://${BASE_URL}:5001/data`);
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',  // Add this header
    },
    credentials: 'include',  // Include cookies for authentication
    body: JSON.stringify({ date: apiDate, time: apiTime }),  // Convert to JSON string
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to delete simulation");
  }
}

export async function downloadCsvFile(date: string, time: string) {
  const url = new URL(`http://${BASE_URL}:5001/download`);
  url.searchParams.append("date", date);
  url.searchParams.append("time", time);

  try {
    const res = await fetch(url.toString(), { method: "GET" });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[downloadCsvFile] Error response:", errorText);
      throw new Error("Failed to fetch CSV file");
    }

    // Convert response to Blob
    const blob = await res.blob();

    // Create a temporary link to trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${date}_${time}.csv`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(blobUrl);

    console.log(`[downloadCsvFile] Downloaded: ${date}_${time}.csv`);
  } catch (error) {
    console.error("Error downloading CSV file:", error);
    throw error;
  }
}
