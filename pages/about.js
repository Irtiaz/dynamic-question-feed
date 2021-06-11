import React from 'react';
import Head from 'next/head';

import styles from '../styles/About.module.css';

export default class About extends React.Component {
	render() {
		return (
			<>
				<Head>
					<title>About this project</title>
				</Head>
				<div className={styles.container}>
					<div className={styles.box}>
						<b>Credits</b> <br />
						Question review and solution : Md Imtiaz Kabir <br />
						Developer : Md Irtiaz Kabir
					</div>
					<div className={styles.contact}>
						If you have any interesting question that you want to share with us or you have noticed a calculation/concept error or a bug in our site then please feel free to contact us <br /> <br /> <br />
						E-mail :
						<div className={styles.box}>
							imtiazkabir.imtiaz@gmail.com<br />
							irtiazkabir.irtiaz@gmail.com
						</div>
					</div>
					And here's{" "} 
					<a href="https://github.com/Irtiaz/dynamic-question-feed">the source code for this project</a> <br />
					You are welcome to contribute!
				</div>
			</>
		);
	}
}
