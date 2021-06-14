const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
	ques: String,
	quesImageBase64: String,
	quesImageWidth: Number,
	quesImageHeight: Number,

	ans: String,
	ansImageBase64: String,
	ansImageWidth: Number,
	ansImageHeight: Number,

	keywords: {
		type: Map,
		of: String
	},

	finalAns: String
});

let exp;
if (mongoose.models === undefined || mongoose.models.Question === undefined) exp = mongoose.model('Question', questionSchema);
else exp = mongoose.models.Question;

module.exports = exp;
