import mongoose from 'mongoose';
import Question from '../../models/QuestionModel.js';

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@testing.hwpac.mongodb.net/questions?retryWrites=true&w=majority`;


async function connectToDatabase() {
	await mongoose.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});
}


export default async function handler(req, res) {
	const {token, ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight, keywords, finalAns, visible} = req.body;
	if (token !== process.env.TOKEN) {
		res.send({status: 'Error'});
		return;
	}

	if (mongoose.connection.readyState === 0) {
		await connectToDatabase();
	}

	const question = new Question({
		ques,
		quesImageBase64,
		quesImageWidth,
		quesImageHeight,
		ans,
		ansImageBase64,
		ansImageWidth,
		ansImageHeight,
		keywords,
		finalAns,
		visible
	});
	
	question.save(err => res.send(err));
	res.send({status: 'Success'});
}
