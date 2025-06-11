import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes : ['id', 'name', 'email'],
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }

}

//register
export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.json({ msg: "Register berhasil" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan saat register" });
  }
};

// login
export const Login = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                email: req.body.email
            }
        });
        
        const match = await bcrypt.compare(req.body.password, users[0].password);
        if (!match) return res.status(400).json({ msg: "Password salah" });
        
        const userId = users[0].id;
        const name = users[0].name;
        const email = users[0].email;

        const accessToken = jwt.sign(
            { userId, name, email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20s' }
        );

        const refreshToken = jwt.sign(
            { userId, name, email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await User.update({ refresh_token: refreshToken }, {
            where: { id: userId }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "Email tidak terdaftar" });
    }
};

//logout
export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await User.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;
        await User.update({ refresh_token: null }, {
            where: { id: userId }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
}


export const adminLogin = async (req, res) => {
