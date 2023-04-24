import express from "express";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5500"],
  })
);

app.use(
  express.static(path.dirname(new URL(import.meta.url).pathname) + "/client")
);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const response = async (from, to, code) => {
  let res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `##### Translate this function from ${from} into ${to}\n\n### ${from}\n\n${code}\n\n### ${to}\n\n`,
    temperature: 0,
    max_tokens: 2048,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["###"],
  });
  return res.data.choices[0].text;
};

app.get("/", (req, res) => {
  const indexFile =
    path.dirname(new URL(import.meta.url).pathname) + "/client/index.html";
  res.sendFile(indexFile);
});

app
  .post("/translate", async (req, res) => {
    const { from, to, code } = req.body;
    console.log("from: " + from);
    console.log("to: " + to);
    console.log("code: " + code);
    const result = await response(from, to, code);
    res.status(200).json({ data: result });
  })
  .listen(3000);
