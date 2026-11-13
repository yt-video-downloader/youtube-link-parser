# youtube-link-parser

Turn whatever a person pastes into a clean YouTube video ID.

People don't paste neat links. They paste `youtu.be` links with `?si=` tracking, Shorts links, `m.youtube.com` links from a phone, links with a timestamp, or a whole sentence copied from a chat with the link somewhere inside it. This small library handles all of that, and when it can't find a video it tells you why, so you can show a useful message instead of "invalid URL".

No dependencies. Works in Node 16+ and every modern browser.

It runs in production behind the link box on [YT Video Downloader](https://yt-video-downloader.net/), where it parses every pasted link before the video is looked up.

## Install

```sh
npm install github:yt-video-downloader/youtube-link-parser
```

Or copy `index.js` into your project. It's one small file.

## Use

```js
import { parseYouTubeLink, getVideoId } from "youtube-link-parser";

parseYouTubeLink("https://youtu.be/jNQXAC9IVRw?si=abc&t=42");
// { id: "jNQXAC9IVRw", url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", shorts: false, start: 42 }

parseYouTubeLink("https://youtube.com/shorts/tPEE9ZwTmy0?feature=share");
// { id: "tPEE9ZwTmy0", url: "https://www.youtube.com/shorts/tPEE9ZwTmy0", shorts: true, start: null }

parseYouTubeLink("https://www.youtube.com/playlist?list=PLx");
// { error: "playlist" }

getVideoId("look at this https://www.youtube.com/watch?v=aqz-KE-bpKQ lol");
// "aqz-KE-bpKQ"
```

## What it accepts

| Input | Example |
|---|---|
| Watch link | `youtube.com/watch?v=aqz-KE-bpKQ` |
| Short link | `youtu.be/jNQXAC9IVRw?si=abc` |
| Shorts | `youtube.com/shorts/tPEE9ZwTmy0` |
| Live | `youtube.com/live/jfKfPfyJRdk` |
| Embed | `youtube.com/embed/...`, `youtube-nocookie.com/embed/...` |
| Mobile and music | `m.youtube.com/...`, `music.youtube.com/...` |
| Bare ID | `aqz-KE-bpKQ` |
| Link inside text | `check this https://youtu.be/... so good` |
| Video inside a playlist | `watch?v=...&list=...` gives the video |

The `https://` part is optional, and extra parameters are ignored. `start` comes from `t=` or `start=` and understands `42`, `1m30s` and `1h2m3s`.

## Errors

| `error` | Meaning | Message you might show |
|---|---|---|
| `empty` | Nothing was pasted | Paste a YouTube link first. |
| `playlist` | A playlist link with no single video | Open one video from the playlist and copy its link. |
| `invalid` | Not a YouTube video link | That doesn't look like a YouTube video link. |

Look-alike hosts such as `youtube.com.evil.com` are rejected, and input longer than 2,048 characters is refused before any parsing.

## Test

```sh
npm test
```

## License

MIT
