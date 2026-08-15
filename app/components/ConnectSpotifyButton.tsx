// @ts-nocheck
"use client";
import { useMemo } from "react";
import { useDirectVanaConnect } from "@opendatalabs/vana-sdk/react";

export default function ConnectSpotifyButton() {
  const connect = useDirectVanaConnect({
      appUrl: "https://cek-khodam-xi.vercel.app",
        } as any);

          return (
              <section className="connect-panel">
                    <h1>KHODAM SPOTIFY</h1>
                          <button onClick={connect.start} type="button">
                                  {connect.state.type === "done" ? "View My Khodam" : "Discover My Music DNA"}
                                        </button>
                                              {connect.state.type !== "idle" && (
                                                      <button onClick={connect.reset} type="button">Reset</button>
                                                            )}
                                                                </section>
                                                                  );
                                                                  }
// @ts-nocheck
"use client";

import { useDirectVanaConnect } from "@opendatalabs/vana-sdk/react";

export default function ConnectSpotifyButton() {
  const connect = useDirectVanaConnect({
      appUrl: "https://cek-khodam-xi.vercel.app",
        } as any);

          return (
              <section className="connect-panel">
                    <div className="connect-header">
                            <h1 id="connect-title">KHODAM SPOTIFY</h1>
                                  </div>
                                        <div className="actions">
                                                <button onClick={connect.start} type="button">
                                                          {connect.state.type === "done" ? "View My Khodam" : "Connect & Discover"}
                                                                  </button>
                                                                        </div>
                                                                            </section>
                                                                              );
                                                                              }
                                                                              // update pembaruan untuk memaksa git push berjalan
                                                                              