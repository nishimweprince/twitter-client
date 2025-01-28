import { Post } from '../types/post.types';
import client, { splitTweetContent, wait } from '../helpers/twitter.helper';
import { getScraper } from '../helpers/scraper.helper';
import { MEDIA_TYPES } from './post.constants';
import { getFileBufferAndMime } from '../helpers/media.helper';
import logger from '../helpers/logger.heper';
import { AppError } from '../helpers/errors.helper';
import { scraper } from '../app';

export class PostService {
  constructor() {}

  // CREATE POST
  async createPost({
    status,
    replyToTweetId,
    mediaUrls,
  }: {
    status: string;
    replyToTweetId?: string;
    mediaUrls?: string[];
  }) {
    logger.info(`Creating post`, {
      status,
      replyToTweetId,
      mediaUrls,
    });
    let mediaData: { data: Buffer; type: keyof typeof MEDIA_TYPES }[] = [];
    if (mediaUrls?.length && mediaUrls?.length > 0) {
      mediaData = await Promise.all(
        mediaUrls.map(async (url) => {
          const { buffer, mimeType } = await getFileBufferAndMime(url);
          return { data: buffer, type: mimeType };
        })
      );
    }
    let response;
    logger.info(`Waiting for 1000 to 3000 seconds to avoid rate limiting`);
    await wait(1000, 3000);
    logger.info(`Status length: ${status?.length}`);

    if (
      status.length >
      (process?.env?.MAX_TWEET_LENGTH
        ? Number(process?.env?.MAX_TWEET_LENGTH)
        : 280)
    ) {
      try {
        logger.info(`Sending long tweet`);
        response = await scraper.sendLongTweet(
          status,
          replyToTweetId,
          mediaData?.length
            ? mediaData?.map((media) => ({
                data: media.data,
                mediaType: media.type,
              }))
            : []
        );
      } catch (error) {
        logger.error(`Error creating long tweet: ${error}`);
        throw new AppError(
          `Error creating long tweet: ${error}`,
          500,
          'INTERNAL_SERVER_ERROR'
        );
      }
    } else {
      try {
        logger.info(`Sending tweet thread`);
        const tweetChunks = splitTweetContent(status, 280);
        let previousTweetId = replyToTweetId;

        for (const [index, chunk] of tweetChunks.entries()) {
          logger.info(`Sending tweet chunk ${index + 1} of ${tweetChunks.length}`);
          
          // Only include media in first tweet
          const chunkMediaData = index === 0 && mediaData?.length 
            ? mediaData?.map((media) => ({
                data: media.data,
                mediaType: media.type,
              }))
            : [];

          response = await scraper.sendTweet(
            chunk.trim(),
            previousTweetId,
            chunkMediaData
          );

          const responseData = await response?.json() as { data?: { create_tweet?: { tweet_results?: { result?: { rest_id?: string } } } } };
          
          previousTweetId = responseData?.data?.create_tweet?.tweet_results?.result?.rest_id;

          if (index < tweetChunks.length - 1) {
            // Wait between tweets to avoid rate limiting
            await wait(1000, 2000);
          }
        }
      } catch (error) {
        logger.error(`Error creating tweet thread: ${error}`);
        throw new AppError(
          `Error creating tweet thread: ${error}`,
          500,
          'INTERNAL_SERVER_ERROR'
        );
      }
    }

    logger.success(`Post created successfully`);
  }

  // FETCH POSTS
  async fetchPosts(id: string) {
    const response = await client.tweet(id);
    return response;
  }
}
