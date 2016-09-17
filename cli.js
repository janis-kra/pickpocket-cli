#!/usr/bin/env node
'use strict';
const Conf = require('conf');
const meow = require('meow');
const pickpocket = require('pickpocket');

const config = new Conf();
const log = (msg) => {
  process.stdout.write(`${msg}\n`);
};
const logError = (msg) => {
  process.stderr.write(`${msg}\n`);
};
const p = pickpocket({ log: log });

const cli = meow(`
	Usage:
		get an authorization url:
	  	$ pickpocket
		after allowing the application, run:
	  	$ pickpocket --request-token <token>
		then, you can run pickpocket to archive your obsolete articles:
			$ pickpocket --archive --age-months 12 --favorites false
	Example
	  $ pickpocket
    '1234abcd'
	  'https://getpocket.com/auth/authorize?request_token=1234abcd&redirect_uri=http://janis-kra.github.io/Pickpocket'
		$ pickpocket --request-token 1234abcd
		pickpocket successfully authorized, your access token is 1909-1337
		$ pickpocket --access-token 1909-1337 --archive --age-months 12 --favorites true
		archiving...
		'http://reactjsnewsletter.com/issues/43?sid=LOq6uHC#start'
		'https://medium.com/javascript-scene/10-tips-for-better-redux-architecture-69250425af44#.rj0eef733'
		finished
`);

const flags = cli.flags;

if (flags.length > 0) {
  if ((flags.archive && !flags.accessToken) || (flags.archive && flags.requestToken)) {
    logError('cannot archive when no accessToken is set');
    process.exit(1);
  }
  if (flags.requestToken) {
    p.obtainAccessToken({ requestToken: flags.requestToken }).then(
      t => log(`pickpocket successfully authorized, your access token is ${t}`)
    );
  }
  if (flags.accessToken) {
    p.setAccessToken(flags.accessToken);
    config.set('accessToken', flags.accessToken);
  }
  if (flags.archive) {
    if (!p.isAuthorized()) {
      p.setAccessToken(config.get('accessToken'));
    }
    p.archiveOverdueArticles({
      favorites: (flags.favorites === 'true') || false,
      maxMonths: Number(flags.ageMonths || 0)
    });
  }
} else {
  p.authorize().then(a => {
    log(`'${a.token}'`);
    config.set('requestToken', a.token);
    log(`'${a.authorizationUrl}'`);
    config.set('authorizationUrl', a.authorizationUrl);
  });
}
