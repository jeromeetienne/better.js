title: Better.js From 10000 miles
author:
  name: "Jerome Etienne"
  twitter: "@jerome_etienne"
  url: "http://jetienne.com"
output: index.html
--

<base target='_blank'/>
<style>pre { background: lightgrey; font-size: 100%;}</style>

# Better.js From 10000 miles

## [Jerome Etienne](http://twitter.com/jerome_etienne)

--

### What Is Better.js

* unintrusive javascript library
* focused on helping writing better javascript

--

### What Better.js is Doing

#### Current Features

* Strong Typing
* Private Visibility

--

### What Better.js will be Doing

#### Not yet exposed features

* object allocation tracking
* garbage collector monitoring
* function caller tracking
* global variable detector

--

### Where it is going ?

* earlier bug detections
* monitor excutions
* 100% plain javascript

--

### Where to get Better.js

* Homepage - [http://betterjs.org](http://betterjs.org)
* Repo - [github](https://github.com/jeromeetienne/better.js/) 
* License - [MIT](http://jetienne.mit-license.org/)

--

# Braging Time

## Better.js Provides Features Unseen to Javascript

--

## Javascript got no **Private**!

# Thinks Again!

## with Better.js it does!


--

## Javascript got no **Strong Typing**!

# Thinks Again!

## with Better.js it does!

--

### Better.js is funky!

It is "Not your mother Javascript!"

* Provides Strong Typeing to Javascript
* Provides Private Visibility to Javascript

**Features unseen in Javascript World!**

--

### 100% Plain Old Javascript

* No compilation Step
* No New Language to Learn


Better.js is 100% in Plain Old Javascript

--

## What ?? How?

# Demo Time

--

## First...

# Strong Typing in Javascript

## An example

--

### Play with Strong Typing In JS

* Define a function class
* Make a Better.js declaration for its arguments
  * works for function return types too
  * works for object property too
* See what happen

--

### Sample Function

```javascript
var cat = function(name, age){
  console.log('my name is', name, 'and im', age)
}
```

* Simple function to display a message
* receive a String ```name```
* receive a Number ```age```

--

### Make a Better.js for it

```javascript
cat = BetterJS.Function(cat, {
    arguments : [String, Number],
})
```

* You overload ```Cat``` function
* Define the types for each arguments
* Better.js makes sure it is respected!

--

### Let's See What happen

Calling the function with **valid types** - OK

```
cat('kitty', 5)
// display 'My name is kitty and im 5.'
```

--

### Let's See What happen

Calling the function with **invalid types** - BAD

```
cat('kitty', 'ten')
// Exception thrown
// "Invalid arguments 1 - Should be Number"
```

Error Immediatly detected and execution stopped


--

### Strong Typing in Better.js

* Better.js provides strong typing to JS! **COOL!**
* Unauthorized access are immediatly detected


**Earlier bug detection, so helps you write better js**

--

## Second ...

# Private in Javascript

## An example


--

### Play with Private In Better.js

* Define a sample class
* Make a Better.js declaration for it
* See what happen

--

### Sample Class

```javascript
var Cat = function(name){
  this._name = name
  this.age   = 7
}
Cat.prototype.getName = function(){
  return this._name
}
```

* Let's define a nice kitty class.
* ```._name``` is a private property 
* ```.getName()``` is its getter

--

### Make a Better.js for it

```javascript
Cat = BetterJS.Class(Cat, {
  privatize : true
})
```

* You overload ```Cat``` constructor
* Now ```._name``` is private
* After that, you can access it only if you are the class

--

### Let's See What happen

Create an instance for your class

```javascript
var cat = new Cat('kitty')
```

--

### Let's See What happen (bis)

Accessing public property ```.age``` - OK

```
console.log('cat age is ', cat.age)
// Display "cat age is 7"
```

--

### Let's See What happen (bis)

Now calling the getter ```.getName()``` - OK

```javascript
console.log('cat name is ', cat.getName())
// Display "cat kitty is kitty" - OK
```
--

### Let's See What happen (bis)

Now accessing the private property ```._name``` - BAD

```javascript
console.log('cat name is ', cat._name)
// Exception thrown 
// "Denied access to private property _name"
```

Error Immediatly detected and execution stopped

--

### Private in Better.js

* Better.js provides private visibility to JS! **COOL!*
* Unauthorized access are immediatly detected


**Earlier bug detection, so helps you write better js**

--

## What now ?

# Packing it UP

--

### What better.js brings to the table ?

* better.js brings private visibility to JS
* better.js brings strong typing to JS

**Not Bad!**

--

### What better.js changes ?

* 2 Major features
* Both unseen in JS
* Both helping you finding bugs earlier


--

### Future ?

* Make writting JS easier and easier
* Expose more features for better.js

### Examples
* object allocation tracking
* garbage collector monitoring
* function caller tracking
* global variable detector

--

### Where to get Better.js

* Homepage - [http://betterjs.org](http://betterjs.org)
* Repo - [github](https://github.com/jeromeetienne/better.js/) 
* License - [MIT](http://jetienne.mit-license.org/)

--

# Questions ?
## [Jerome Etienne](http://twitter.com/jerome_etienne)



