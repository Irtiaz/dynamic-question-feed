import '../styles/globals.css'

import Container from './Components/Container.js';

function MyApp({ Component, pageProps }) {
	return (
		<Container>
			<Component {...pageProps} />
		</Container>
	);
}

export default MyApp
