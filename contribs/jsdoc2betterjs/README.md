jsdoc2betterjs
==============

Tool which read your javascript code with jsdoc and ensure your jsdoc is respected when it is executed.

You code your javascript, you add classic jsdoc to it because you are a nice guy, now ```jsdoc2betterjs yourCode.js``` will produce a ```yourCode.better.js``` file. It will include all the checks to ensure your jsdoc is respected.

It uses [better.js](http://betterjs.org) to perform the testing during execution.

It run in browser and node.js.

To run the produces betterjs code, just include [better.js file from /build/better.js](https://github.com/jeromeetienne/better.js/blob/master/build/better.js)