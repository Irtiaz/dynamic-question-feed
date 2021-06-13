import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import mongoose from 'mongoose';

import QuestionModel from '../../models/QuestionModel.js';
import Question from '../Components/Question.js';

import styles from '../../styles/SpecificQuestion.module.css';

export default class SpecificQuestion extends React.Component {
	render() {
		const question = JSON.parse(this.props.question);
		const {_id, ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight, keywords} = question;

		return (
			<>
				<Head>
					<title>BRAINFREEZE Question</title>
				</Head>
				<div>
					<Question 
						id={_id}
						ques={ques}
						quesImageBase64={quesImageBase64}
						quesImageWidth={quesImageWidth}
						quesImageHeight={quesImageHeight}
						ans={ans}
						ansImageBase64={ansImageBase64 || ""}
						ansImageWidth={ansImageWidth}
						ansImageHeight={ansImageHeight}
						keywords={keywords}
					/>
					<div className={styles.link_container}>
						Visit{" "}
						<Link href="/">
							<a>BRAINFREEZE</a>
						</Link>{" "}
						for more questions like this
					</div>
				</div>
			</>
		);
	}
}

export async function getServerSideProps(context) {
	const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@testing.hwpac.mongodb.net/questions?retryWrites=true&w=majority`;
	if (mongoose.connection.readyState == 0) {
		await mongoose.connect(dbURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});
	}

	let questions = [];
	try {
		questions = await QuestionModel.find({_id: context.params.id});
	} catch(e) {}

	if (questions.length === 0) {
		return {
			props: {
				question: null
			},
			notFound: true
		};
	} else {
		return {
			props: {
				question: JSON.stringify(questions[0])
			}
		};
	}
}
