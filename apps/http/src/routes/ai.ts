import { Router, Request, Response, NextFunction } from "express";
import { generate } from "../controller/generate";
import { optimize } from "../controller/optimize";

//@ts-ignore
const aiRoutes: Router = Router();

// Define the type for the request handler functions
type RequestHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void;

// Ensure generate and optimize are of type RequestHandler
aiRoutes.post("/generate", generate as RequestHandler);
aiRoutes.post("/optimize", optimize as RequestHandler);

export default aiRoutes;
