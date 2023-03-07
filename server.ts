import express from "express";

const app = express();
const PORT: number = 3000;

app.get("/", (req, res) => {
  res.send("Hello world!!");
});

app.listen(PORT, () => console.log(`Server is running on PORT:${PORT}`));
