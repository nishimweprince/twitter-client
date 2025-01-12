import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi(process.env.X_AUTH_TOKEN as string).v1;

export default twitterClient;

export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
  const waitTime =
    Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};
