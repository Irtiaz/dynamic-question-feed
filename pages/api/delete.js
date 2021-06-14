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
	if (req.body.token !== process.env.TOKEN) {
		res.send({status: 'Error'});
		return;
	}

	if (mongoose.connection.readyState === 0) {
		await connectToDatabase();
	}
	
	await Question.deleteOne({_id: req.body._id}, (err, result) => {
		if (err) res.send(err);
	});

	res.send({status: 'Success'});
}
