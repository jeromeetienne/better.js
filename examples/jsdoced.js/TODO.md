# TODO

* implement JSDOCED.Class
* implement JSDOCED.Property
* Clean up code
    - find better naming for function
* you implemented JSDOCED.Function

## jsdoced() 
* maybe to make a super generic function which route on the rest
    - jsdoced(function(){})
        + it use the jsdoc to know if it is a class or a function
        + it use JSDOCED.Class or JSDOCED.Function
    - jsdoced(object, 'property')
        + it use JSDOCED.Property
* ultra simple API
* provide a 'nojsdoced.js'
    - which provide identify function for jsdoced.js functions