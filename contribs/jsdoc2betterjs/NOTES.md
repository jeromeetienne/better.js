# Support funky type syntax
* from [usejsdoc @type](http://usejsdoc.org/tags-type.html)

* {MyClass[]} - array of myclass
    - better.js: MyClass
* {?number} - A number or null.
    - better.js: [Number,null]
* {!number} - a number never null
    - better.js: [Number]
* @param {number} [foo] - optional number
    - better.js: [number|undefined]


# Support better property
* this one dont work
    - hard to support
    - unclear which javascript output

```
var bli = { 
    /** @type {String} - a string */
    foo: 'bar'
};
```