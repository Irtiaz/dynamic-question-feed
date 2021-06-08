import React from 'react';
import Image from 'next/image';
import MathJax from 'react-mathjax';

import parseMathText from '../../lib/parseMathText.js';
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
		ques: [],
		quesImageBase64: "",
		quesImageWidth: 0,
		quesImageHeight: 0,
		ans: [],
		ansImageBase64: "",
		ansImageWidth: 0,
		ansImageHeight: 0
	};

	


	static getDerivedStateFromProps(props, state) {
		const quesLines = getLines(props.ques);
		const ansLines = getLines(props.ans);

		return {
			ques: quesLines,
			quesImageBase64: props.quesImageBase64 || "",
			quesImageWidth: props.quesImageWidth,
			quesImageHeight: props.quesImageHeight,
			ans: ansLines,
			ansImageBase64: props.ansImageBase64 || "",
			ansImageWidth: props.ansImageWidth,
			ansImageHeight: props.ansImageHeight,
			showSoution: false
		};
	}


	handleToggle = () => {
		this.setState({
			showSolution: !this.state.showSolution
		});
	}


	render() {
		const QuesImage = getImage(this.state.quesImageBase64, this.state.quesImageWidth, this.state.quesImageHeight);
		let AnsImage = getImage(this.state.ansImageBase64, this.state.ansImageWidth, this.state.ansImageHeight);

		
		let Solution = null;
		if (this.state.showSolution) {
			Solution = <div className={styles.solution_container}>
				{this.state.ans}
				{AnsImage}
			</div>;
		}

		const toggleButtonText = this.state.showSolution? "Hide Solution" : "Show Solution";

		return (
			<div className={styles.container}>
				<MathJax.Provider>
					{this.state.ques}
					{QuesImage}
					<div style={{textAlign: "center"}}>
						<button onClick={this.handleToggle} className={styles.toggle_button}>{toggleButtonText}</button>
					</div>
					{Solution}
				</MathJax.Provider>
			</div>
		);
	}
}



function getLines(text){
	if (text === undefined) return;
	const rawLines = parseMathText(text);
	const lines = [];
	for (let line of rawLines) {
		const ln = [];
		for (let token of line)	{
			if (token[0] === "`") ln.push(<MathJax.Node key={shortid.generate()} inline formula={token.substr(1, token.length - 2)}/>);
			else if (token[0] === "@") ln.push(<MathJax.Node key={shortid.generate()} formula={token.substr(1, token.length - 2)} />);
			else ln.push(<span key={shortid.generate()}>{token}</span>);
		}
		lines.push(<div key={shortid.generate()}>{ln}</div>);
	}
	return lines;
}


function getImage(base64, width, height) {
	if (base64 == null || base64.length == 0) return null;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center"
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
