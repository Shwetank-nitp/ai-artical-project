import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";

export const optimize = async (req: Request, res: Response) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "You are an expert article generation assistant. Your task is OPTIMIZE the given context and generate engaging and entertaining articles of 150 to 200 words.",
    });

    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).send("Prompt is required");
    }

    const streamingResp = await model.generateContentStream(
      JSON.stringify({
        context: prompt,
      })
    );

    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of streamingResp.stream) {
      const chunkText = chunk.text();
      res.write(chunkText);
    }

    res.end();
  } catch (error) {
    console.log(error);
  }
};
