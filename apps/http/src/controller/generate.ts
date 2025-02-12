import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";

export const generate = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You are an expert article generation assistant. You can generate engaging and entertaining articles of 150 to 200 words.",
    });

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).send("Prompt is required");
    }

    const streamingResp = await model.generateContentStream(prompt);

    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of streamingResp.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
