import ConnectSpotifyButton from "./components/ConnectSpotifyButton";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 24px",
        background: "#f7f7f5",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#777",
            }}
          >
            Data Connection
          </p>
          <img
            src="/logo.png"
            alt="Logo Cek Khodam"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              marginBottom: "16px",
              boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)",
            }}
          />

          <h1
            style={{
              margin: "10px 0 12px",
              fontSize: "42px",
              lineHeight: 1.1,
            }}
          >
            Cek Khodam
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "650px",
              fontSize: "17px",
              lineHeight: 1.6,
              color: "#666",
            }}
          >
            Connect your Spotify and discover your Music DNA.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
          }}
        >
          {/* SPOTIFY */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: "18px",
              padding: "26px",
              minHeight: "210px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <span style={{ fontSize: "30px" }}>🎵</span>

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#16834b",
                    background: "#e9f8ef",
                    padding: "6px 10px",
                    borderRadius: "999px",
                  }}
                >
                  AVAILABLE
                </span>
              </div>

              <h2 style={{ margin: "0 0 8px", fontSize: "22px" }}>Spotify</h2>

              <p
                style={{
                  margin: 0,
                  color: "#777",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                Connect your Spotify data securely.
              </p>
            </div>

            <div style={{ marginTop: "24px" }}>
              {/* Komponen Vana SDK yang asli dipanggil di sini */}
              <ConnectSpotifyButton />
            </div>
          </div>

          {/* INSTAGRAM */}
          <ComingSoonCard icon="📸" name="Instagram" />

          {/* GITHUB */}
          <ComingSoonCard icon="🐙" name="GitHub" />

          {/* CHATGPT */}
          <ComingSoonCard icon="🤖" name="ChatGPT" />
        </div>
      </div>
    </main>
  );
}

function ComingSoonCard({ icon, name }: { icon: string; name: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: "18px",
        padding: "26px",
        minHeight: "210px",
        opacity: 0.72,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <span style={{ fontSize: "30px" }}>{icon}</span>

          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#777",
              background: "#f0f0f0",
              padding: "6px 10px",
              borderRadius: "999px",
            }}
          >
            COMING SOON
          </span>
        </div>

        <h2 style={{ margin: "0 0 8px", fontSize: "22px" }}>{name}</h2>

        <p
          style={{
            margin: 0,
            color: "#777",
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
          This data source will be available soon.
        </p>
      </div>

      <button
        disabled
        style={{
          width: "100%",
          marginTop: "24px",
          padding: "11px 16px",
          border: "none",
          borderRadius: "10px",
          background: "#eee",
          color: "#999",
          fontWeight: 600,
          cursor: "not-allowed",
        }}
      >
        Coming Soon
      </button>
    </div>
  );
}
