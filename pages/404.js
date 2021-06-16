import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import HomeCircleIcon from 'mdi-react/HomeCircleIcon';
import InformationIcon from 'mdi-react/InformationIcon';

import styles from '../styles/Custom404.module.css';

export default class Custom404 extends React.Component {
	render() {
		return (
			<>
				<Head>
					<title>Page not found!</title>
				</Head>
				<div className={styles.page}>
					<h1>404</h1>
					<div className={styles.subheader}>
						This is not the web page you are looking for
					</div>
					<div className={styles.info_container}>
						<div className={styles.info}>
							<HomeCircleIcon />
							<div className={styles.description}>
								Having trouble finding questions? Visit{" "}
								<Link href="/">
									<a>
										BRAINFREEZE
									</a>
								</Link>
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

				</div>
			</>
		);
	}
}
