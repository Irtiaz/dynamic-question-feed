export default function parseMathText(text) {
	const linesWithTokens = [];
	const lines = text.split("\n");

	for (let line of lines) {
		if (line.length == 0) {
			linesWithTokens.push(line);
			continue;
		}
		const tokens = [];
		let buffer = "" + line[0];

		for (let i = 1; i < line.length; ++i) {
			if (line[i] == "`" || line[i] == "@") {
				if (buffer[0] == line[i]) {
					buffer += line[i];
					tokens.push(buffer);
					buffer = "";
				}
				else {
					tokens.push(buffer);
					buffer = "" + line[i];
				}
			}
			else buffer += line[i];
		}

		if (buffer.length != 0) tokens.push(buffer);

		linesWithTokens.push(tokens);
	}

	return linesWithTokens;
}
