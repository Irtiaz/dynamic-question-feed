import React from 'react';
import Link from 'next/link';

import styles from '../../styles/Navbar.module.css';

export default class Navbar extends React.Component {
	render() {
		return (
			<div className={styles.container_div}>
				<div className={styles.nav_container}>
					<header className={styles.header}>
						<h2>
							<Link href='/'>
								<a>BRAIN FREEZE</a>
							</Link>
						</h2>
					</header>
					<nav className={styles.nav}>
						<ul>
							<li>
								<Link href="/admin/feed">
									<a>Admin Feed</a>
								</Link>
							</li>
							<li>
								<Link href="/about">
									<a>About</a>
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		);
	}
}
