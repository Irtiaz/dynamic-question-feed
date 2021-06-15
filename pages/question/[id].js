import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import mongoose from 'mongoose';

import HomeCircleIcon from 'mdi-react/HomeCircleIcon';
import InformationIcon from 'mdi-react/InformationIcon';
import AlertIcon from 'mdi-react/AlertIcon';
import CloseBoxIcon from 'mdi-react/CloseBoxIcon';

import QuestionModel from '../../models/QuestionModel.js';
import Question from '../Components/Question.js';

import styles from '../../styles/SpecificQuestion.module.css';

export default class SpecificQuestion extends React.Component {

	state = {
		showAlert: true
	};

	closeAlert = () => {
		this.setState({
			showAlert: false
		});
	}

	render() {
		const question = JSON.parse(this.props.question);
		const {_id, ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight, keywords, finalAns} = question;


		let LandscapeAlert = null;
		if (this.state.showAlert) {
			LandscapeAlert = 
				<div className="alert">
					<div className="alert_text">
						<AlertIcon size="1.2em" className="alert_icon" />
						Having problem reading? <br />
						Try the landscape mode!
					</div>
					<button onClick={this.closeAlert} className="close_alert">
						<CloseBoxIcon size="1.5em" />
					</button>
				</div>;
		}

		return (
			<>
				<Head>
					<title>BRAINFREEZE Question</title>
				</Head>
				<div style={{color: "var(--fg0)"}}>
					
					{LandscapeAlert}

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
						finalAns={finalAns}
					/>

					<div className={styles.info}>
						<HomeCircleIcon />
						<div className={styles.description}>
							Visit{" "}
							<Link href="/">
								<a>
									BRAINFREEZE
								</a>
							</Link>{" "}
							for more questions like this
						</div>
					</div>
					
					<div className={styles.info}>
						<InformationIcon />
						<div className={styles.description}>
							Wanna contact us? Visit our{" "}
							<Link href="/about">
								<a>About</a>
							</Link>{" "}
							page
						</div>
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
