import { Router } from "express";
import { PostController } from "./post.controller";

const postController = new PostController();

const router = Router();

router.post('/', postController.createPost);
router.get('/:id', postController.fetchPosts);

export default router;
