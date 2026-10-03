export async function geoCordinates(location: string): Promise<{
  lat: number;
  lon: number;
} | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", `${location}, Bangladesh`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("countrycodes", "bd");
  url.searchParams.set("limit", "3");

  const res = await fetch(url, {
    headers: {
      "User-Agent": "NagorikBloodApp/0.1 (nimulmahin@gmail.com)",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) {
    throw new Error(`Geocoder failed: ${res.status} ${await res.text()}`);
  }

  const results = (await res.json()) as Array<any>;
  if (!results.length) return null;

  const r = results?.[0];
  return { lat: Number(r.lat), lon: Number(r.lon) };
}
