var version = "0.0.1";
var pdfText = "";

function debug(str)
{
    //console.log(str); // uncomment to enable debug
}

class Question 
{
    constructor(element)
    {
        this.element = element;
        this.tagName = this.element.tagName;
        this.beforeSentence = "";
        this.afterSentence = "";
        this.possibleAnswers = [];
    }

    getSearchSentences()
    {
        var text = [];
        var parent = this.element.parentElement.parentElement;
        var child = parent.firstChild;
        var i = -1;
        var qIdx = 0; //question index order in parent paragraph 
        while (child) 
        {
            i++;
            if (child.nodeType == 3)
            {
                text.push(child.data);
            }
            else
            {
                text.push(""); // push empty to keep array itterations in line with the parent items
            }

            if(child.nodeType == 1)
            {
                if(child.tagName == "SPAN")
                {
                    if(child.firstChild.tagName == this.tagName) // is a question of the type we are looking for 
                    {
                        if(child.firstChild.id == this.element.id) // is the correct question 
                        {
                            qIdx = i;
                        }
                    }
                }
            }
            child = child.nextSibling;
        }
        if(qIdx > 0) this.beforeSentence = text[qIdx - 1];
        else
        {
            debug("cant find sentence before question");
            debug(this.element);
        }
        if(qIdx < i) this.afterSentence = text[qIdx + 1];
        else 
        {
            debug("cant find sentence after question");
            debug(this.element);
        }
    }

    getPossibleAnswers()
    {
        var i = 0;
        var el = this.element[i];
        while(el)
        {
            this.possibleAnswers.push(el.innerText);
            i++;
            el = this.element[i];
        }
        if(!this.possibleAnswers) throw new Error("No possibe answers in select statement ");
    }

    findAnswerFromSentences()
    {

        var beforeWords = this.beforeSentence.split(" ");
        var afterWords = this.afterSentence.split(" ");

        var before = "";
        var after = "";

        var answers = this.possibleAnswers;
        var phrase = "";

        while(beforeWords.length > 1) // search full sentence and if not found take a word away from the start of the before sentence
        {
            phrase = beforeWords.join(" ");
            
            var regex = new RegExp(phrase, "i");
            var search = pdfText.match(phrase);
            if(search) // found something
            {
                //debug(phrase);
                before = phrase;
                break;
            }
            beforeWords.shift();
        }

        while(afterWords.length > 1) // and the same for the end of the After Sentence
        {
            phrase = afterWords.join(" ");
            
            var regex = new RegExp(phrase, "i");
            var search = pdfText.match(phrase);
            if(search) // found something
            {
                //debug(phrase);
                after = phrase;
                break;
            }
            afterWords.pop();
        }

        if(before == "" && after == "") 
        {
            throw new Error("No before or after sentences found in text");
        }

        while(answers.length > 0) // use both matched sentences and put possible answers in to find a match
        {
            var possibleAnswer = answers.pop();

            phrase = before + "\\s*(" + possibleAnswer + ")\\s*" + after; // yuck 
            
            var regex = new RegExp(phrase, "gi");
            var search = regex.exec(pdfText);
            if(search) // found something
            {
                if(search[1] == possibleAnswer)
                {
                    //debug(search);
                    this.ans = answers.length; // send the position of the correct <option> in the <select> tag
                    break;
                }
                else // if it doesnt match see if there are any other matches in pdfText
                {
                    search = regex.exec(pdfText);
                }
            }
        }

        if(this.ans == undefined) throw new Error("Cant Find the Answer to the question in learning resource");
    }

    showError(e)
    {
        console.error(e, e.stack);
        this.element.parentElement.classList.add("meatloafToolTip");
        this.element.classList.add("meatloafQuestionError");
        this.element.parentElement.setAttribute("data-text", e);
    }

    removeError()
    {
        this.element.parentElement.classList.remove("meatloafToolTip");
        this.element.classList.remove("meatloafQuestionError");
        //this.element.parentElement.setAttribute("data-text", e); // wip remove text 
    }

    answer()
    {
        if(this.tagName == "SELECT")
        {
            try
            {
                this.getSearchSentences();
                this.getPossibleAnswers();
                this.findAnswerFromSentences();
                this.element.value = this.ans;
                this.removeError();
            }
            catch(e)
            {
                this.showError(e);
            }
        }
        else if(this.tagName == "INPUT")
        {

        }
    }
}

class Meatloaf
{
    constructor()
    {
        this.questionElements = [];
        this.pageURL = window.location.href;
    }

    getPersistentVars()
    {
        var savedPdfText = window.sessionStorage.getItem("pdfText");
        if(savedPdfText) // something saved
        {
            pdfText = savedPdfText;
            this.searchInput.value = pdfText;
        }
    }

    setPersistentVars()
    {
        window.sessionStorage.setItem("pdfText", pdfText);
    }

    isQuestion(element)
    {
        var isQuestion = true;
        if(element.name.includes("jump")) isQuestion = false;
        if(element.name.includes("flagged")) isQuestion = false;
        if(element.id[0] !== 'q') isQuestion = false;
        return isQuestion;
    }

    nextPage()
    {
        try
        {
            var element = document.getElementsByName("next")[0]; // 1st element returned as there should only be 1 next button
            if(element.value == "Next page") // dont click the submit button !
            {
                debug("next page");
                element.click();
                this.pageAvalible = true;
            }
        }
        catch{}

    }

    getQuestionElementByType(type)
    {
        var elements = document.getElementsByTagName(type);
        for(const element of elements)
        {
            if(this.isQuestion(element)) // only get elements that are indeed questions
            {
                //debug(element);
                this.questionElements.push(element);

            }
        }
    }

    getQuestionElements()
    {
        this.getQuestionElementByType("select");
        //this.getQuestionElementByType("input");
    }
    
    fill()
    {
        this.questionElements.forEach(element => 
        {
            var question = new Question(element);
            question.answer();
        });
    }

    getPdfText()
    {
        pdfText = document.getElementById("meatloafSearchTextInput").value;
    }

    injectMeatloafHTML()
    {
        this.meatloafDiv = document.createElement("div");
        this.meatloafDiv.id = "meatloaf";
        document.body.append(this.meatloafDiv);

        var html = `
            <h1 class="meatloafTitle">MEATLOAF</h1><span id="version">v` + version + `</span>
            <p class="meatloafHeader">paste full learning resource pdf text</p>
            <input type="text" id="meatloafSearchTextInput">
            <br></br>
            <button id="meatloafFillAssessmentButton" class="meatloafButton">Fill</button>
            <p id="meatloafMessage"></p>`

        this.meatloafDiv.innerHTML = html;
        this.message = document.getElementById("meatloafMessage");
        this.fillButton = document.getElementById("meatloafFillAssessmentButton");
        this.searchInput = document.getElementById("meatloafSearchTextInput");
        
        if(this.questionElements.length > 0)
        {
            this.message.innerText = "";
            this.message.style.display = "none";
            this.fillButton.style.display = "inline-block";
        }
        else
        {
            this.message.innerText   = "No possible answers for questions on this page";
            this.message.style.display = "inline-block";
            this.fillButton.style.display = "none";
        }
    }

    injectMeatloafCSS()
    {
        var css = `
        <style>
            :root
            {
                --background-color: #141521;
                --header-color: #5792f7;
                --input-text-color: #b65506;
                --text-color: white;
                --button-color: #322b36;
                --button-hover-color: #262229;
                --border-color: #7d5391;
                --error-color: #ff0000;
            }

            #meatloaf
            {
                font-family: "Lato",sans-serif;
                margin: auto;
                color: var(--text-color);
                text-align: center;
                background-color: var(--background-color);
                padding: 5px;
                opacity: 0.9;
                border-radius: 5px;
                position: fixed;
                top: 55px;
                right: 1%;
                z-index: 999999999;
            }

            .meatloafTitle
            {
                font-size: 25px;
                display: inline-block;
            }

            .meatloafButton
            {
                background-color: var(--button-color); 
                color: inherit;
                width: 50px;
                height: 25px;
                border: 1px solid var(--border-color);
                border-radius: 2px;
            }
            .meatloafButton:hover
            {
                background-color: var(--button-hover-color); 
            }

            #meatloafSearchTextInput
            {
                background-color: inherit;
                color: var(--input-text-color);
                width: 100%;
                border: 1px solid var(--border-color);
            }

            .meatloafToolTip
            {
                position:relative; /* making the .tooltip span a container for the tooltip text */
            }

            .meatloafToolTip:before
            {
                content: attr(data-text); /* here's the magic */
                position:absolute;
                z-index:120;
                
                /* horisontally center */
                left:50%;
                transform:translateX(-50%);
                
                /* move to top */
                bottom:100%;
                margin-bottom:15px;
                
                /* basic styles */
                width:200px;
                padding:10px;
                border-radius:10px;
                background: var(--background-color);
                color: var(--text-color);
                text-align:center;
              
                display:none; /* hide by default */
            }

            .meatloafToolTip:hover:before 
            {
                display:block;
            }

            .meatloafQuestionError
            {
                background-color: var(--error-color);
            }

            .meatloafHeader
            {
                color: var(--header-color);
            }

            #version
            {
                font-size:9px;
                right: 0px;
            }
        </style>
        `
        this.meatloafDiv.insertAdjacentHTML("afterbegin", css);
    }

    fillButtonClick()
    {
        this.getPdfText();
        this.fill();
    }

    gui()
    {
        if(this.pageURL.includes("mod/quiz/attempt.php")) // must be a valid quiz to run
        {
            this.getQuestionElements(); // find all the questions to fill out if any
            this.injectMeatloafHTML();
            this.injectMeatloafCSS();
            this.getPersistentVars();
            this.searchInput.oninput = () =>
            {
                pdfText = this.searchInput.value;
                this.setPersistentVars();
            }
            this.fillButton.onclick = () => 
            {
                this.fillButtonClick();
            }
        }
    }
}



var meatloaf = new Meatloaf();

if(document.readyState === "complete") // if page has loaded just run
{
    meatloaf.gui();
}
else // run when page loads
{
    window.onload = () =>
    {
        meatloaf.gui();
    }
}
