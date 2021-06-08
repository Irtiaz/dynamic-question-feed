import React from 'react';
import mongoose from 'mongoose';
import Head from 'next/head';
import Link from 'next/link';

import QuestionModel from '../models/QuestionModel.js';

import Question from './Components/Question.js';
import styles from '../styles/Home.module.css';

export default class Home extends React.Component {

	render() {
		const questionList = JSON.parse(this.props.questions);
		const Questions = [];
		for (let q of questionList) {
			const {_id, ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight} = q;
			const QuestionItem = 
				<Question 
					ques={ques}
					quesImageBase64={quesImageBase64}
					quesImageWidth={quesImageWidth}
					quesImageHeight={quesImageHeight}
					ans={ans}
					ansImageBase64={ansImageBase64 || ""}
					ansImageWidth={ansImageWidth}
					ansImageHeight={ansImageHeight}
					key={_id}
				/>;
			Questions.push(QuestionItem);
		}

		return (
			<>
				<Head>
					<title>Interesting Questions</title>
				</Head>
				<div>
					<div className={styles.admin_login}>
						<Link href="/admin">
							<a>Login as admin</a>
						</Link>
					</div>
					{Questions}
				</div>
			</>
		);
	}
}

export async function getStaticProps(context) {
	const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@testing.hwpac.mongodb.net/questions?retryWrites=true&w=majority`;
	if (mongoose.connection.readyState == 0) {
		await mongoose.connect(dbURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});
	}

	const questions = await QuestionModel.find({});

	return {
		props: {
			questions: JSON.stringify(questions),
		},
		revalidate: 10
	};
}
