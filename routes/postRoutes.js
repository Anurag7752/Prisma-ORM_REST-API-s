import { Router } from 'express';
import { createPost, deletePost, fetchPosts, searchPost, showPost, } from '../Controller/PostController.js';

const router = Router()

router.get("/", fetchPosts);
router.get("/:id", showPost);
router.post("/", createPost);
router.put("/:id", searchPost);
router.delete("/:id", deletePost);

export default router;