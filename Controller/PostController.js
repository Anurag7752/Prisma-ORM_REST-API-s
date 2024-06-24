import { PrismaClient } from '@prisma/client';
import dbConfig from "../DB/db_config.js"

// Initialize Prisma Client
const prisma = new PrismaClient();

export const fetchPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }

  const skip = (page - 1) * limit;

  try {
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      include: {
        comment: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      where: {
        NOT: {
          title: {
            endsWith: "Blog",
          },
        },
      },
    });

    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    return res.json({
      status: 200,
      data: posts,
      meta: {
        totalPages,
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Failed to fetch posts.' });
  }
};

export const createPost = async (req, res) => {
  const { user_id, title, description } = req.body;

  try {
    const newPost = await prisma.post.create({
      data: {
        user_id: Number(user_id),
        title,
        description,
      },
    });

    return res.json({ status: 200, data: newPost, msg: "Post created." });
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Failed to create post.' });
  }
};

export const showPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(postId),
      },
    });

    return res.json({ status: 200, data: post });
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Failed to fetch post.' });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return res.json({ status: 200, msg: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Failed to delete post.' });
  }
};

export const searchPost = async (req, res) => {
  const query = req.query.q;

  try {
    const posts = await prisma.post.findMany({
      where: {
        description: {
          search: query,
        },
      },
    });

    return res.json({ status: 200, data: posts });
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Failed to search posts.' });
  }
};
