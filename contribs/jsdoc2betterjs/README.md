jsdoc2betterjs
==============

Tool which read your javascript code with jsdoc and ensure your jsdoc is respected when it is executed.

You code your javascript, you add classic jsdoc to it because you are a nice guy, now ```jsdoc2betterjs yourCode.js``` will produce a ```yourCode.better.js``` file. It will include all the checks to ensure your jsdoc is respected.

It uses [better.js](http://betterjs.org) to perform the testing during execution.

It run in browser and node.js.

To run the produces betterjs code, just include [better.js file from /build/better.js](https://github.com/jeromeetienne/better.js/blob/master/build/better.js)

## Inline Help

```bash
$ jsdoc2betterjs -h
Usage: jsdoc2betterjs [options] file.js file2.js...

Makes sure jsdoc is respected during execution.
More about better.js at http://betterjs.org

Options:
    -m  Generate source map file. file.js into file.js.map

    -w  Write generated code from file.js into file.better.js

    -s  If @return or no @param are defined in jsdoc, check it is nothing during execution

    -p  Privatize the classes

    -h  Display inline help

    -v  Display version`
```