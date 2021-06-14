import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import mongoose from 'mongoose';
import QuestionModel from '../../models/QuestionModel.js';

import withAuth from '../Components/withAuth.js';
import Question from '../Components/Question.js';

import styles from '../../styles/Feed.module.css';

class Feed extends React.Component {

	state = {
		questionList: []
	}

	componentDidMount = () => {
		const questionList = JSON.parse(this.props.questions);

		this.setState({questionList});
	}

	
	handleEdit = (index) => {
		sessionStorage.setItem('question', JSON.stringify(this.state.questionList[index]));
		Router.push('/admin/create');
	}


	handleDelete = async (index) => {
		if (prompt('Are you absolutely sure? Type Yes if you are sure', 'Yes') !== 'Yes') return;
		console.log(this.state.questionList[index]);

		const data = {
			_id: this.state.questionList[index]._id
		};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};

		const response = await fetch('/api/delete', options);
		const json = await response.json();

		if (json.status === 'Success') {
			const newList = this.state.questionList.slice();
			newList.splice(index, 1);
			this.setState({
				questionList: newList
			});
		} 
		else {
			alert('Something went wrong!!');
		}
	}

	handleAdd = () => {
		sessionStorage.removeItem('question');
		Router.push('/admin/create');
	}

	handleLogout = () => {
		localStorage.removeItem('adminToken');
		Router.replace('/');
	}


	render() {
		
		const Questions = [];
		for (let i = 0; i < this.state.questionList.length; ++i) {
			const {_id, ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight, keywords, finalAns} = this.state.questionList[i];

			const QuestionItem = 
				<div className={styles.question_container} key={_id} >
					<div className={styles.question_wrapper}>
						<span>{i + 1}</span>
						<div className={styles.question_item}>
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
						</div>
					</div>
					<div className={styles.button_div} >
						<button className={styles.edit} onClick={() => this.handleEdit(i)}>Edit</button>
						<button className={styles.delete} onClick={() => this.handleDelete(i)}>Delete</button>
					</div>
				</div>;

			Questions.push(QuestionItem);
		}


		return (
			<>
				<Head>
					<title>Edit questions</title>
				</Head>
				<div>
					<div style={{textAlign: "right"}}>
						<button onClick={this.handleLogout} className={styles.logout_button}>Logout</button>
					</div>
					<button className={styles.add_button} onClick={this.handleAdd}>Add new question</button>
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

export default withAuth(Feed);
