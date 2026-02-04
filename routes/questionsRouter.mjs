import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import postQuestionValidate from "../middlewares/post.questionValidate.mjs";
import putQuestionValidate from "../middlewares/put.questionValidate.mjs";

const questionsRouter = Router();

// user can create a question
questionsRouter.post("/", [postQuestionValidate], async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const result = await connectionPool.query(
      "INSERT INTO questions (title, description, category) VALUES ($1, $2, $3)",
      [title, description, category],
    );
    return res.status(201).json({
      message: "Question created successfully",
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(500).json({ message: "Unable to create question" });
  }
});

// user can get all questions
questionsRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT * FROM questions");
    return res.status(200).json({
      message: "Questions fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Unable to fetch questions" });
  }
});

// user can search questions by title or category
questionsRouter.get("/search", async (req, res) => {
  try {
    // เช็คค่าพารามิเตอร์ title และ category จาก query string ต้องไม่เป็นค่าว่าง
    const title = req.query.title?.trim();
    const category = req.query.category?.trim();

    // อย่างน้อยต้องมีพารามิเตอร์ตัวใดตัวหนึ่งถึงจะทำการค้นหาได้
    if (!title && !category) {
      return res.status(400).json({
        message:
          "Invalid search parameters, at least one search parameter (title or category) is required",
      });
    }

    // เตรียมค่าพารามิเตอร์สำหรับการค้นหา ในรูปแบบ ILIKE %% (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่)
    const titleParam = title ? `%${title}%` : null;
    const categoryParam = category ? `%${category}%` : null;

    const result = await connectionPool.query(
      `SELECT * FROM questions 
      WHERE ($1::text IS NULL OR title ILIKE $1) 
      AND ($2::text IS NULL OR category ILIKE $2)`,
      [titleParam, categoryParam],
    );

    // ถ้าไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found matching the criteria" });
    }

    // ถ้าพบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Error searching questions:", error);
    return res.status(500).json({ message: "Unable to fetch questions" });
  }
});

// user can get question by id
questionsRouter.get("/:questionId", async (req, res) => {
  const { questionId } = req.params;
  try {
    const result = await connectionPool.query(
      "SELECT * FROM questions WHERE id = $1",
      [questionId],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Question id ${questionId} not found` });
    }
    return res.status(200).json({
      message: "Question fetched successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(500).json({ message: "Unable to fetch questions" });
  }
});

// user can update question by id
questionsRouter.put("/:questionId", [putQuestionValidate], async (req, res) => {
  const { questionId } = req.params;
  const { title, description, category } = req.body;
  try {
    // ถ้าผ่านการตรวจสอบทั้งหมดแล้ว ให้ทำการอัพเดตข้อมูลได้
    await connectionPool.query(
      "UPDATE questions SET title = $1, description = $2, category = $3 WHERE id = $4",
      [title, description, category, questionId],
    );

    return res.status(200).json({
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return res.status(500).json({ message: "Unable to update question" });
  }
});

// user can delete question by id
questionsRouter.delete("/:questionId", async (req, res) => {
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
    // ถ้ามีข้อมูล question ให้ทำการลบข้อมูลซึ่งรวมถึงคำตอบที่เกี่ยวข้องทั้งหมดด้วย
    // เพราะมีการตั้งค่า ON DELETE CASCADE ไว้ใน foreign key ของ database
    await connectionPool.query("DELETE FROM questions WHERE id = $1", [
      questionId,
    ]);
    return res.status(200).json({
      message: `Question post id ${questionId} has been deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({ message: "Unable to delete question" });
  }
});

export default questionsRouter;
