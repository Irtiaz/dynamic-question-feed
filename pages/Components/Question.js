import React from 'react';
import Image from 'next/image';
import MathJax from 'react-mathjax';

import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import GestureTapHoldIcon from 'mdi-react/GestureTapHoldIcon';

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
		showSolution: false,
		showFinalAns: false
	};


	instructionRef = React.createRef();
	finalAnsRef = React.createRef();


	handleToggle = () => {
		this.setState({
			showSolution: !this.state.showSolution
		});
	}

	toggleVisibiltyOfFinalAns = (show) => {
		this.finalAnsRef.current.style.display = show? 'block' : 'none';
		this.instructionRef.current.style.display = show? 'none' : 'block';
	}



	render() {
		const quesLines = getLines(this.props.ques);
		const ansLines = getLines(this.props.ans);
		const finalAnsLines = getLines(this.props.finalAns);

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
			const url = `http://brainfreeze.vercel.app/question/${this.props.id}`;
			CopyButton = <button onClick={() => navigator.clipboard.writeText(url)} className={styles.copy_button} >
				<FileCopyTwoToneIcon />
			</button>;
		}
	
		
		let FinalAnsDiv = null;
		let FinalAnsContainer = null;
		if (this.props.finalAns != undefined && this.props.finalAns.length > 0) {
			FinalAnsContainer = 
				<div
					onMouseDown={() => this.toggleVisibiltyOfFinalAns(true)}
					onMouseUp={() => this.toggleVisibiltyOfFinalAns(false)}
					onMouseLeave={() => this.toggleVisibiltyOfFinalAns(false)}
					onPointerDown={() => this.toggleVisibiltyOfFinalAns(true)}
					onPointerUp={() => this.toggleVisibiltyOfFinalAns(false)}
					onPointerLeave={() => this.toggleVisibiltyOfFinalAns(false)}
				>
					<div className={styles.final_ans_container}>
						<div ref={this.instructionRef}>
							<GestureTapHoldIcon /> The answer
						</div>
						<div ref={this.finalAnsRef} style={{display: "none"}}>{properties.finalAns}</div>
					</div>
				</div>;
		}
		
		


		return (
			<div className={styles.container}>
				{CopyButton}

				<MathJax.Provider>
					{properties.ques}
					{QuesImage}
					<div className="keywords_container">
						{Keywords}
					</div>
					
					<div style={{textAlign: "center"}}>
						{FinalAnsContainer}
					</div>

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
		if (line.length == 0) {
			lines.push(<br key={shortid.generate()} />);
			continue;
		}
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
