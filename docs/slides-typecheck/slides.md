title: Yeoman For Three.js
author:
  name: "Jerome Etienne"
  twitter: "@jerome_etienne"
  url: "http://jetienne.com"
output: index.html

--

<base target='_blank'/>
<style>pre { background: lightgrey; font-size: 100%;}</style>

### JS isn't strongly typed ?

# Think Again!

--

### What Is Weak Typing

a single variable can have multiple type

    var foo	= 'bar';
    // here foo type is a string
    foo		= 42;
    // foo type is a number now
    
    // ... All is ok no error occurs.


--

### What Is Strong Typing

a single variable can have a single type


    std::string foo	= 'bar';
    // here foo type is a string
    foo		= 42;
    // ERROR! as foo is a string


not available in js, so example in c++

--

# Which One Is Best ?

--

### Weak Typing

* more freedom for the developper
  * May be more convenient
* allow overload functions signature

--

### Strong Typing

* strong typing is easier to optimize for VM
* strong typing may lead to faster execution
* strong typing does more check 
  * so may lead to earlier bug discovery 
  
--

# Both got PRO/CON**

-- 

# How to get strong typing in javascript