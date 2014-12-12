aClass1 = FunctionAttr.define(aClass1, "function aClass1")
	.typeCheck([[String],[Function]], [Number])
	.done();
aClass1.prototype.aMethod = FunctionAttr.define(aClass1.prototype.aMethod, "method aClass1.prototype.aMethod")
	.typeCheck([[String]], [Number])
	.deprecated()
	.private(aClass1)
	.done();
