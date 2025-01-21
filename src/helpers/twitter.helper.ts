import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.X_AUTH_TOKEN as string).v1;

export default twitterClient;

// WAIT RANDOM TIME BETWEEN MIN AND MAX TIME
export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};

// SPLIT TWEET CONTENT INTO CHUNKS OF MAX 280 CHARACTERS
export const splitTweetContent = (
  content: string,
  maxLength: number
): string[] => {
  const tweets: string[] = [];
  let currentTweet = '';

  // First combine all content, replacing multiple newlines with single newline
  const normalizedContent = content.replace(/\n{3,}/g, '\n');
  
  const words = normalizedContent.split(' ');

  for (const word of words) {
    const potentialTweet = currentTweet ? `${currentTweet} ${word}` : word;

    if (potentialTweet.length <= maxLength) {
      currentTweet = potentialTweet;
    } else {
      if (currentTweet) {
        tweets.push(currentTweet.trim());
      }
      currentTweet = word;
    }
  }

  if (currentTweet) {
    tweets.push(currentTweet.trim());
  }

  return tweets;
};

function splitParagraph(paragraph: string, maxLength: number): string[] {
  const words = paragraph.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).trim().length <= maxLength) {
      if (currentChunk) {
        currentChunk += ' ' + word;
      } else {
        currentChunk = word;
      }
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
