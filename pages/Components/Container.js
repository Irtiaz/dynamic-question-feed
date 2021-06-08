import React from 'react';

import styles from '../../styles/Container.module.css';

export default class Container extends React.Component {
	render() {
		return <div className={styles.container}>{this.props.children}</div>
	}
}
