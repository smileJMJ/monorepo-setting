'use strict';

const projectB = require('..');
const assert = require('assert').strict;

assert.strictEqual(projectB(), 'Hello from projectB');
console.info('projectB tests passed');
