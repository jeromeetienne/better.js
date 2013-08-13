

/*
 * if you got something like that in node.js, how to get the Client constructor to check the type ?
 * - the file containing it is unknown
 * - how it import it is unknown
 * - possible solution: to ask the dev to export it for us
 *   - burden for the dev... if could be avoided, it is better
 *
 * @param  {Client} client            send client who try to connect
 */


## Cant Parse the following

```
    /**
     * the name of the cat
     * @type {String}
     */
    this.name   = name
```


* can i do something with @constructor

   
* DONE find a way to auto include the .debug.js if it exists
  * if( fileexist('avatar.debug.js') ) include('avatar.debug.js')
  
* DONE how to import all debug.js 
  - globals.FunctionAttr = FunctionAttr
  
```javascript
// snippet to include debug.js if it exists
;(function(){
  var filename  = require('path').basename(__filename, '.js')+'.debug.js'
  if( require('fs').existsSync(filename) === true ){
    var content = require('fs').readFileSync(filename, 'utf8')
    eval(content);
  }
})();
```
