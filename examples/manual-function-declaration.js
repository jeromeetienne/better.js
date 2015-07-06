var Better	= Better	|| require('../build/better.js')

// /**
//  * dummy function
//  * 
//  * @param  {String} message - the message to display
//  */
// var foo = function foo(message){
        // console.log('bar', message)
        // return 'ddd'
// }

function foo(){
        foo.__fct = foo.__fct || Better.Function(function foo(message){
                console.log('bar', message)
                return 'ddd'
        }, {
                arguments	: [String],
                return          : Number
        })
        return foo.__fct.apply(this, arguments)
}

foo('sss')
