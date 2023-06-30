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

app.get("/", (req, res) => {
  const indexFile =
    path.dirname(new URL(import.meta.url).pathname) + "/client/index.html";
  res.sendFile(indexFile);
});

app
  .post("/translate", async (req, res) => {
    const { from, to, code, api_key } = req.body;

    const configuration = new Configuration({
      apiKey: api_key,
    });

    const openai = new OpenAIApi(configuration);

    try {
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
      res.status(200).send(res.data.choices[0].text);
    } catch (error) {
      console.log(error.response);
      res.status(error.response.status).json(error.response.data.error);
    }
  })
  .listen(
    3000,
    console.log(`app is running on port 3000 http://localhost:3000`)
  );
