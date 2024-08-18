import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import checkAuth from "../middleware/checkAuth"; 
import { z } from "zod";

const prisma = new PrismaClient();
const router = express.Router();

// POST route to create a new product
router.post("/addproduct", checkAuth, async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Product name is required" });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                name,
            },
        });

        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error @ product.addproduct" });
    }
});


// POST route to create a new product request
router.post("/:productId/requestprice", checkAuth, async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { desiredPrice } = req.body;

    try {
        // Ensure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated, please sign in again." });
        }

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }

        // Check if the user has already requested a price for this product
        const existingRequest = await prisma.productRequest.findUnique({
            where: {
                productId_userId: {
                    productId: parseInt(productId),
                    userId: req.user.id,
                },
            },
        });

        let request;
        if (existingRequest) {
            // Update the existing request
            request = await prisma.productRequest.update({
                where: {
                    id: existingRequest.id,
                },
                data: {
                    desiredPrice: desiredPrice,
                },
            });
        } else {
            // Create a new request
            request = await prisma.productRequest.create({
                data: {
                    desiredPrice: desiredPrice,
                    productId: parseInt(productId),
                    userId: req.user.id,
                },
            });
        }

        res.status(201).json({ message: existingRequest ? "Request updated successfully" : "Request created successfully", request });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error @ products.requestprice" });
    }
});


// Define schema for post data
const postSchema = z.object({
    textContent: z.string().min(1, "Text content is required"),
});

router.post("/:productId/addpost", checkAuth, async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { textContent } = req.body;

    // Validate input
    const validation = postSchema.safeParse({ textContent });

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.format() });
    }

    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const newPost = await prisma.post.create({
            data: {
                productId: parseInt(productId),
                userId: req.user.id,
                textContent,
            },
        });

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST route to like a post
router.post("/:postId/like", checkAuth, async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Increment likes
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId) },
            data: { likes: post.likes + 1 },
        });

        res.status(200).json({ message: "Post liked successfully", post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST route to dislike a post
router.post("/:postId/dislike", checkAuth, async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Check if the post exists
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Increment dislikes
        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId) },
            data: { dislikes: post.dislikes + 1 },
        });

        res.status(200).json({ message: "Post disliked successfully", post: updatedPost });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// GET route to retrieve data for a searched product
router.get("/:productId/fetchprices", async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        // Find the product by its ID
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) },
            include: {
                requests: true, // Include the related product requests
            },
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Aggregate the requests by price to show how many people are willing to buy at different price points
        const aggregatedRequests = product.requests.reduce((acc: any, request) => {
            if (!acc[request.desiredPrice]) {
                acc[request.desiredPrice] = 0;
            }
            acc[request.desiredPrice]++;
            return acc;
        }, {});

        res.status(200).json({
            productId: product.id,
            productName: product.name,
            aggregatedRequests, // Show how many people are willing to buy at different price points
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error @ products.getall" });
    }
});

// GET route to retrieve all posts for a given product
router.get("/:productId/fetchposts", async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        // Retrieve posts for the specified product
        const posts = await prisma.post.findMany({
            where: { productId: parseInt(productId) },
            orderBy: { likes: 'desc' }, // Optional: Order posts by creation date
            include: {
                user: true, // Optionally include user information
            },
        });

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error @ products.fetchposts" });
    }
});


// GET route to search for products by name
router.get("/search", async (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: query,
                },
            },
        });

        res.status(200).json({ products });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;