
/**
 * super bla
 * @param  {String|Number} name the name of the personn
 * @param  {Number} age the age
 * @return {Number} the length of the name
 */
var nameLength	= Better.Class(function(name, age){
	return name.length
}, {
        arguments: [[String, Number], Number],
        return: Number
})

