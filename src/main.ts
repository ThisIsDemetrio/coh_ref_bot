import irc, { IMessage } from 'irc';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const { DEBUG, NAME: userName, SERVER: server, PORT } = process.env;

const debug = !!DEBUG;
const port = parseInt(PORT) || 6697;

const config: irc.IClientOpts = {
	port,
	userName,
	localAddress: undefined,
	debug,
	showErrors: false,
	autoRejoin: true,
	autoConnect: true,
	channels: [],
	secure: true,
	selfSigned: true,
	certExpired: false,
	floodProtection: true,
	floodProtectionDelay: 500,
	sasl: false,
	retryCount: 0,
	retryDelay: 10000,
	stripColors: false,
	channelPrefixes: '#',
	messageSplit: 512,
	encoding: '',
};

const channel = `#${process.env.CHANNEL}`;

// TODO: Transform into a class to be activated only if required
// 		 (we might want to use simple console.log for simplify the integration test)
const bot = new irc.Client(server, userName, config);

bot.addListener('end', (message) => {
	console.log('end event raised: ', message);
});

bot.addListener('close', (message: string) => {
	console.log('close event raised: ', message);
});

bot.addListener('message', (from: string, to: string, text: string, message: IMessage) => {
	console.log({ from });
	console.log({ to });
	console.log({ text });
	console.log({ message });
});

bot.addListener('registered', function (...args: string[]) {
	console.log(args);
	console.log(`Logging to ${channel}. Please wait...`);
	bot.join(channel);
});
