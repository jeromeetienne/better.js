title: jsDoced Javascript
output: index.html
--

# jsDoced Javascript
## or
## Test if your javascript run accoding to your jsdoc

--

### Say you got this function

```
/**
 * double a number and double it
 * 
 * @param {Number} myNumber the number to double
 * @return {Number} the result of the operation
 */
var add = function(value1, value2){
  return value1 + value2
}
```

--

### All seems ok...

```
add(1, 3) // 4 
```

```
add(4, 5) // 9 
```

```
add(1, -2) // -1 
```

--

### hmm maybe not

```
add(1,'two')  // '1two'
```

**The type error isn't detected**

We should test this case...

--

### Now we add jsdoced javascript

```
/**
 * double a number and double it
 * 
 * @param {Number} myNumber the number to double
 * @return {Number} the result of the operation
 */
var add = jsDoced(function(value1, value2){
  return value1 + value2
})
```

--

## Let's try again this error case

```
add(1,'two')
// Throw exception 'First argument type is invalid'
```

* the error is immediatly detected

--

#### With jsdoced javascript

#### Your code is tested according to your jsdoc

See [jsDoced.js](https://github.com/jeromeetienne/jsdoced.js/) for more informations


