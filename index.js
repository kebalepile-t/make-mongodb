const fs = require('fs'),
	path = require('path'),
	mongoClient = require("mongodb").MongoClient;




// get the json & read it 

let address = fs.readFileSync(__dirname + '/dataset/m3-customer-address-data.json', 'utf8'),
	batho = fs.readFileSync(__dirname + '/dataset/m3-customer-data.json', 'utf8');

// turn the json to javascript objects

address = JSON.parse(address)
batho = JSON.parse(batho)
let num = 0,
	run = true;

// merge each address to the right person
let barekie = batho.reduce((list, motho, index) => {
	list.push({
		...motho,
		...address[index]
	})
	return list;
}, [])


let url = 'mongodb://localhost:27017';

// connecting to mongodb
mongoClient.connect(url, (err, client) => {
	if (err) throw err;
	console.log("o moteng !!")
	client.db("Bitcoin_data")
		.collection("customers")
		.insertMany(
			barekie, {
				ordered: false
			})
	mphe(client, (info) => {
		fs.writeFile(__dirname + "/dataset/customers.json", JSON.stringify(info, null, 4), (err) => {
			if (err) throw err;

			console.log("a new json file with updated customer information has been written")
			console.log("Done database closed")
		})
		client.close()
	})
})


// get all documents form database
const mphe = function (db, done) {
	console.log("reading database")
	db.db("Bitcoin_data")
		.collection("customers")
		.find({})
		.project({
			_id: 0
		})
		.toArray((err, docs) => {
			if (err) return process.exit(1);
			done(docs)
		})

}
