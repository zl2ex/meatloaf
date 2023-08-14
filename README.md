# meatloaf
## Moodle E-learning Assessment Text Lookup Auto Filler
A Client-side application to take the text from a learning resource and fill out questions on Moodle automatically.

### Currently supports
* ### ETCO E-learning
  Select the word in the sentence questions on
  ![](/pictures/select_the_words_in_sentence.png)  
  Meatloaf will fill these in if it finds a match in the supplied text  
  Be sure to paste the entire learning resource text using ctrl+a ctrl+c (to copy) and paste with ctrl+v


## Install with scripty on Chrome
You can add meatloaf to your browser by downloading a javascript injector extension like [scripty](https://scripty.abhisheksatre.com/#/download)

after installing scripty you can download the scripty loader for etco [here](https://scripty.abhisheksatre.com/#/share/script_1685353558613)

## Install using another javascript injector browser extension

Paste this code to load Meatloaf on your browser
```
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "https://zl2ex.github.io/meatloaf/meatloaf.js";
document.body.append(script);

```
then set the javascript injector to run when your browser is on the URL of the Moodle website eg for etco
`https://etco.elearning.org.nz/mod/quiz/attempt.php` (highlighted in following image)
you can copy this URL from your browser's search bar when you are in the assessment.

Here is the setup page of scripty, most javascript injector extensions will be similar, just copy these settings

![](/pictures/javascript_injector_settings.png)  

## Disclaimer
### This software was created as a proof of concept and i am not responsible for your use or abuse of it.  
You are free to distribute, modify or contribute to this software under the GNU General Public License.
