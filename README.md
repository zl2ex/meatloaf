# meatloaf
## Moodle E-learing Assessment Text Lookup Auto Filler
You can add meatloaf to your browser by downloading a javascript injector extention like scripty  
the following code inserts a script tag to the bottom of the webpage

```
var script = document.createElement('script');
script.type = 'text/javascript';

script.src = "https://zl2ex.github.io/meatloaf/meatloaf.js";
script.onreadystatechange = callback;
script.onload = console.log("meatloaf");
document.body.appendChild(script);

```
