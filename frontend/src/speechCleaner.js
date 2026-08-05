export function cleanSpeech(text) {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")

    // Remove inline code
    .replace(/`.*?`/g, "")

    // Remove markdown headings
    .replace(/^#+\s/gm, "")

    // Remove bold/italic
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")

    // Remove tables
    .replace(/\|/g, " ")

    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")

    // Remove bullet symbols
    .replace(/[-•]/g, "")

    // Remove extra blank lines
    .replace(/\n+/g, ". ")

    // Collapse multiple spaces
    .replace(/\s+/g, " ")

    .trim();
}