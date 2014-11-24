# jsdoced.js

jsdoced.js use jsdoc comment and check it is respected during execution.

Thus you document you javascript with jsdoc, and jsdoced.js automatically check your code is executed as you intended.

jsdoced.js depends on (better.js)[http://betterjs.org] 

## How to use it

you use it like this (more about (jsdoc)[http://usejsdoc.com])

```
/**
 * add two values
 * 
 * @param {Number} value1 value one
 * @param {Number} value2 value two
 * @return {Number} the result
 */
var add = JSDOCED.Function(function(value1, value2){
    return value1 + value2
})
```

```JSDOCED.Function``` extracts the jsdoc comment above the function.
It parses it, create ```Better.Function``` according to type information 
you gave in the jsdoc.
then it return it.

Thus everytime you execute your function, better.js will test if your jsdoc is 
respected. And you will be notified immediatly.




