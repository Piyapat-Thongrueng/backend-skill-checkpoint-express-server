import connectionPool from "../utils/db.mjs";

const putQuestionValidate = async (req, res, next) => {
  const { questionId } = req.params;
  const { title, description, category } = req.body;
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
  // ถ้าไม่มี title ให้ return error
  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ message: "Invalid request data, title is required field" });
  }
  // ตรวจสอบความยาวของ title ไม่ให้เกิน 255 ตัวอักษร
  if (title.length > 255) {
    return res
      .status(400)
      .json({ message: "Title exceeds maximum length of 255 characters" });
  }
  next();
};

export default putQuestionValidate;
