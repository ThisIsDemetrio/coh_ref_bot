import irc, { IMessage } from 'irc';

const config: irc.IClientOpts = {
  port: 6697,
  userName: 'John_McCorthy',
  realName: 'Referee John McCorthy',
  localAddress: undefined,
  debug: true,
  showErrors: false,
  autoRejoin: false,
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

let channel = '';

const bot = new irc.Client('irc.libera.chat', 'John_McCorthy', config);

bot.addListener('end', (message) => {
  console.log('end event raised: ', message);
});

bot.addListener('close', (message: string) => {
  console.log('close event raised: ', message);
});

bot.addListener(
  'message',
  (from: string, to: string, text: string, message: IMessage) => {
    console.log({ from });
    console.log({ to });
    console.log({ text });
    console.log({ message });
  },
);

bot.addListener('registered', function (...args: string[]) {
  console.log(args);
  channel = '#John_McCorthy_Test';
  bot.join(channel);
});
