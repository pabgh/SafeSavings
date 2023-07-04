//endpoint da api para persistir os dados do usuario no banco
const db = require("../routes/db-config");
const bcrypt = require("bcryptjs")

const register = async (req, res) => {
    const {login, password: Npassword} = req.body;
    if(!login || !Npassword) return res.json({status: "error", error: "Digite seu email e senha!"});
    else{
        db.query('SELECT user FROM users WHERE user = ?', [login], async (err, result) => {
            if(err) throw err;
            if(result[0]) return res.json({status : "error", error: "Esse login ja esta sendo utilizado"});
            else{
                const password = await bcrypt.hash(Npassword, 8);
                db.query("INSERT INTO users SET ?", {user: login, password: password}, (error, results) =>{
                    if(error) throw error;
                    return res.json({status : "success", success: "Usuario cadastrado"});
                })
            }
        })
    }
}

module.exports = register;