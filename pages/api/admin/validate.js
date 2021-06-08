export default function handler(req, res) {
	if (req.body === process.env.TOKEN) res.send(1);
	else res.send(0);
}
