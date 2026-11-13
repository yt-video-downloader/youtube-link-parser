export type ParsedLink =
  | { id: string; url: string; shorts: boolean; start: number | null; error?: undefined }
  | { error: "empty" | "invalid" | "playlist"; id?: undefined };

export function parseYouTubeLink(input: unknown): ParsedLink;
export function getVideoId(input: unknown): string | null;
export default parseYouTubeLink;
