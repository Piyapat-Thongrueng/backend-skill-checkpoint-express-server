const postQuestionValidate = async (req, res, next) => {
  const { title, description, category } = req.body;
  // ตรวจสอบข้อมูลที่รับมาว่าครบถ้วนหรือไม่ (ต้องมี title ตามที่ database กำหนดไว้ว่า NOT NULL)
  // ส่วน description กับ category เป็นค่า optional
  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ message: "Invalid request data, title must not be empty" });
  }
  // ตรวจสอบความยาวของ title ไม่ให้เกิน 255 ตัวอักษร
  if (title.length > 255) {
    return res
      .status(400)
      .json({ message: "Title exceeds maximum length of 255 characters" });
  }
  next();
};

export default postQuestionValidate;
