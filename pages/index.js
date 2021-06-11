import React from 'react';
import mongoose from 'mongoose';
import Head from 'next/head';
import Link from 'next/link';
import shortid from 'shortid';

import QuestionModel from '../models/QuestionModel.js';
import keywords from '../lib/keywordsList.js';

import Question from './Components/Question.js';
import styles from '../styles/Home.module.css';

export default class Home extends React.Component {

	state = {
		keywords: {},
		showFilters: false
	};

	handleCheck = (index) => {
		const key = keywords[index];

		const copy = {};
		Object.assign(copy, this.state.keywords);

		copy[key] = !copy[key];

		this.setState({
			keywords: copy
		});
	}

	handleFilterToggle = () => {
		this.setState({
			showFilters: !this.state.showFilters
		});
	}

	clearFilters = () => {
		const keywordsCopy = {};
		Object.assign(keywordsCopy, this.state.keywords);
		for (let keyword in keywordsCopy) {
			keywordsCopy[keyword] = false;
		}
		this.setState({
			showFilters: false,
			keywords: keywordsCopy
		});
	}


	render() {

		const KeywordsCheckboxes = [];
		let filterButtonText = "Show filters";
		if (this.state.showFilters) {
			for (let i = 0; i < keywords.length; ++i) {
				const keyword = keywords[i];

				KeywordsCheckboxes.push(
					<React.Fragment key={shortid.generate()}>
						<label>
							{keyword}
							<input type="checkbox" checked={this.state.keywords[keyword]} onChange={() => this.handleCheck(i)} />
						</label>
					</React.Fragment>
				);
			}
			filterButtonText = "Hide filters";
		}

		let ClearFilterButton = null;	

		const currentFilters = [];
		for (let keyword in this.state.keywords) {
			if (this.state.keywords[keyword]) currentFilters.push(keyword);
		}

		const questionList = JSON.parse(this.props.questions);

		if (currentFilters.length > 0) {
			for (let i = questionList.length - 1; i >= 0; --i) {
				const questionKeywords = questionList[i].keywords;
				let spliceIt = true;
				for (let filter of currentFilters) {
					if (JSON.parse(questionKeywords[filter])) {
						spliceIt = false;
						break;
					}
				}
				if (spliceIt) questionList.splice(i, 1);
			}

			ClearFilterButton = <button className={styles.filter_button} onClick={this.clearFilters}>Clear Filters</button>

		}

		const Questions = [];
		for (let i = 0; i < questionList.length; ++i) {
			const {_id, ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight, keywords} = questionList[i];
			const QuestionItem = 
				<div key={_id} className={styles.question_wrapper}>
					<span>{i + 1}</span>
					<div className={styles.question_item}>
						<Question 
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
					</div>
				</div>;
			Questions.push(QuestionItem);
		}

		return (
			<>
				<Head>
					<title>Brain Freeze</title>
				</Head>
				<div>
					<div>
						<button onClick={this.handleFilterToggle} className={styles.filter_button}>{filterButtonText}</button>
						{ClearFilterButton}
						<div className={styles.keywords_container}>
							{KeywordsCheckboxes}
						</div>
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

	const questions = await QuestionModel.find({}).sort({_id: -1});

	return {
		props: {
			questions: JSON.stringify(questions),
		},
		revalidate: 10
	};
}
