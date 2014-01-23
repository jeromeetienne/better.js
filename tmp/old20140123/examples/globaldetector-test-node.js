#!/usr/bin/env node

// get the class
var GlobalDetector	= require('../src/globaldetector.js');

// declare a global which MUST NOT be detected
global.foo	= 'bar';

// start the detector
new GlobalDetector().start();

// declare a global which MUST be detected
global.pif	= 'paf';
