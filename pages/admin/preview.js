import React from 'react';
import Head from 'next/head';

import withAuth from '../Components/withAuth.js';
import Question from '../Components/Question.js';

import keywords from '../../lib/keywordsList.js';

class Preview extends React.Component {
	state = {
		ques: "",
		quesImageBase64: "",
		quesImageWidth: 0,
		quesImageHeight: 0,
		ans: "",
		ansImageBase64: "",
		ansImageWidth: 0,
		ansImageHeight: 0,

		keywords: {},

		finalAns: "",
		visible: true
	};


	componentDidMount = () => {
		const stateKeywords = {};
		for (let keyword of keywords) {
			stateKeywords[keyword] = false;
		}

		const question = JSON.parse(localStorage.getItem('preview'));
		if (question != null) {
			const {ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight, finalAns, visible} = question;

			for (let keyword in question.keywords) {
				stateKeywords[keyword] = JSON.parse(question.keywords[keyword]);
			}

			this.setState({
				ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight, visible,
				keywords: stateKeywords
			});
			this._id = question._id;
		}
		else {
			this.setState({
				keywords: stateKeywords
			});
		}

		setInterval(() => {
			const previewStr = localStorage.getItem('preview');
			const question = JSON.parse(localStorage.getItem('preview'));
			this.setState(question);
		}, 1000);
	}


	render() {
		let Preview = null;

		if (this.state.ques.length > 0) {
			Preview = <Question 
				ques={this.state.ques} 
				quesImageBase64={this.state.quesImageBase64}
				quesImageWidth={this.state.quesImageWidth}
				quesImageHeight={this.state.quesImageHeight}
				ans={this.state.ans}
				ansImageBase64={this.state.ansImageBase64}
				ansImageWidth={this.state.ansImageWidth}
				ansImageHeight={this.state.ansImageHeight}
				keywords={this.state.keywords}
				finalAns={this.state.finalAns}
			/>;
		}


		return(
			<>
				<Head>
					<title>Preview</title>
				</Head>
				<div>
					{Preview}
				</div>
			</>
		);
	}
}

export default withAuth(Preview);
