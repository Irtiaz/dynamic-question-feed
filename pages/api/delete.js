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
	
	await Question.deleteOne(req.body, (err, result) => {
		if (err) res.send(err);
	});

	res.send({status: 'Success'});
}
