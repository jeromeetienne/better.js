var multiLineString = (function (){/*
	this is a 
	multi line
	string
*/}).toString().split('\n').slice(1).slice(0, -1).join('\n')
console.log(multiLineString);