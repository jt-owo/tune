import chalk from 'chalk';
import net from 'net';

const PORT = process.env.PORT || '9100';

const server = net.createServer();
server.once('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		throw new Error(chalk.whiteBright.bgRed.bold(`localhost:${PORT}" is already in use.`));
	} else {
		process.exit(0);
	}
});

server.once('listening', () => {
	server.close();
});

server.listen(PORT);
