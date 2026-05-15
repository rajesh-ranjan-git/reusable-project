const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatDuration = (totalSeconds) => {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / 3600) % 24);
  const days = Math.floor(totalSeconds / 86400);

  return [
    days ? `${days}d` : null,
    hours ? `${hours}h` : null,
    minutes ? `${minutes}m` : null,
    `${seconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
};

const bytesToMegabytes = (bytes) => `${Math.round(bytes / 1024 / 1024)} MB`;

export const defaultResponse = ({
  apiBaseUrl,
  clientUrl,
  healthPath,
  hostUrl,
  mode,
  requestPath,
  socketPath,
}) => {
  const now = new Date();
  const uptime = process.uptime();
  const timestamp = Date.now();
  const startedAt = new Date(Date.now() - uptime * 1000);
  const memoryUsage = process.memoryUsage();

  const metadata = [
    ["Environment", mode],
    ["Request path", requestPath],
    ["API base", apiBaseUrl],
    ["Health check", healthPath],
    ["Socket path", socketPath],
    ["Frontend", clientUrl],
    ["Backend", hostUrl],
    ["Node.js", process.version],
    ["Platform", `${process.platform} ${process.arch}`],
    ["Process ID", process.pid],
    [
      "Started at",
      startedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ],
    ["Server time", now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
    ["Raw uptime", uptime],
    ["Timestamp", timestamp],
    ["Memory RSS", bytesToMegabytes(memoryUsage.rss)],
    ["Heap used", bytesToMegabytes(memoryUsage.heapUsed)],
  ];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <title>DevMatch Brainbox</title>
    <style>
      :root {
        --accent-blue: #3b82f6;
        --accent-purple: #8b5cf6;
        --gradient-brand: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        --bg-page: #f0f4ff;
        --bg-page-alt: #f5f0ff;
        --glass-bg: rgba(255, 255, 255, 0.62);
        --glass-bg-strong: rgba(255, 255, 255, 0.84);
        --glass-border: rgba(255, 255, 255, 0.68);
        --glass-border-accent: rgba(139, 92, 246, 0.32);
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-muted: #94a3b8;
        --success-bg: rgba(34, 197, 94, 0.12);
        --success-border: rgba(34, 197, 94, 0.38);
        --success-text: #15803d;
        --shadow-glass: 0 24px 64px rgba(59, 130, 246, 0.16), 0 8px 24px rgba(139, 92, 246, 0.1);
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --accent-blue: #60a5fa;
          --accent-purple: #a78bfa;
          --gradient-brand: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          --bg-page: #060b18;
          --bg-page-alt: #0a0614;
          --glass-bg: rgba(15, 23, 42, 0.64);
          --glass-bg-strong: rgba(15, 23, 42, 0.86);
          --glass-border: rgba(255, 255, 255, 0.1);
          --glass-border-accent: rgba(167, 139, 250, 0.32);
          --text-primary: #f1f5f9;
          --text-secondary: #cbd5e1;
          --text-muted: #64748b;
          --success-bg: rgba(34, 197, 94, 0.14);
          --success-border: rgba(74, 222, 128, 0.42);
          --success-text: #86efac;
          --shadow-glass: 0 24px 64px rgba(0, 0, 0, 0.45), 0 8px 24px rgba(96, 165, 250, 0.12);
        }
      }

      * {
        box-sizing: border-box;
      }

      body {
        min-height: 100dvh;
        margin: 0;
        color: var(--text-primary);
        background:
          radial-gradient(circle at 18% 18%, rgba(59, 130, 246, 0.32), transparent 32rem),
          radial-gradient(circle at 82% 76%, rgba(139, 92, 246, 0.28), transparent 34rem),
          linear-gradient(135deg, var(--bg-page), var(--bg-page-alt));
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.6;
      }

      main {
        width: min(1120px, calc(100% - 32px));
        min-height: 100dvh;
        margin: 0 auto;
        display: grid;
        place-items: center;
        padding: 40px 0;
      }

      .shell {
        width: 100%;
        display: grid;
        gap: 18px;
      }

      .hero,
      .panel {
        border: 1px solid var(--glass-border);
        background: var(--glass-bg);
        backdrop-filter: blur(22px);
        -webkit-backdrop-filter: blur(22px);
        box-shadow: var(--shadow-glass);
      }

      .hero {
        border-radius: 28px;
        padding: clamp(26px, 5vw, 54px);
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 28px;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        width: fit-content;
        padding: 8px 13px;
        border-radius: 999px;
        background: var(--glass-bg-strong);
        border: 1px solid var(--glass-border-accent);
        color: var(--text-secondary);
        font-size: 0.88rem;
        font-weight: 700;
      }

      .pulse {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: #22c55e;
        box-shadow: 0 0 0 7px rgba(34, 197, 94, 0.14);
      }

      h1 {
        margin: 22px 0 12px;
        font-size: clamp(2.3rem, 6vw, 5rem);
        line-height: 1;
        letter-spacing: 0;
      }

      .gradient {
        background: var(--gradient-brand);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .lede {
        max-width: 680px;
        margin: 0;
        color: var(--text-secondary);
        font-size: clamp(1rem, 2vw, 1.2rem);
      }

      .status-card {
        align-self: stretch;
        border-radius: 22px;
        padding: 22px;
        border: 1px solid var(--success-border);
        background: var(--success-bg);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 18px;
      }

      .status-label {
        margin: 0;
        color: var(--success-text);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.78rem;
      }

      .uptime {
        margin: 0;
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-weight: 800;
        line-height: 1;
      }

      .muted {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.92rem;
      }

      .panel {
        border-radius: 22px;
        padding: clamp(18px, 3vw, 28px);
      }

      .metadata {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .item {
        min-width: 0;
        border-radius: 14px;
        border: 1px solid var(--glass-border);
        background: var(--glass-bg-strong);
        padding: 14px 16px;
      }

      .item span {
        display: block;
        color: var(--text-muted);
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .item strong {
        display: block;
        overflow-wrap: anywhere;
        margin-top: 5px;
        color: var(--text-primary);
        font-size: 0.96rem;
      }

      footer {
        padding: 0 4px;
        color: var(--text-muted);
        font-size: 0.86rem;
        text-align: center;
      }

      @media (max-width: 760px) {
        main {
          width: min(100% - 24px, 1120px);
          padding: 20px 0;
        }

        .hero {
          grid-template-columns: 1fr;
          border-radius: 22px;
        }

        .metadata {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="shell">
        <section class="hero" aria-labelledby="page-title">
          <div>
            <div class="brand"><span class="pulse"></span> DevMatch Brainbox</div>
            <h1 id="page-title">Server is <span class="gradient">up and running</span></h1>
            <p class="lede">
              This is the DevMatch backend service. REST APIs, realtime socket events,
              authentication, conversations, notifications, and integrations are online.
            </p>
          </div>

          <aside class="status-card" aria-label="Server uptime">
            <div>
              <p class="status-label">Operational</p>
              <p class="uptime" data-uptime-clock data-uptime="${escapeHtml(uptime)}">${escapeHtml(formatDuration(uptime))}</p>
            </div>
            <p class="muted"><span data-uptime-seconds>${escapeHtml(Math.floor(uptime))}</span> seconds of process uptime</p>
          </aside>
        </section>

        <section class="panel" aria-label="Server metadata">
          <div class="metadata">
            ${metadata
              .map(
                ([label, value]) => `<div class="item">
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(value)}</strong>
            </div>`,
              )
              .join("")}
          </div>
        </section>

        <footer>DevMatch Brainbox default response page</footer>
      </div>
    </main>
    <script>
      (() => {
        const clock = document.querySelector("[data-uptime-clock]");
        const secondsLabel = document.querySelector("[data-uptime-seconds]");

        if (!clock) return;

        const startedAt = Date.now() - Number(clock.dataset.uptime || 0) * 1000;

        const formatDuration = (totalSeconds) => {
          const seconds = Math.floor(totalSeconds % 60);
          const minutes = Math.floor((totalSeconds / 60) % 60);
          const hours = Math.floor((totalSeconds / 3600) % 24);
          const days = Math.floor(totalSeconds / 86400);

          return [
            days ? days + "d" : null,
            hours ? hours + "h" : null,
            minutes ? minutes + "m" : null,
            seconds + "s",
          ]
            .filter(Boolean)
            .join(" ");
        };

        const updateClock = () => {
          const uptimeSeconds = Math.max(0, (Date.now() - startedAt) / 1000);

          clock.textContent = formatDuration(uptimeSeconds);

          if (secondsLabel) {
            secondsLabel.textContent = String(Math.floor(uptimeSeconds));
          }
        };

        updateClock();
        window.setInterval(updateClock, 1000);
      })();
    </script>
  </body>
</html>`;
};
