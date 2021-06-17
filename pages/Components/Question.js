import React from 'react';
import Image from 'next/image';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import ReloadIcon from 'mdi-react/ReloadIcon';

import shortid from 'shortid';

import styles from '../../styles/Question.module.css';

export default class Question extends React.Component {

	/*
	 * Rules
	 * backticks (`E = mc^2`) mean inlines
	 * @ signs (@E = mc^2@) mean block level elements
	 * anything else = normal text
	 * */


	state = {
		showSolution: false
	};

	instructionRef = React.createRef();
	finalAnsRef = React.createRef();
	toggleButtonRef = React.createRef();
	copyFeedbackRef = React.createRef();


	handleToggle = () => {
		const loadingText = "Loading ...";

		if (this.toggleButtonRef.current.textContent === loadingText) return;

		this.toggleButtonRef.current.textContent = loadingText;
		this.setState({
			showSolution: !this.state.showSolution
		});
	}


	handleFinalAnsToggle = (show) => {
		this.instructionRef.current.style.display = show? "none" : "block";
		this.finalAnsRef.current.style.display = show? "block" : "none";
	}


	handleCopy = () => {
		const url = `http://brainfreeze.vercel.app/question/${this.props.id}`;
		navigator.clipboard.writeText(url);
		const className = styles.fade_in_and_out;
		this.copyFeedbackRef.current.classList.add(className);
		setTimeout(() => {
			this.copyFeedbackRef.current.classList.remove(className);
		}, 1900);
	}



	render() {
		const quesLines = <ReactMarkdown
			remarkPlugins={[remarkMath]}
			rehypePlugins={[rehypeKatex, rehypeRaw]}
			children={this.props.ques}
		/>;
		const ansLines = <ReactMarkdown
			remarkPlugins={[remarkMath]}
			rehypePlugins={[rehypeKatex, rehypeRaw]}
			children={this.props.ans}
		/>;
		const finalAnsLines = <ReactMarkdown
			remarkPlugins={[remarkMath]}
			rehypePlugins={[rehypeKatex, rehypeRaw]}
			children={this.props.finalAns}
		/>;

		const properties = {
			ques: quesLines,
			quesImageBase64: this.props.quesImageBase64 || "",
			quesImageWidth: this.props.quesImageWidth,
			quesImageHeight: this.props.quesImageHeight,
			ans: ansLines,
			ansImageBase64: this.props.ansImageBase64 || "",
			ansImageWidth: this.props.ansImageWidth,
			ansImageHeight: this.props.ansImageHeight,
			finalAns: finalAnsLines
		};

		const QuesImage = getImage(properties.quesImageBase64, properties.quesImageWidth, properties.quesImageHeight);
		let AnsImage = getImage(properties.ansImageBase64, properties.ansImageWidth, properties.ansImageHeight);


		let Solution = null;
		if (this.state.showSolution) {
			Solution = <div className={styles.solution_container}>
				{properties.ans}
				{AnsImage}
			</div>;
		}

		const Keywords = [];
		if (this.props.keywords) {
			for (let keyword in this.props.keywords) {
				if (JSON.parse(this.props.keywords[keyword])) {
					Keywords.push(
						<span key={shortid.generate()} className="keyword not_hoverable_keyword">{keyword}</span>
					);
				}
			}
		}

		const toggleButtonText = this.state.showSolution? "Hide Solution" : "Show Solution";

		let CopyButton = null;
		if (this.props.id) {
			CopyButton = <button onClick={this.handleCopy} className={styles.copy_button} >
				<ContentCopyIcon />
			</button>;
		}


		let FinalAnsContainer = null;
		if (this.props.finalAns != undefined && this.props.finalAns.length > 0) {
			FinalAnsContainer = <div className={styles.final_ans_container}>
				<div>
					<span ref={this.instructionRef}>The answer</span>
					<span ref={this.finalAnsRef} style={{display: "none"}}>{properties.finalAns}</span>
				</div>
				<input type="checkbox" className={styles.slider} onChange={(event) => this.handleFinalAnsToggle(event.target.checked)} />
			</div>
		}




		return (
			<div className={styles.container}>

				<div className={styles.copy_feedback} ref={this.copyFeedbackRef}>
					Link Copied!
				</div>

				<div className={styles.icon_buttons}>
					{CopyButton}
				</div>

				<br />

				{properties.ques}
				{QuesImage}
				<div className="keywords_container">
					{Keywords}
				</div>

				<div className={styles.solution_control_div}>
					<div>
						{FinalAnsContainer}
					</div>

					<div style={{textAlign: "center"}}>
						<button onClick={this.handleToggle} className={styles.toggle_button} ref={this.toggleButtonRef}>{toggleButtonText}</button>
					</div>
				</div>
				{Solution}

			</div>
		);
	}
}


function getImage(base64, width, height) {
	if (base64 == null || base64.length == 0) return null;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				margin: "3em 0"
			}}
		>
			<Image 
				src={base64} 
				alt="Image"
				width={width} 
				height={height}
			/>
		</div>
	);
}
