export default function handler(req, res) {
	if (req.body.password === process.env.LOGIN_PASSWORD) res.send(process.env.TOKEN);
	else res.send(undefined);
}
