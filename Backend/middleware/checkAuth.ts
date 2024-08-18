import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import JWT_SECRET from "../config";

const prisma = new PrismaClient();

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Access Denied" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET as string, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid Token" });
    }

    // Assuming `decoded` contains the user's ID
    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Attach user information to the request object
      req.user = user;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error @ auth" });
    }
  });
};

export default checkAuth;
