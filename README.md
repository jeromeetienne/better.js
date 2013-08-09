debugjs
=======

Hardening Your Javascript Code in Javascript.

TODO
====
* rename to hardening.js ?
  * safer.js
* put jsdoc2debug.js in npm 
* put debug.js in bower
* how to easily include it in node.js ? 
  * single require ?



===========================

#### debug.js: javascript made easy to debug
Javascript was slow and hard to debug for a long time.
Now it is no more slow.
But it is still hard to debug. 
debug.js proposes to fill this gap
and provides a bunch of practical tools 
which makes your javascript code much easier to debug.

* With debug.js, your classes can declare functions and property as private/public.
Thus if a private function is called from an unauthorised location, you will 
be immediatly warned. 
* With debug.js, you can declare attributes to functions e.g.
you can mark it as deprecated, and 
be notified when it is used.
You can trigger performance profiling on this function and see if it needs optimisation.
You can track who is using it.
You can put conditional breakpoint.
* With debug.js, you can have strong type checking. 
It will check the parameters type and numbers of a function when it is called.
If you expect to get a Number and a String, debug.js will check and notifies
you when it happens to be wrong. 
It is even possible to do that on any object property.
* With debug.js, it is possible to automatically detect your global variable, then 
to automatically local is using them, thus you can remove them easily.
  
#### TODO
* fnattr to track usage
* console.log to filter by origin
  * DONE not tested
* stacktrace.track to filter by origin and order by occurance
  * DONE to test
