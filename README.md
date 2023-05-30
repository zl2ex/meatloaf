# meatloaf
## Moodle E-learing Assessment Text Lookup Auto Filler
You can add meatloaf to your browser by downloading a javascript injector extention like scripty  
the following code inserts a script tag to the bottom of the webpage

```
document.getElementById("body").insertAdjacentHTML("afterend", '<script src="zl2ex.github.io/meatloaf/meatloaf.js"></script>');

function loadScript(url, callback)
{
    var body = document.body;
    var script = document.createElement('script');
    script.type = 'text/javascript';

    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    body.appendChild(script);
}

loadScript("zl2ex.github.io/meatloaf/meatloaf.js", console.log("meatloaf"));

```
