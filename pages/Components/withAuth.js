import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import validateToken from '../../lib/validateToken.js';

const withAuth = (WrappedComponent) => {
	return (props) => {
		const Router = useRouter();
		const [valid, setValid] = useState(false);

		useEffect(async () => {
			const token = localStorage.getItem('adminToken');
			const validated = await validateToken(token);
			if (validated) setValid(true);
			else {
				localStorage.removeItem('adminToken');
				Router.replace('/admin');
			}
		}, []);

		if (valid) {
			return <WrappedComponent {...props} />
		} else {
			return null;
		}

	}
}

export default withAuth;
