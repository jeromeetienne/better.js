var originalCat	= Cat;

Cat = FunctionAttr.define(originalCat, "function Cat")
	.typeCheck([[String]], [])
	.done();

PropertyAttr.define(originalCat, "species")
	.typeCheck([String]);
