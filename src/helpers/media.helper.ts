import axios from 'axios';
import { lookup } from 'mime-types';

export async function getFileBufferAndMime(fileUrl: string) {
  try {
    // Set responseType to 'arraybuffer' to get the raw data
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
    });

    // Get MIME type from response headers or fallback to file extension
    const mimeType =
      response.headers['content-type'] ||
      lookup(fileUrl) ||
      'application/octet-stream';

    // Convert arraybuffer to Buffer
    const buffer = Buffer.from(response.data);

    return { buffer, mimeType };
  } catch (error) {
    throw new Error(`Failed to fetch file: ${error}`);
  }
}
