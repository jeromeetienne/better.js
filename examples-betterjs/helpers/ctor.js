/**
 * @namespace logger compatible with console.* calls
 */
var ctor	= function(klass, params){
	var builder	= FunctionAttr.define(klass)

	if( params.accept ){
		builder.typeCheck(params.accept, [undefined])	
	}
	
	if( params.properties ){
BetterJS.propertiesType	= function(baseObject, properties){
	Object.keys(properties).forEach(function(property){
		var allowedType	= properties[property]
		PropertyAttr
			.define(baseObject, property)
			.typeCheck(allowedType)
	})
	return BetterJS
}
	}
	

}