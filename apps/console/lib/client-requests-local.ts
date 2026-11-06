import fs from "fs";
import path from "path";
import type { ClientRequestRecord } from "./client-requests-types";

const LOCAL_STORE_PATH = path.join(
  process.cwd(),
  "data",
  "oauth_client_requests.json"
);

export function ensureLocalStore(): ClientRequestRecord[] {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_STORE_PATH)) {
      const initialSeed: ClientRequestRecord[] = [];
      fs.writeFileSync(
        LOCAL_STORE_PATH,
        JSON.stringify(initialSeed, null, 2),
        "utf-8"
      );
      return initialSeed;
    }
    const raw = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Local store read error:", err);
    return [];
  }
}

export function writeLocalStore(records: ClientRequestRecord[]): void {
  try {
    const dir = path.dirname(LOCAL_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_STORE_PATH,
      JSON.stringify(records, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Local store write error:", err);
  }
}
