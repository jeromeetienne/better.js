debugjs
=======

Library to help debug in Javascript.

It got
* type checking
* variable value bound checking
* NaN detection
* assert which actually stop excecution
* stack extraction (soon)
* Queuable getter setter.js
* easy way to wrap function


#### notes
* http://stackoverflow.com/questions/367768/how-to-detect-if-a-function-is-called-as-constructor
  * to count new instance and localize them
* https://developers.google.com/closure/compiler/docs/js-for-compiler
  * use same format
  * autogenerate function parameter check
  
#### TODO
* console.log to filter by origin
  * DONE not tested
* stacktrace.track to filter by origin and order by occurance
  * DONE to test
* fnattr to track usage