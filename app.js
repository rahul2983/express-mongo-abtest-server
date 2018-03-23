const express = require('express');
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb://localhost/abTestingServerDB';
const Abtest = require('./model/abtest');

const bodyParser = require('body-parser');

// used for hosting the test page under dist with main.js
const cors = require('cors');
app.use(cors()); // Use this after the variable declaration

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Future endpoint for login

app.post('/api/abtest/create', (req, res) => {
	mongoose.connect(url, function(err){
		if(err) throw err;
		console.log('connection established for create');
		const abtest = new Abtest({
			url: req.body.url,
			codeSnippet: req.body.codeSnippet,
			testName: req.body.testName,
			testDescription: req.body.testDescription,
			testStatus: req.body.testStatus,
			testType: req.body.testType
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
			{ 
				$set:
				{
					codeSnippet : req.body.codeSnippet,
					testStatus: req.body.testStatus,
					modifiedDom: req.body.modifiedDom 
				}
			},
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

app.post('/api/abtest/saveAudienceInfo', (req, res) => {
	mongoose.connect(url, function(err) {
    console.log('connection established for saveAudienceInfo');
    Abtest.update(
      { _id: req.body.id },
      { 
        $set: 
        { 
          deviceType: req.body.deviceType,
          testStatus: req.body.testStatus,
          testTraffic: req.body.testTraffic
        }
      },
      (err, doc) => {
        if(err) throw err;
        return res.status(200).json({
          status: 'success',
          data: doc
        });
      });
  });
});

app.post('/api/abtest/deleteAbTest', (req, res) => {
  mongoose.connect(url, function(err) {
    console.log('connection established for deleteAbTest');
    if (err) throw err;
    Abtest.findByIdAndRemove(req.body.id,
      (err, doc) => {
        if(err) throw err;
        return res.status(200).json({
          status: 'success',
          data: doc
        });
      });
    });
  });

//Middleware
app.use(express.static(__dirname + '/public' ));

app.post('/', (req, res) => {
  res.send("Success");
});

app.listen(3000, () => console.log('AbTestingServer server running on port 3000!'));
