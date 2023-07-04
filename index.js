//requisições do servidor

const express = require('express');
const db = require('./routes/db-config');
const app = express();
const body_parser = require('body-parser');
const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PORT = process.env.PORT || 3000;
app.use(body_parser.urlencoded({ extended : false }));
app.use(body_parser.json());
const jwt = require("jsonwebtoken");


//ferramentas do servidor
app.use("/js",express.static(__dirname + "/public/js"));
app.use("/css",express.static(__dirname + "/public/css"));
app.use(express.static(__dirname + "/public/src"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());
const fetchProducts = require('./controllers/fetchProducts');
const loggedIn = require("./controllers/loggedIn");
const { render } = require('ejs');
db.connect((err) =>{
  if(err) throw err;
});
app.use("/", require("./routes/pages"));
app.use("/api", require('./controllers/auth'));
app.listen(PORT, ()=>{
  console.log(`Servidor escutando em http://localhost:${PORT}`);
});

app.use(session({
	secret : '1234567dasateasd',
	resave : false,
	saveUninitialized : true,
	cookie : { secure : false }
}));

app.get("/produtos",loggedIn ,fetchProducts,(req, res) =>{
	if(!req.session.cart)
	{
		req.session.cart = [];
	}
	
	if(req.user){
    
      res.render("produtos", {status:"LoggedIn", user: req.user , products : req.products, cart : req.session.cart});
    } else{
      res.render("produtos", {status:"Not loggedIn", user:"nothing" , products : req.products, cart : req.session.cart})
    }

})

app.post('/add_cart', (request, response) => {

	const product_category = request.body.product_category;
	const product_id = request.body.product_id;
	const product_name = request.body.product_name;
	const product_efficiency = request.body.product_efficiency;
	const price = request.body.price;

	let Fmult;
	let desconto;
    if(product_category == "aquecedores"){
        Fmult = 1;
    }if (product_category == "fogao"){
        Fmult = 1.5;
    }if (product_category == "microondas"){
        Fmult = 0.8;
    }if (product_category == "lampadas"){
        Fmult = 0.03;
    }if (product_category == "lava e seca"){
        Fmult = 7;
    }if (product_category == "Ventilador"){
        Fmult = 0.5;
    }if (product_category == "televisores"){
        Fmult = 5;
    }if (product_category == "geladeiras"){
        Fmult = 10;
	}

	desconto = product_efficiency *Fmult;
    
	let count = 0;

	for(let i = 0; i < request.session.cart.length; i++)
	{

		if(request.session.cart[i].product_id === product_id)
		{
			request.session.cart[i].quantity += 1;

			count++;
		}

	}

	if(count === 0)
	{
		const cart_data = {
			product_category: product_category,
			product_id : product_id,
			product_name : product_name,
			product_efficiency: product_efficiency,
			product_desconto: desconto,
			price : parseFloat(price),
			quantity : 1
		};

		request.session.cart.push(cart_data);
	}

	response.redirect("/produtos");

});

app.get('/remove_item', (request, response) => {

	const product_id = request.query.id;

	for(let i = 0; i < request.session.cart.length; i++)
	{
		if(request.session.cart[i].product_id === product_id)
		{
			request.session.cart.splice(i, 1);
		}
	}

	response.redirect("/produtos");

});

app.get('/checkout',loggedIn , (req, res) => {

	if(req.user){
		if(req.session.cart)
	{
		req.checkout = req.session.cart
	}
		
		res.render("checkout", {status:"LoggedIn", user: req.user ,  checkout_cart : req.checkout});
	  } else{

		//o que fazer se ele montou carrinho e não esta logado??
		// res.render("produtos", {status:"Not loggedIn", user:"nothing" , products : req.products, cart : req.session.cart})
	  }

})

app.get('/buy', loggedIn, (req, res) =>{
	if(req.user){
		if(req.session.cart){
			

			const product_id = req.body.product_id;
			const product_efficiency = req.body.product_efficiency;


			let EE_rate_new = 0;
			let count = 0;

		for(let i = 0; i < req.session.cart.length; i++){
			EE_rate_new = EE_rate_new + parseFloat(req.session.cart[i].product_efficiency)
			count ++;
		}

		EE_rate_new = EE_rate_new/count;
		req.session.cart = [];
			try{
				const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
				db.query('SELECT EE_rate FROM users WHERE id = ?',[decoded.id],(err, result) =>{
					if(err) return err;
				resultado = result[0].EE_rate
				EE_rate_new = (EE_rate_new+resultado)/2
				
				db.query('UPDATE users SET EE_rate = ? WHERE id = ?',[EE_rate_new,decoded.id],(err, result) =>{
					if(err) return err;
					res.render("index", {status:"LoggedIn", user: req.user});
				})
				})
			} catch (err){
				if(err) console.log(err);
			}
		}
	}
})
// routes.js

// ...

app.get('/ranking', (req, res) => {
	const query = 'SELECT * FROM users ORDER BY EE_rate DESC LIMIT 10';
	db.query(query, (err, results) => {
	  if (err) {
		console.error('Erro ao buscar o ranking: ', err);
		res.status(500).json({ error: 'Erro ao buscar o ranking.' });
		return;


	  }
	  req.results = results;  
	  res.render("ranking",{results : req.results});	
	});
  });
  
  