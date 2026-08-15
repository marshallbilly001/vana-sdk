// pancing update
// @ts-nocheck

"use client";

import { useMemo } from "react";
import {
  useDirectVanaConnect,
  type AccessRequest,
  type AccessRequestStatus,
  type ApprovedDataResult,
} from "@opendatalabs/vana-sdk/react";

async function readJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : `${response.status} ${response.statusText}`;
    throw new Error(message);
  }
  return body as T;
}

function previewData(data: unknown): unknown {
  if (Array.isArray(data)) return data.slice(0, 3);
  if (!data || typeof data !== "object") return data;

  const record = data as Record<string, unknown>;
  const arrayField = firstArrayField(record);
  if (arrayField) {
    const [field, values] = arrayField;
    return { ...record, [field]: values.slice(0, 3) };
  }
  return data;
}

function payloadSummary(data: unknown): string {
  if (Array.isArray(data)) return `${data.length} records`;
  if (!data || typeof data !== "object") return "1 value";

  const record = data as Record<string, unknown>;
  const arrayField = firstArrayField(record);
  if (arrayField) return `${arrayField[1].length} ${arrayField[0]}`;
  return `${Object.keys(record).length} top-level fields`;
}

function firstArrayField(
  record: Record<string, unknown>,
): [string, unknown[]] | undefined {
  for (const [field, value] of Object.entries(record)) {
    if (Array.isArray(value)) return [field, value];
  }
  return undefined;
}

function stateLabel(stateType: string): string {
  switch (stateType) {
    case "creating":
      return "Creating access request";
    case "awaiting_approval":
      return "Waiting for approval";
    case "reading":
      return "Reading approved data";
    case "done":
      return "Data ready";
    case "error":
      return "Needs attention";
    default:
      return "Ready";
  }
}

// --- MUSIC DNA ENGINE (VERSI KHODAM SPOTIFY - RAMAH HP) ---
function analyzeMusicDNA(data: unknown) {
  if (!data) return null;

  const khodams = [
    { 
      personality: "🐉 NAGA JEDAG-JEDUG", 
      description: "Khodam ini bersemayam di bass audimu. Bikin kamu gak bisa diam kalau dengar beat kencang!" 
    },
    { 
      personality: "🧚 PERI INDIE SENJA", 
      description: "Suka nongkrong di playlist kopimu. Membawamu ke dimensi folk, lofi, dan overthinking malam hari." 
    },
    { 
      personality: "🎸 SILUMAN ROCKER", 
      description: "Energi khodam ini meledak-ledak! Membuat jiwamu selalu meronta ingin headbang." 
    },
    { 
      personality: "🧙‍♂️ PENYIHIR GALAU", 
      description: "Khodam ini menyerap energi dari lagu sedihmu. Awas, bikin susah move on!" 
    },
    { 
      personality: "🎧 JIN PODCAST", 
      description: "Khodam cerewet yang bikin kamu lebih suka dengerin orang ngobrol berjam-jam daripada dengerin musik." 
    }
  ];

  // Mengacak hasil berdasarkan data profil secara konsisten
  const dataString = JSON.stringify(data);
  const randomIndex = Math.abs(dataString.length) % khodams.length;
  const khodamTerpilih = khodams[randomIndex];

  return {
    personality: khodamTerpilih.personality,
    description: khodamTerpilih.description,
    topArtist: "Rahasia Alam Gaib",
    topAlbum: "Dimensi Spotify",
    uniqueArtists: "Tak Terhingga",
    totalSavedTracks: "Misterius",
  };
}
// ---------------------------------------------------------

export default function ConnectSpotifyButton() {
  const connect = useDirectVanaConnect({
    createRequest: () =>
      readJson<AccessRequest>("/api/vana/request", {
        method: "POST",
      }),
    getStatus: (requestId) =>
      readJson<AccessRequestStatus>(
        `/api/vana/status?requestId=${encodeURIComponent(requestId)}`,
      ),
    readResult: (requestId) =>
      readJson<ApprovedDataResult<unknown>>(
        `/api/vana/data?requestId=${encodeURIComponent(requestId)}`,
      ),
    pollIntervalMs: 800,
    appUrl: "https://cek-khodam-xi.vercel.app",
  } as any);

  const result = connect.state.type === "done" ? connect.state.result : null;
  const preview = useMemo(
    () =>
      result
        ? JSON.stringify(
            {
              scope: result.scope,
              data: previewData(result.data),
              payment: result.payment,
            },
            null,
            2,
          )
        : "",
    [result],
  );
  const musicDNA = useMemo(() => analyzeMusicDNA(result?.data), [result]);

  const canStart = true;

  return (
    <section className="connect-panel" aria-labelledby="connect-title">
      <div className="connect-header">
        <div>
          <p className="eyebrow">Powered by Vana</p>
          <h1 id="connect-title">Spotify</h1>
        </div>
        <span className={`status-pill status-${connect.state.type}`}>
          {stateLabel(connect.state.type)}
        </span>
      </div>

      <p className="lede">
        Request a Spotify data grant, poll for approval, then read the approved
        payload through the app backend.
      </p>

      <div className="actions">
        <button disabled={!canStart} onClick={connect.start} type="button">
          {connect.state.type === "done"
            ? "View My Khodam"
            : "Discover My Music DNA"}
        </button>
        {connect.state.type !== "idle" && (
          <button className="secondary" onClick={connect.reset} type="button">
            Reset
          </button>
        )}
      </div>

      {connect.state.type === "awaiting_approval" && (
        <div className="notice">
          <strong>Approval request:</strong> {connect.state.request.requestId}
          {connect.state.popupBlocked && (
            <a
              href={connect.state.request.approvalUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open approval
            </a>
          )}
        </div>
      )}

      {connect.state.type === "reading" && (
        <div className="notice">
          Reading request {connect.state.request.requestId}
        </div>
      )}

      {connect.state.type === "error" && (
        <div className="notice error">{connect.state.error.message}</div>
      )}

      {result && musicDNA && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            backgroundColor: "#f6f6f6",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#666",
              textTransform: "uppercase",
            }}
          >
            Khodam Musik Kamu
          </p>
          <h2
            style={{
              fontSize: "1.75rem",
              margin: "1rem 0",
              color: "#111",
              fontWeight: 800,
              lineHeight: "1.2",
            }}
          >
            {musicDNA.personality}
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#444",
              marginBottom: "1.5rem",
              fontStyle: "italic",
            }}
          >
            "{musicDNA.description}"
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              textAlign: "left",
            }}
          >
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Energi Artis
              </div>
              <strong style={{ fontSize: "1rem", color: "#111" }}>
                {musicDNA.topArtist}
              </strong>
            </div>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Lokasi Khodam
              </div>
              <strong style={{ fontSize: "1rem", color: "#111" }}>
                {musicDNA.topAlbum}
              </strong>
            </div>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Kekuatan aura
              </div>
              <strong style={{ fontSize: "1rem", color: "#111" }}>
                {musicDNA.uniqueArtists}
              </strong>
            </div>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                Status Ikatan
              </div>
              <strong style={{ fontSize: "1rem", color: "#111" }}>
                {musicDNA.totalSavedTracks}
              </strong>
            </div>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "Khodam Musik Spotify",
                    text: `Khodam Musik Spotify-ku adalah ${musicDNA.personality}! ${musicDNA.description} Cek khodam musikmu di Cek Khodam Vana!`,
                    url: window.location.href,
                  })
                  .catch(console.error);
              } else {
                navigator.clipboard.writeText(
                  `Khodam Musik Spotify-ku adalah ${musicDNA.personality}!`,
                );
                alert("Copied to clipboard!");
              }
            }}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              padding: "0.875rem",
              backgroundColor: "#1ed760",
              color: "#000",
              border: "none",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Share Khodam Musik
          </button>
        </div>
      )}
    </section>
  );
}
