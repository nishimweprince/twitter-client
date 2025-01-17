import { Post } from '../types/post.types';
import client, { wait } from '../helpers/twitter.helper';
import { getScraper } from '../helpers/scraper.helper';
import { MEDIA_TYPES } from './post.constants';
import { getFileBufferAndMime } from '../helpers/media.helper';
import logger from '../helpers/logger.heper';
import { AppError } from '../helpers/errors.helper';

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
    const scraper = await getScraper();

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
    logger.info(`Status length: ${status.length}`);

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
        logger.info(`Sending tweet`);
        response = await scraper.sendTweet(
          status.slice(0, 280),
          replyToTweetId,
          mediaData?.length
            ? mediaData?.map((media) => ({
                data: media.data,
                mediaType: media.type,
              }))
            : []
        );
      } catch (error) {
        logger.error(`Error creating tweet: ${error}`);
        throw new AppError(
          `Error creating tweet: ${error}`,
          500,
          'INTERNAL_SERVER_ERROR'
        );
      }
    }

    const responseData = await response?.json();
    logger.info(`Post created successfully`);
    return responseData;
  }

  // FETCH POSTS
  async fetchPosts(id: string) {
    const response = await client.tweet(id);
    return response;
  }
}
