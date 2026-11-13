import test from "node:test";
import assert from "node:assert/strict";
import { parseYouTubeLink as p, getVideoId } from "./index.js";

const ok = [
  ["https://www.youtube.com/watch?v=aqz-KE-bpKQ", "aqz-KE-bpKQ"],
  ["youtube.com/watch?v=aqz-KE-bpKQ", "aqz-KE-bpKQ"],
  ["https://m.youtube.com/watch?v=aqz-KE-bpKQ&feature=share", "aqz-KE-bpKQ"],
  ["https://youtu.be/jNQXAC9IVRw?si=abc", "jNQXAC9IVRw"],
  ["jNQXAC9IVRw", "jNQXAC9IVRw"],
  ["https://www.youtube.com/shorts/tPEE9ZwTmy0", "tPEE9ZwTmy0", true],
  ["https://youtube.com/shorts/tPEE9ZwTmy0?feature=share", "tPEE9ZwTmy0", true],
  ["https://www.youtube.com/live/jfKfPfyJRdk", "jfKfPfyJRdk"],
  ["https://www.youtube.com/embed/aqz-KE-bpKQ", "aqz-KE-bpKQ"],
  ["https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ", "aqz-KE-bpKQ"],
  ["https://music.youtube.com/watch?v=aqz-KE-bpKQ", "aqz-KE-bpKQ"],
  ["https://www.youtube.com/watch?v=aqz-KE-bpKQ&list=PLx&index=2", "aqz-KE-bpKQ"],
  ["Check this out https://youtu.be/jNQXAC9IVRw?si=x so good", "jNQXAC9IVRw"],
  ["  https://www.youtube.com/watch?v=aqz-KE-bpKQ  ", "aqz-KE-bpKQ"],
];

test("finds the video id", () => {
  for (const [input, id, shorts = false] of ok) {
    const r = p(input);
    assert.equal(r.id, id, input);
    assert.equal(r.shorts, shorts, input);
    assert.ok(r.url.startsWith("https://www.youtube.com/"), input);
  }
});

test("reads start times", () => {
  assert.equal(p("https://youtu.be/jNQXAC9IVRw?t=42").start, 42);
  assert.equal(p("https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=1m30s").start, 90);
  assert.equal(p("https://www.youtube.com/watch?v=aqz-KE-bpKQ&t=1h2m3s").start, 3723);
  assert.equal(p("https://www.youtube.com/embed/aqz-KE-bpKQ?start=15").start, 15);
  assert.equal(p("https://www.youtube.com/watch?v=aqz-KE-bpKQ").start, null);
});

test("explains what is wrong", () => {
  const bad = [
    ["", "empty"], ["   ", "empty"], [null, "empty"], ["hello world", "invalid"],
    ["https://vimeo.com/123", "invalid"], ["https://www.youtube.com/playlist?list=PLx", "playlist"],
    ["https://www.youtube.com/@channel", "invalid"], ["https://youtube.com.evil.com/watch?v=aqz-KE-bpKQ", "invalid"],
    ["https://www.youtube.com/watch?v=short", "invalid"], ["x".repeat(3000), "invalid"],
  ];
  for (const [input, error] of bad) assert.equal(p(input).error, error, String(input).slice(0, 40));
});

test("getVideoId", () => {
  assert.equal(getVideoId("https://youtu.be/jNQXAC9IVRw"), "jNQXAC9IVRw");
  assert.equal(getVideoId("nope"), null);
});
