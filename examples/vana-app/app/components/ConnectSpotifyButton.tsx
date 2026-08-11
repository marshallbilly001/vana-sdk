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
// --- MUSIC DNA ENGINE ---
function analyzeMusicDNA(data: unknown) {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, any>;
  const tracks = record.savedTracks;

  if (!Array.isArray(tracks) || tracks.length === 0) return null;

  const artistCounts: Record<string, number> = {};
  const albumCounts: Record<string, number> = {};

  tracks.forEach((track: any) => {
    if (track?.artists && Array.isArray(track.artists)) {
      track.artists.forEach((artist: any) => {
        if (artist?.name) {
          artistCounts[artist.name] = (artistCounts[artist.name] || 0) + 1;
        }
      });
    }
    if (track?.album?.name) {
      albumCounts[track.album.name] = (albumCounts[track.album.name] || 0) + 1;
    }
  });

  const uniqueArtistsCount = Object.keys(artistCounts).length;
  let personality = "🎧 THE EXPLORER";
  let description =
    "Your taste is driven by curiosity. You don't stay in one musical lane.";

  if (uniqueArtistsCount <= tracks.length * 0.4) {
    personality = "🔥 THE LOYAL LISTENER";
    description =
      "You know what you like and stick to it. Your favorite artists get a lot of love!";
  } else if (uniqueArtistsCount >= tracks.length * 0.8) {
    personality = "🚀 THE NOMAD";
    description =
      "You rarely listen to the same artist twice. Always exploring new horizons!";
  }

  const topArtist =
    Object.keys(artistCounts).sort(
      (a, b) => artistCounts[b] - artistCounts[a],
    )[0] || "Unknown";
  const topAlbum =
    Object.keys(albumCounts).sort(
      (a, b) => albumCounts[b] - albumCounts[a],
    )[0] || "Unknown";

  return {
    personality,
    description,
    topArtist,
    topAlbum,
    totalSavedTracks: tracks.length,
    uniqueArtists: uniqueArtistsCount,
  };
}
// ------------------------

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
  });

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

  const canStart =
    connect.state.type === "idle" ||
    connect.state.type === "done" ||
    connect.state.type === "error";

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
            ? "View My DNA"
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
            Your Music DNA
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
                Top Artist
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
                Top Album
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
                Unique Artists
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
                Saved Tracks
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
                    title: "My Music DNA",
                    text: `My Spotify Music DNA is ${musicDNA.personality}! ${musicDNA.description} Powered by Vana.`,
                    url: window.location.href,
                  })
                  .catch(console.error);
              } else {
                navigator.clipboard.writeText(
                  `My Music DNA is ${musicDNA.personality}!`,
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
            Share My Music DNA
          </button>
        </div>
      )}
    </section>
  );
}
