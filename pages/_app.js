import Navbar from './Components/Navbar.js';
import Container from './Components/Container.js';

//import { useEffect } from 'react';
import 'katex/dist/katex.min.css';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

	//useEffect(async () => {
		//(await import('katex/dist/katex.min.css'));
		//await require('katex/dist/katex.min.css');
	//});

	return (
		<>
			<Navbar />
			<Container>
				<Component {...pageProps} />
			</Container>
		</>
	);
}

export default MyApp;
