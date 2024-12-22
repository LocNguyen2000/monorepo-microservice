export function parseObjectFromContent(content: string): object {
  // Use a regex to extract the JSON object enclosed in curly braces `{ }`
  const objectMatch = content.match(/\{([\s\S]*?)\}/);

  if (objectMatch) {
    try {
      const extractedJson = `{${objectMatch[1]}}`; // Wrap back the braces
      return JSON.parse(extractedJson); // Parse the JSON string into an object
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return {};
    }
  }

  console.warn('No JSON object found in the content.');
  return {};
}
