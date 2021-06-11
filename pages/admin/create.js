import React from 'react';
import Head from 'next/head';
import shortid from 'shortid';

import Question from '../Components/Question.js';
import withAuth from '../Components/withAuth.js';
import styles from '../../styles/CreateQues.module.css';

import keywords from '../../lib/keywordsList.js';

class CreateQues extends React.Component {

	state = {
		ques: "",
		quesImageBase64: "",
		quesImageWidth: 0,
		quesImageHeight: 0,
		ans: "",
		ansImageBase64: "",
		ansImageWidth: 0,
		ansImageHeight: 0,

		keywords: {}
	};

	quesAreaRef = React.createRef();
	quesImageRef = React.createRef();

	ansAreaRef = React.createRef();
	ansImageRef = React.createRef();

	_id = undefined;
	
	componentDidMount = () => {
		const stateKeywords = {};
		for (let keyword of keywords) {
			stateKeywords[keyword] = false;
		}

		const question = JSON.parse(sessionStorage.getItem('question'));
		if (question != null) {
			const {ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight} = question;
			this.quesAreaRef.current.value = ques;
			this.ansAreaRef.current.value = ans;
			
			for (let keyword in question.keywords) {
				stateKeywords[keyword] = JSON.parse(question.keywords[keyword]);
			}

			this.setState({
				ques, quesImageBase64, quesImageWidth, quesImageHeight, ans, ansImageBase64, ansImageWidth, ansImageHeight,
				keywords: stateKeywords
			});
			this._id = question._id;
		}
		else {
			this.setState({
				keywords: stateKeywords
			});
		}
	}


	handleRefresh = () => {
		const ques = this.quesAreaRef.current.value;
		const ans = this.ansAreaRef.current.value;
		this.setState({
			ques,
			ans
		});
	}

	handleChangeQues = (event) => {
		this.setState({
			ques: event.target.value,
		});
	}

	handleChangeAns = (event) => {
		this.setState({
			ans: event.target.value,
		});
	}

	encodeImageFileAsURL = (isQues) => {
		let base64, width, height;

		const element = isQues? this.quesImageRef.current : this.ansImageRef.current;

		if (element.files.length == 0) {
			if (isQues) {
				this.setState({
					quesImageBase64: "",
					quesImageWidth: 0,
					quesImageHeight: 0
				});
			}
			else {
				this.setState({
					ansImageBase64: "",
					ansImageWidth: 0,
					ansImageHeight: 0
				});
			}
			return;
		}

		const file = element.files[0];
		const reader = new FileReader();
		reader.onloadend = () => {
			//console.log('RESULT', reader.result);
			base64 = reader.result;

			const image = new Image();
			image.src = reader.result;
			image.onload = () => {
				width = image.width;
				height = image.height;

				if (isQues) {
					this.setState({
						quesImageBase64: base64,
						quesImageWidth: width,
						quesImageHeight: height
					});
				}
				else {
					this.setState({
						ansImageBase64: base64,
						ansImageWidth: width,
						ansImageHeight: height
					});
				}
			}
		}
		reader.readAsDataURL(file);
	}

	handleClearImage = (ques) => {
		if (ques) {
			this.setState({
				quesImageBase64: ""
			});
		} else {
			this.setState({
				ansImageBase64: ""
			});
		}
	}


	handleCheck = (index) => {
		const key = keywords[index];

		const copy = {};
		Object.assign(copy, this.state.keywords);

		copy[key] = !copy[key];

		this.setState({
			keywords: copy
		});
	}


	handleAdd = async (editing) => {
		const data = {
			ques: this.state.ques,
			quesImageBase64: this.state.quesImageBase64 || "",
			quesImageWidth: this.state.quesImageWidth,
			quesImageHeight: this.state.quesImageHeight,

			ans: this.state.ans,
			ansImageBase64: this.state.ansImageBase64 || "",
			ansImageWidth: this.state.ansImageWidth,
			ansImageHeight: this.state.ansImageHeight,

			keywords: this.state.keywords
		};

		if (editing) data["_id"] = this._id;

		console.log(data);

		const options = {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		};

		const url = editing? '/api/editQues' : '/api/createQues';

		const response = await fetch(url, options);
		const json = await response.json();
		console.log(json);
		const msg = !editing? "Question added successfully" : "Question edited successfully";
		if (json.status == 'Success') alert(msg);
		else alert("Something went wrong!");
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
			/>;
		}

		
		const KeywordsCheckboxes = [];
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


		const ChooseQuesImage = 
			<div>
				Select Question Image{" "} 
				<input type="file" accept="image/png, image/jpeg" onChange={() => this.encodeImageFileAsURL(true)} ref={this.quesImageRef} />
			</div>;
	
		let ClearQuesImage = null;
		if (this.state.quesImageBase64.length != 0) ClearQuesImage = 
			<button onClick={() => this.handleClearImage(true)} className={styles.clear_image}>Clear Question Image</button>;

		const ChooseAnsImage = <div>
			Select Answer Image{" "}
			<input type="file" accept="image/png, image/jpeg" onChange={() => this.encodeImageFileAsURL(false)} ref={this.ansImageRef} />
		</div>;

		let ClearAnsImage = null;
		if (this.state.ansImageBase64.length != 0) ClearAnsImage = 
			<button onClick={() => this.handleClearImage(false)} className={styles.clear_image}>Clear Answer Image</button>;

		let EditButton = null;
		if (sessionStorage.getItem('question') != null) EditButton = <button onClick={() => this.handleAdd(true)} className={styles.add_button}>Edit Existing Question</button>;


			return (
				<>
					<Head>
						<title>Create Question</title>
					</Head>
					<div className={styles.page}>

						<div className={styles.instructions}>
							Wrap tex around 2 @ signs for block level tex or <br />
							2 backticks(`) for inline tex
						</div>
						
						<div className={styles.container}>
							Enter Question Text Here
							<textarea rows="4" cols="50" className={styles.input_area} spellCheck={false} ref={this.quesAreaRef} onChange={this.handleChangeQues} placeholder="Question" />
							{ChooseQuesImage}
							{ClearQuesImage}
						</div>
						<div className={styles.container}>
							Enter Solution Text Here
							<textarea rows="4" cols="50" className={styles.input_area} spellCheck={false} ref={this.ansAreaRef} onChange={this.handleChangeAns} placeholder="Solution" />
							{ChooseAnsImage}
							{ClearAnsImage}
						</div>
						
						<div className={styles.keywords_container}>
							{KeywordsCheckboxes}
						</div>

						<button className={styles.refresh_button} onClick={this.handleRefresh}>Refresh</button>
						<button className={styles.add_button} onClick={() => this.handleAdd(false)}>Add new question</button>

						{EditButton}

						{Preview}

					</div>
				</>
			);
	}
}


export default withAuth(CreateQues);
