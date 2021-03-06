import Navbar from './Components/Navbar.js';
import Container from './Components/Container.js';

import 'katex/dist/katex.min.css';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

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
