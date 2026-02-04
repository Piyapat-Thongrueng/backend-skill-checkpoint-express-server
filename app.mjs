import "dotenv/config";
import express from "express";
import questionsRouter from "./routes/questionsRouter.mjs";
import answersRouter from "./routes/answersRouter.mjs";
import voteRouter from "./routes/voteRouter.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/questions", questionsRouter);
app.use('/questions', answersRouter);
app.use("/", voteRouter);


app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
