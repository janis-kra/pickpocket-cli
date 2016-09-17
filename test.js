/* eslint-disable import/no-extraneous-dependencies */
const test = require('ava').test;
const execa = require('execa');

const requestTokenRegexp = /^'(\w+-){4}\w+'$/; // 'ced23d1d-12e5-7d12-ba9c-d1d6ea'
const urlRegexp = /^'https:\/\/getpocket.com\/auth\/authorize/;

test('calling the cli without any parameters', async t => {
  const output = await execa.stdout('./cli.js');
  const outputs = output.split('\n').map(o => o.trim());
  t.true(requestTokenRegexp.test(outputs[0]), 'returns a request token');
  t.true(urlRegexp.test(outputs[1]), 'returns a url for authorization');
});

test('calling the cli with --request-token parameter', async t =>
  t.truthy(await execa.stdout('./cli.js', ['--request-token foo']),
    'causes no error')
);

test('calling the cli with --access-token parameter', async t =>
  t.truthy(await execa.stdout('./cli.js', ['--access-token foo']),
    'causes no error')
);

test('calling the cli with --archive parameter only', async t =>
  t.truthy(await execa.stderr('./cli.js', ['--archive']),
    'causes an error')
);

test('calling the cli with --archive and --request-token parameter', async t =>
  t.truthy(await execa.stderr('./cli.js', ['--archive', '--request-token foo']),
    'causes an error')
);

test('calling the cli with --archive and --access-token parameter', async t =>
  t.truthy(await execa.stdout('./cli.js', ['--archive', '--access-token foo']),
    'causes no error')
);
