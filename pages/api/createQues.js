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
	if (mongoose.connection.readyState === 0) {
		await connectToDatabase();
	}

	const {ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight} = req.body;

	const question = new Question({
		ques,
		quesImageBase64,
		quesImageWidth,
		quesImageHeight,
		ans,
		ansImageBase64,
		ansImageWidth,
		ansImageHeight,
	});
	
	question.save(err => res.send(err));
	res.send({status: 'Success'});
}
