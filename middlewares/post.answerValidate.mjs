import connectionPool from "../utils/db.mjs";

const postAnswerValidate = async (req, res, next) => {
  const { questionId } = req.params;
  const { content } = req.body;
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
  // ถ้า content ยาวเกิน 300 ตัวอักษร ให้ return error
  if (content.length > 300) {
    return res
      .status(400)
      .json({ message: "Content exceeds maximum length of 300 characters" });
  }
  next();
};

export default postAnswerValidate;
