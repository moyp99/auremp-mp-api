const express = require("express");
const app = express();
const mercadopago = require("mercadopago");
const cors = require('cors');

//REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel/credentials
mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../../client"));
app.use(cors());
app.options('*', cors());

app.get("/", function (req, res) {
  res.status(200).sendFile("index.html");
}); 

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [{
			title: req.body.description,
			unit_price: Number(req.body.price),
			quantity: Number(req.body.quantity),
		}],
		back_urls: {
			"success": "https://auremp.com/success",
			"failure": "https://auremp.com/failure",
			"pending": "https://auremp.com/pending"
		},
		auto_return: 'approved',
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({id :response.body.id})
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function(request, response) {
	 response.json({
		Payment: request.query.payment_id,
		Status: request.query.status,
		MerchantOrder: request.query.merchant_order_id
	})
});

app.listen(process.env.PORT || 3000, () => {
  console.log("The server is now running");
});