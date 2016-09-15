/* eslint-disable import/no-extraneous-dependencies */
const test = require('ava').test;
const execa = require('execa');

test('main', async t =>
  t.truthy(await execa.stdout('./cli.js'), 'return request token and auth url')
);

// TODO Test all the things
