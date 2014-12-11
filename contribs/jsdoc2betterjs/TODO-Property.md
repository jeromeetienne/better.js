# support for property
* to support property would be great

* how to detect this pattern in recast
* how to create the new code in recast

* check it actually work
        - DONE produce examples for Better.Property
        - it does work


## syntax

```
/**
 * a great property
 * @type {String|null}
 */
this.foo     = 'bar'
```


```
/**
 * a great property
 * @type {String|null}
 */
cat.foo     = 'bar'
Better.Property(cat, 'foo', {
	type	: [String, null],
})
```
