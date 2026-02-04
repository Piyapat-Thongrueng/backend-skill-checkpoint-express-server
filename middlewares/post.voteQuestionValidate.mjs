import connectionPool from "../utils/db.mjs";

const postVoteQuestionValidate = async (req, res, next) => {
  const { questionId } = req.params;
  const { vote } = req.body; // vote should 1 or -1
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
  if (vote !== 1 && vote !== -1) {
    return res
      .status(400)
      .json({ message: "Invalid vote value, must be 1 or -1" });
  }
  next();
};

export default postVoteQuestionValidate;
