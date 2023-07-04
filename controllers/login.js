//endpoint da api para consultar os dados no db, comparar com o inserido e autorizar o login
const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const login = async (req, res) =>{
    const {user, password} = req.body;
    if(!user || !password) return res.json({status : "error", error: "Digite seu login e senha!"});
    else{
        db.query("SELECT * FROM users WHERE user = ?", [user], async (Err, result) => {
            if (Err) throw Err;
            if(!result.length || !await bcrypt.compare(password, result[0].password)) return res.json({status: "error", error: "Login ou senha incorretos"})
            else{
                const token = jwt.sign({id: result[0].id}, process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES
                })
                const cookieOptions = {
                    expiresIn: new Date(Date.now(), + process.env.COOKIE_EXPIRES * 24 * 60 *60 *1000),
                    httpOnly: true
                }
                res.cookie("userRegistered", token, cookieOptions);
                return res.json({status: "success", success: "Usuario logado"});
            }
        })
    }
}

module.exports = login;