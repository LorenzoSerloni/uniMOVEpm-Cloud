import type { DataPreview, SimulationCard } from "./Interface";

const BASE_URL = "https://r5d6khydzg.execute-api.eu-north-1.amazonaws.com/test";

export async function getSimulationDataByDay(idToken: string): Promise<DataPreview[]> {
  const url = `${BASE_URL}/names`;
//   console.log("[getSimulationDataByDay] Fetching:", url);
//   console.log("[getSimulationDataByDay] Using idToken:", idToken);

  const res = await fetch(url, { headers: { "Authorization": idToken } });
//   console.log("[getSimulationDataByDay] Response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[getSimulationDataByDay] Error response:", errorText);
    throw new Error("Failed to fetch file names");
  }

  const filesByDate = await res.json();
//   console.log("[getSimulationDataByDay] filesByDate:", filesByDate);

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
//   console.log("[getSimulationDataByDay] Result:", result);
  return result;
}

export async function getCsvFile(idToken: string, date: string, time: string) {
  // Convert date from YYYY-MM-DD to DD-MM-YYYY
  const [yyyy, mm, dd] = date.split("-");
  const apiDate = `${dd}-${mm}-${yyyy}`;

  // Convert time from HH-MM-SS to HH:MM:SS if needed
  const apiTime = time

  const url = new URL(`${BASE_URL}/data`);
  url.searchParams.append("date", apiDate);
  url.searchParams.append("time", apiTime);

  const res = await fetch(url.toString(), {
    headers: { "Authorization": idToken },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[getCsvFile] Error response:", errorText);
    throw new Error("Failed to fetch CSV file");
  }
  const text = await res.text();
  return text;
}

export async function deleteSimulation(idToken: string, date: string, time: string) {
  const apiDate = date.split("-").reverse().join("-");
  const apiTime = time.replace(/:/g, "-");
  const url = "https://r5d6khydzg.execute-api.eu-north-1.amazonaws.com/test/data";
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": idToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date: apiDate, time: apiTime }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to delete simulation");
  }
}