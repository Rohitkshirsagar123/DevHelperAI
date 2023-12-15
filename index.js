  // JavaScript to dynamically resize the textarea as the user types

  const textarea = document.getElementById('messageTextarea');
  textarea.addEventListener('input', function () {
     document.querySelector("#send_btn").style.color="green";
      this.style.height = (this.scrollHeight) + 'px';
     
  });
  textarea.style.height = '50px';



 // global variable
const chatInput =  document.querySelector("#messageTextarea");
const sendBtn =  document.querySelector("#send_btn");
const resultSection = document.querySelector("#outgoing");
const delete_btn = document.querySelector("#delete");


const apiKey = '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'; //  OpenAI API key
let userText;


// load data from local storage -----------------------------------------------------------
const loadDataFromLocalStorage = ()=>{
    const defaultText = `
                        <div class="defaultText">
                          <div>
                            <h1>Hello! I am <span class="heading">DevHelperAI</span></h1>
                            <h3>How can I help you ?</h3>
                          </div>

                        </div>
                        `
    resultSection.innerHTML=localStorage.getItem("all-chats") || defaultText;
}
loadDataFromLocalStorage();


// create element function ---------------------------------------------------------------------
const createElement = (html,className)=>{
    const chatDiv=document.createElement("div");
    chatDiv.classList.add("chat",className);
    chatDiv.innerHTML=html;
    return chatDiv;
}


// get chat response ----------------------------------------------------------------------

const getChatResponse = async(incomingChatDiv)=>{
    const API_URL = 'https://api.openai.com/v1/completions';
    let newElement = null;
    let dat_el = null;
    const requestOptions= {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${apiKey}`
        },
        body:JSON.stringify({
            model:"text-davinci-003",
            prompt:userText,
            max_tokens:2048,
            temperature:0.2,
            n: 1,
            stop:null
        })
    }

    try{
        const  response = await(await fetch(API_URL,requestOptions)).json();
        dat_el= response.choices[0].text.trim();
        // console.log(dat_el);

        // Decode HTML entities
        const tempElement = document.createElement('div');
        tempElement.textContent = dat_el;
        // console.log(tempElement)
        var decodedHtml = tempElement.innerHTML;

    }catch(error){
        console.log(error);
    }

    const seleTypingEle= document.querySelector(".typing");
    var textSecElement = incomingChatDiv.querySelector(".text_sec");
    textSecElement.style.padding ="14px 27px 2px 5px";


    // check response is text or code 
    const lines = dat_el.split('\n');
    var isCode = lines.some(line =>
        line.trim().startsWith('#') || 
        line.trim().startsWith('import') || 
        line.trim().endsWith(';') ||
        (line.trim().startsWith('<') && line.trim().endsWith('>'))
    );
    console.log(isCode);

    if (isCode) {
     textSecElement.style.whiteSpace = 'pre';
     
    }
    // Set the decoded HTML
    textSecElement.innerHTML = `<div>${decodedHtml}</div>`;



// copied code function--------------------------------------------------------------------------------
function copiedCode(){
    var copyIcon = document.createElement("span");
    copyIcon.className = "material-icons";
    copyIcon.textContent = "content_copy";
    copyIcon.addEventListener("click", function() {
        copyToClipboard(textSecElement.firstElementChild.textContent);
    });
    textSecElement.appendChild(copyIcon);
    function copyToClipboard(text) {
        var textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Code copied to clipboard!");
    }

}
// copied code end ------------------------------------



    const paraElemnt= seleTypingEle.parentElement;
    paraElemnt.querySelector(".typing").remove();
    paraElemnt.appendChild(incomingChatDiv);
    incomingChatDiv.querySelector("#UserName").textContent="DevHelperAI";

    // backgroudnd color set answer section
    const incoming= document.querySelectorAll(".incoming");
    if (body.classList.contains('dark-mode')) {
        incoming.forEach(element => {
            element.parentElement.style.backgroundColor="rgb(35 35 35)";
        });
    }else{
        incoming.forEach(element => {
            element.parentElement.style.backgroundColor="rgb(230, 230, 250)"; 
        });
    } 
      // backgroudnd color set answer section end
    

    if (paraElemnt) {
        if (isCode) {
            copiedCode();
            
           }

        //  save data on localstorage
           console.log(resultSection)
           localStorage.setItem("all-chats",resultSection.innerHTML);


        // Scroll to the top of the result_sec container
        const ansContainer = paraElemnt;
        // console.log(ansContainer);
        if (ansContainer) {
            ansContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}



// dotas animation ---------------------------------------------------------------------
const dotsAnimation = ()=>{
    const dotDiv=document.createElement("div");
    dotDiv.classList.add("para_sec");
    dotDiv.innerHTML=`
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
    `;
    return dotDiv;
    
}




//  handle outgoing chat ---------------------------------------------------------
const handleoutgoingChat =()=>{
    

    userText =  chatInput.value.trim();
    if (!userText) return;
    console.log(userText)

    const html=`
                    <div class="ques_container">
                        <span class="user_name" id="UserName">RK</span>
                        <div class="text_sec"><p></p></div>
                    </div>
                ` 
    const outgoingDiv = createElement(html,"para_sec")
    outgoingDiv.querySelector("p").textContent=userText;
    document.querySelector(".defaultText")?.remove();

    resultSection.appendChild(outgoingDiv);


    const dotsAnimationElement = dotsAnimation();
    resultSection.appendChild(dotsAnimationElement); 
    chatInput.value = '';
    chatInput.style.height="50px";

    const incomingChatDiv= createElement(html,"incoming");
    resultSection.appendChild(incomingChatDiv);



    getChatResponse(incomingChatDiv);

}
sendBtn.addEventListener("click",()=>{
    handleoutgoingChat();
    if (body.classList.contains('dark-mode')) {
        document.querySelector("#send_btn").style.color="white";
    }else{
        document.querySelector("#send_btn").style.color="black";
    }
})






// dark mode light mode -----------------------------------------------------------------------

const body = document.body;
const toggleBtn = document.getElementById('toggleBtn');

 // Set initial mode based on stored value
   const storedMode = localStorage.getItem('mode');
   if (storedMode === 'dark-mode') {
       body.classList.add('dark-mode');
       toggleBtn.innerHTML = 'toggle_off';

       chatInput.style.backgroundColor="#333";
       chatInput.style.color="white";

       document.querySelector("#mic").style.color="white";
       document.querySelector("#send_btn").style.color="white";
       //    color for answer div
        const incoming= document.querySelectorAll(".incoming");
        incoming.forEach(element => {
            element.parentElement.style.backgroundColor="rgb(35 35 35)"; 
        }); 
   }

   else if (storedMode === 'light-mode') {
    body.classList.add('light-mode');
    toggleBtn.innerHTML = 'toggle_on';
    toggleBtn.style.color = '#ffbb00'; // Set dark mode icon color

    chatInput.style.backgroundColor="rgb(230, 230, 250)";
    chatInput.style.color="black";

    document.querySelector("#mic").style.color="black";
    document.querySelector("#send_btn").style.color="black";
     //  color for answer div
   const incoming= document.querySelectorAll(".incoming");
   incoming.forEach(element => {
       element.parentElement.style.backgroundColor="rgb(230, 230, 250)"; 
   });

}
function toggleMode() {
   if (body.classList.contains('dark-mode')) {
   body.classList.remove('dark-mode');
   body.classList.add('light-mode');
   toggleBtn.innerHTML = 'toggle_on';

   chatInput.style.backgroundColor="rgb(230, 230, 250)";
   chatInput.style.color="black";
   document.querySelector("#mic").style.color="black";
   document.querySelector("#send_btn").style.color="black";
   
   //  color for answer div
   const incoming= document.querySelectorAll(".incoming");
    incoming.forEach(element => {
        element.parentElement.style.backgroundColor="rgb(230, 230, 250)"; 
    });

   localStorage.setItem('mode', 'light-mode');


   
} else {
   body.classList.remove('light-mode');
   body.classList.add('dark-mode');
   toggleBtn.innerHTML = 'toggle_off';
   toggleBtn.style.color = '#ffbb00'; // Set dark mode icon color

   chatInput.style.backgroundColor="#333";
    chatInput.style.color="white";
    document.querySelector("#mic").style.color="white";
   document.querySelector("#send_btn").style.color="white";

   //    color for answer div
   const incoming= document.querySelectorAll(".incoming");
    incoming.forEach(element => {
        element.parentElement.style.backgroundColor="rgb(35 35 35)"; 
    });

   localStorage.setItem('mode', 'dark-mode');
   
}
}

// delete data to local storage
delete_btn.addEventListener("click",()=>{
    if(confirm("Are you sure you want to delete all the chats!!")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
})





/* speech Recognition -------------------------------------------------------------------------------- */
function runSpeechRecognition() {
    document.querySelector("#mic").style.color="red";

    var action = document.getElementById("messageTextarea");
    // new speech recognition object
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    
    action.value="";
    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        
        action.placeholder = "Listening, please speak...";
    };
    
    
    
    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        document.querySelector("#mic").style.color="white";
        document.querySelector("#send_btn").style.color="green";
        action.value =  transcript ;
        action.classList.remove("hide");
        action.placeholder = "Enter Message...";
        
    };

        // Handle errors
    recognition.onerror = function(event) {
        action.placeholder = "Enter Message... ";
        document.querySelector("#mic").style.color="white";
    };

    // recognition.onspeechend = function() {
    //     action.placeholder = "stopped listening, hope you are done...";
    //     recognition.stop();
    // }
    
        // start recognition
        recognition.start();
}