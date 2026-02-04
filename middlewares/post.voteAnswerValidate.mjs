import connectionPool from "../config/database.mjs";

const voteAnswerValidate = async (req, res, next) => {
  const { answerId } = req.params;
  const { vote } = req.body; // vote should 1 or -1
  // ตรวจสอบว่ามี answerId นี้อยู่ในฐานข้อมูลหรือไม่
  const existingAnswer = await connectionPool.query(
    "SELECT * FROM answers WHERE id = $1",
    [answerId],
  );
  if (existingAnswer.rows.length === 0) {
    return res.status(404).json({ message: `Answer id ${answerId} not found` });
  }
  if (vote !== 1 && vote !== -1) {
    return res
      .status(400)
      .json({ message: "Invalid vote value, must be 1 or -1" });
  }
  next();
};

export default voteAnswerValidate;
