// to parse webidl in node.js

var WebIDL2	= require("webidl2")


var filename	= 'data.idl'
var idlString	= "string of WebIDL"
var idlString	= require('fs').readFileSync(filename, 'utf8')
var tree	= WebIDL2.parse(idlString)



