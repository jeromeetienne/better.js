/**
 * @namespace logger compatible with console.* calls
 */
var ctor	= function(klass, params){
	var builder	= FunctionAttr.define(klass)

	if( params.accept ){
		builder.typeCheck(params.accept, [undefined])	
	}
	
	if( params.properties ){
		Object.keys(params.properties).forEach(function(property){
			PropertyAttr
				.define(baseObject, property)
				.typeCheck(properties[property])
		})
	}
	
	return builder.done()
}