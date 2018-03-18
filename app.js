const express = require('express');
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb://localhost/abTestingServerDB';
const Abtest = require('./model/abtest');

const bodyParser = require('body-parser');

const cors = require('cors');
app.use(cors()); // Use this after the variable declaration

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/api/user/login', (req, res) => {
//   mongoose.connect(url, { useMongoClient: true}, function(err) {  
//     if(err) throw err; 
//     User.find({
//       username: req.body.username, password: req.body.password
//     }, function(err, user) {
//       if(err) throw err;
//       if(user.length === 1) {
//         return res.status(200).json({
//           status: 'success',
//           data: user
//         })
//       } else {
//         return res.status(200).json({
//           status: 'fail',
//           message: 'Login Failed'
//         })
//       }
//     })
//   });
// })

// app.post('/api/user/create', (req, res) => {
// 	mongoose.connect(url, function(err){
// 		if(err) throw err;
// 		const user = new User({
// 			name: req.body.name,
// 			username: req.body.username,
// 			password: req.body.password
// 		})
// 		user.save((err, res) => {
// 			if(err) throw err;
// 			return res.status(200).json({
// 				status: 'success',
// 				data: res
// 			})
// 		})
// 	});
// })

app.post('/api/abtest/create', (req, res) => {
	mongoose.connect(url, function(err){
		if(err) throw err;
		console.log('connection established for create');
		const abtest = new Abtest({
			url: req.body.url,
			codeSnippet: req.body.codeSnippet,
			testName: req.body.testName,
			testDescription: req.body.testDescription,
			testStatus: req.body.testStatus
		});
		abtest.save((err, doc) => {
			if(err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		})
	});
});

app.post('/api/abtest/getAllAbTests', (req, res) => {
	mongoose.connect(url, function(err){
		console.log('connection created for getAllAbTests');
		if(err) throw err;
		Abtest.find({},[],{ sort: { _id: -1 } },(err, doc) => {
			if(err) throw err;
			return res.status(200).json({
				status: 'success',
				data: doc
			})
		});
	});
});


app.post('/api/abtest/updateAbTest', (req, res) => {
	mongoose.connect(url, function(err) {
		console.log('connection established for updateAbTest');
		Abtest.update(
			{_id: req.body.id },
			{ codeSnippet : req.body.codeSnippet},
			{ testStatus: req.body.testStatus },
			(err, doc) => {
				if(err) throw err;
				return res.status(200).json({
					status: 'success',
					data: doc
				});
			}
		);
	});
});

app.post('/api/abtest/saveAbTest', (req, res) => {
	mongoose.connect(url, function(err) {
		console.log('connection established for saveAbTest');
		Abtest.update(
			{ testQueryParam: req.body.testQueryParam },
			{ testCookie: req.body.testCookie },
			{ testStatus: req.body.testStatus },
			(err, doc) => {
				if(err) throw err;
				return res.status(200).json({
					status: 'success',
					data: doc
				});
			}
		);
	});
});

// app.post('/api/post/deletePost', (req, res) => {
// 	mongoose.connect(url, { useMongoClient: true }, function(err) {
// 		if (err) throw err;
// 		Post.findByIdAndRemove(req.body.id,
// 			(err, doc) => {
// 			if(err) throw err;
// 			return res.status(200).json({
// 				status: 'success',
// 				data: doc
// 			})
// 		})
// 	});
// });

//Middleware
app.use(express.static(__dirname + '/public' ));

app.post('/', ( req ,res) => {
  res.send("Success");
});

app.listen(3000, () => console.log('AbTestingServer server running on port 3000!'));
