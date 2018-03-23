const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const abTestSchema = new Schema({
  url: { type: String, required: true },
  codeSnippet: { type: String },
  testName: { type: String, required: true },
  testDescription: { type: String, required: true },
  testQueryParam: { type: String },
  testStatus: { type: String },
  testTraffic: { type: Number },
  deviceType: { type: String },
  modifiedDom: { type: String },
  testType: { type: String }
}, { collection: 'abtest' });

const Abtest = mongoose.model('Abtest', abTestSchema);
module.exports = Abtest;
