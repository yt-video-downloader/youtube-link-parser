const ID = /^[A-Za-z0-9_-]{11}$/;
const HOSTS = /(?:https?:\/\/)?(?:[a-z0-9-]+\.)*(?:youtube(?:-nocookie)?\.com|youtu\.be)\/[^\s"'<>]*/i;

function seconds(v) {
  if (!v) return null;
  if (/^\d+$/.test(v)) return Number(v);
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(v);
  if (!m || !m[0]) return null;
  return (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0);
}

export function parseYouTubeLink(raw) {
  let t = String(raw ?? "").trim();
  if (!t) return { error: "empty" };
  if (t.length > 2048) return { error: "invalid" };
  if (ID.test(t)) return { id: t, url: `https://www.youtube.com/watch?v=${t}`, shorts: false, start: null };
  const found = t.match(HOSTS);
  if (found) t = found[0];
  else if (/\s/.test(t) || !/[./]/.test(t)) return { error: "invalid" };
  if (!/^https?:\/\//i.test(t)) t = `https://${t}`;
  let u;
  try { u = new URL(t); } catch { return { error: "invalid" }; }
  const host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  const segs = u.pathname.split("/").filter(Boolean);
  let id = null;
  let shorts = false;
  if (host === "youtu.be") id = segs[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (segs[0] === "watch") id = u.searchParams.get("v");
    else if (["shorts", "live", "embed", "v"].includes(segs[0])) { id = segs[1]; shorts = segs[0] === "shorts"; }
    else if (segs[0] === "playlist") return { error: "playlist" };
  } else return { error: "invalid" };
  if (id && ID.test(id)) {
    const start = seconds(u.searchParams.get("t") || u.searchParams.get("start"));
    return { id, url: `https://www.youtube.com/${shorts ? `shorts/${id}` : `watch?v=${id}`}`, shorts, start };
  }
  if (u.searchParams.get("list")) return { error: "playlist" };
  return { error: "invalid" };
}

export function getVideoId(raw) {
  return parseYouTubeLink(raw).id || null;
}

export default parseYouTubeLink;
