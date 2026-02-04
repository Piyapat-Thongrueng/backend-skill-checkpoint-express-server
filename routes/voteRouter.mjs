import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import postVoteQuestionValidate from "../middlewares/post.voteQuestionValidate.mjs";

const voteRouter = Router();

// user can vote on a question
voteRouter.post("/questions/:questionId/vote",[postVoteQuestionValidate],async (req, res) => {
    const { questionId } = req.params;
    const { vote } = req.body; // vote should 1 or -1
    try {
      await connectionPool.query(
        "UPDATE question_votes SET vote = $1 WHERE question_id = $2",
        [vote, questionId],
      );

      return res.status(200).json({
        message: `Vote on question id ${questionId} has been recorded successfully`,
      });
    } catch (error) {
      console.error("Error voting on question:", error);
      return res.status(500).json({ message: "Unable to vote on question" });
    }
  },
);

// user can vote for an answer
voteRouter.post("/answers/:answerId/vote", async (req, res) => {
  const { answerId } = req.params;
  const { vote } = req.body; // vote should 1 or -1
  try {
    await connectionPool.query(
      "UPDATE answer_votes SET vote = $1 WHERE answer_id = $2",
      [vote, answerId],
    );
    return res.status(200).json({
      message: `Vote on answer id ${answerId} has been recorded successfully`,
    });
  } catch (error) {
    console.error("Error voting on answer:", error);
    return res.status(500).json({ message: "Unable to vote on answer" });
  }
});


export default voteRouter;
