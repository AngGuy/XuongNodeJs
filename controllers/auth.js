import User from "../models/User";
import { registerSchema } from "../validations/auth";
import bcryptjs from "bcryptjs";

export const register = async (req, res) => {
  try {
    /**
     * 1. Kiem tra du lieu dau vao
     * 2. Kiem tra email da ton tai chua?
     * 3. Ma hoa mat khau
     * 4. Tao user moi
     * 5. Thong bao thanh cong
     */

    const { email, password } = req.body;

    // if (email === "" || password === "") {
    //   return res
    //     .status(400)
    //     .json({ message: "Email va password khong duoc de trong!" });
    // }

    const { error } = registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((item) => item.message);
      return res.status(400).json({ messages: errors });
    }

    // ? B2: Kiem tra email da ton tai chua?
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email da ton tai!" });
    }

    // B3: Ma hoa mat khau

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // B4: Tao user moi

    const user = await User.create({ ...req.body, password: hashPassword });
    user.password = undefined;
    return res.status(201).json({
      message: "Dang ky thanh cong!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
