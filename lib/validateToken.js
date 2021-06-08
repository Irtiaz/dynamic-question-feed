export default async function validateToken(token) {
	const options = {
		method: 'POST',
		body: token
	};
	const response = await fetch('/api/admin/validate', options);
	const result = await response.text() == '1';
	return result;
}
