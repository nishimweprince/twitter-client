import { Request, Response, NextFunction } from 'express';
import { PostService } from './post.service';
import logger from '../helpers/logger.heper';

const postService = new PostService();

export class PostController {
  constructor() {}

  // CREATE POST
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, replyToTweetId, mediaUrls } = req.body;
      const response = await postService.createPost({
        status,
        replyToTweetId,
        mediaUrls,
      });
      res.status(200).json({
        data: response,
        message: 'Post created successfully',
      });
    } catch (error) {
        console.log(error)
      logger.error(error);
      next(error);
    }
  }

  // FETCH POSTS
  async fetchPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await postService.fetchPosts(id);
      res.status(200).json(response);
    } catch (error) {
      console.log(error)
      logger.error(error);
      next(error);
    }
  }
}
