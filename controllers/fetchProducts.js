const db = require("../routes/db-config");

const fetchProducts = (req,res,next) =>{

    db.query("SELECT * FROM products", (Err, result) => {
        if (Err) throw Err;

            req.products = result;
            return next();
        
    })
}

module.exports = fetchProducts;