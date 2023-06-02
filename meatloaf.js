var version = "0.0.1";
var pdfText = "";

function debug(str)
{
    console.log(str); // uncomment to enable debug
}

class Part
{
    constructor(element)
    {
        this.element = element;
    }
}

class Question
{
    constructor(element)
    {
        this.element = element;
        debug(this.element);
        this.#getState();
        this.#getQuestionText();
        this.#getParts();
    }

    #getState()
    {
        this.state = this.element.getElementsByClassName("state")[0].innerHTML;
        debug("question state : " + this.state);
    }

    #getQuestionText()
    {
        var qText = this.element.getElementsByClassName("qtext");
        if(qText.length == 0) debug("[Question] qText not found");
        else
        {
            // get last element as sometimes hidden ones are included if question was previously answered
            var bold = qText[qText.length - 1].getElementsByTagName("b");
            if(bold.length == 1) this.questionText = bold[0].innerHTML;
            else debug("[Question] Question text not found");
        }
    }

    #getParts()
    {
        if(this.questionText.includes("Select the correct words"))
        {
            this.element.getElementsByTagName("select");
        }
    }
}


class Etco
{
    constructor()
    {
        this.questionElements = [];
        this.#getQuestionElements();
    }

    #getQuestionElements()
    {
        var regionMain = document.getElementById("region-main");
        var qElements = regionMain.getElementsByClassName("content");
        if(qElements.length > 0)
        {
            for(var i = 0; i < qElements.length; i++)
            {
                var el = qElements[i].parentElement;
                var question = new Question(el);
                this.questionElements.push(question);
            };
        }
        else
        {
            debug("[Etco] No Question elements found on page");
        }
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
            }
        }
        catch
        {
            debug("[Etco] cant find next page button");
        }
    }

    fill()
    {
        this.questionElements.forEach(question => 
        {
            question.answer();
        });
    }
}

class Meatloaf
{
    constructor()
    {
        this.pageURL = window.location.href;
        if(this.pageURL = "https://etco.elearning.org.nz/mod/quiz/attempt.php")
        {
            this.page = new Etco();
        }
    }

    #getPersistentVars()
    {
        var savedPdfText = window.sessionStorage.getItem("pdfText");
        if(savedPdfText) // something saved
        {
            pdfText = savedPdfText;
            this.searchInput.value = pdfText;
        }
    }

    #setPersistentVars()
    {
        window.sessionStorage.setItem("pdfText", pdfText);
    }
    

    #getPdfText()
    {
        pdfText = document.getElementById("meatloafSearchTextInput").value;
    }

    #injectMeatloafHTML()
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
        
        //if(this.questionElements.length > 0)
        if(1)
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

    #injectMeatloafCSS()
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

    #fillButtonClick()
    {
        this.page.fill();
    }

    gui()
    {
        if(this.pageURL.includes("mod/quiz/attempt.php")) // must be a valid quiz to run
        {
            this.#injectMeatloafHTML();
            this.#injectMeatloafCSS();
            this.#getPersistentVars();
            this.searchInput.oninput = () =>
            {
                this.#getPdfText();
                this.#setPersistentVars();
            }
            this.fillButton.onclick = () => 
            {
                this.#fillButtonClick();
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
