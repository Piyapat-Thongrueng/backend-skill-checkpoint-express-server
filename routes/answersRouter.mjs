import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import postAnswerValidate from "../middlewares/post.answerValidate.mjs";

const answersRouter = Router();

// user can create answer for a question
answersRouter.post("/:questionId/answers",[postAnswerValidate], async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;
  try {
    // ถ้าผ่านการตรวจสอบทั้งหมดแล้ว ให้ทำการเพิ่มคำตอบได้
    await connectionPool.query(
      "INSERT INTO answers (question_id, content) VALUES ($1, $2)",
      [questionId, content],
    );
    return res.status(201).json({
      message: "Answer created successfully",
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    return res.status(500).json({ message: "Unable to create answer" });
  }
});

// user can get all answers for a question
answersRouter.get("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    // ตรวจสอบว่ามี questionId นี้อยู่ในฐานข้อมูลหรือไม่
    const existingQuestion = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId],
    );
    if (existingQuestion.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Question id ${questionId} not found` });
    }
    const result = await connectionPool.query(
      "SELECT * FROM answers WHERE question_id = $1",
      [questionId],
    );
    return res.status(200).json({
      message: "Answers fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return res.status(500).json({ message: "Unable to fetch answers" });
  }
});

// user can delete all answers for a question
answersRouter.delete("/:questionId/answers", async (req, res) => {
  const { questionId } = req.params;
  try {
    // ตรวจสอบว่ามี questionId นี้อยู่ในฐานข้อมูลหรือไม่
    const existingQuestion = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId],
    );
    if (existingQuestion.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Question id ${questionId} not found` });
    }
    // ลบคำตอบทั้งหมดที่เกี่ยวข้องกับ questionId นี้
    await connectionPool.query("DELETE FROM answers WHERE question_id = $1", [
      questionId,
    ]);
    return res.status(200).json({
      message: `All answers for question id ${questionId} have been deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting answers:", error);
    return res.status(500).json({ message: "Unable to delete answers" });
  }
});

export default answersRouter;