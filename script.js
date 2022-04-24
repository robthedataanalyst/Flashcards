var contentArray = sessionStorage.getItem('items') ? JSON.parse(sessionStorage.getItem('items')) : [];

var knownCardsArray = sessionStorage.getItem('known') ? JSON.parse(sessionStorage.getItem('known')) : [];

// added id counter for flashcard divs
var idCounter = 1;

// card background colors
var known_color = "rgb(160, 214, 54)"; // green
var start_color = "rgb(247, 250, 161)"; // yellow
var title_name = sessionStorage.getItem('title'); // name for H1 & title tag

var confirm_delete = false;

function ConfirmDelete()
{
  confirm_delete = confirm("Are you sure you want to delete?");
}

document.getElementById("save_card").addEventListener("click", () => {
  addFlashcard();
});

document.getElementById("delete_cards").addEventListener("click", () => {
  if (confirm_delete) {
    sessionStorage.clear();
    flashcards.innerHTML = '';
    contentArray = [];
    knownCardsArray = [];
  }
});

document.getElementById("show_card_box").addEventListener("click", () => {
  document.getElementById("create_card").style.display = "block";
  // set focus for cursor
  document.getElementById("question").focus();
});

document.getElementById("close_card_box").addEventListener("click", () => {
  document.getElementById("create_card").style.display = "none";
});

flashcardMaker = (text) => {
  const flashcard = document.createElement("div");
  const question = document.createElement('h2');
  const answer = document.createElement('h2');
  // added id counter for flashcard divs
  flashcard.setAttribute("id", idCounter);
  idCounter++;

  flashcard.className = 'flashcard';

  question.setAttribute("style", "border-top:1px solid red; padding: 15px; margin-top:30px");
  question.textContent = text.my_question;

  answer.setAttribute("style", "text-align:center; display:none; color:#0076C5");

  answer.textContent = text.my_answer;

  flashcard.appendChild(question);
  flashcard.appendChild(answer);

  flashcard.addEventListener("click", () => {
    if(answer.style.display == "none")
      answer.style.display = "block";
    else
      answer.style.display = "none";
  })

  document.querySelector("#flashcards").appendChild(flashcard);
}

contentArray.forEach(flashcardMaker);

addFlashcard = () => {
  const question = document.querySelector("#question");
  const answer = document.querySelector("#answer");

  let flashcard_info = {
    'my_question' : question.value,
    'my_answer'  : answer.value
  }

  contentArray.push(flashcard_info);
  sessionStorage.setItem('items', JSON.stringify(contentArray));
  flashcardMaker(contentArray[contentArray.length - 1]);
  question.value = "";
  answer.value = "";
}

/*  Rob Mods */

document.getElementById("clear_btn").addEventListener("click", () => {
  sessionStorage.removeItem('known');
  knownCardsArray = [];
  location.reload();
});


// show export cards section
document.getElementById("export_cards").addEventListener("click", () => {
  document.getElementById("export").style.display = "block";
  document.getElementById("export_area").innerHTML = JSON.stringify(contentArray);
});

document.getElementById("close_export_box").addEventListener("click", () => {
  document.getElementById("export").style.display = "none";
});

// show import cards section
document.getElementById("import_cards").addEventListener("click", () => {
  document.getElementById("import").style.display = "block";
  document.getElementById("import_area").innerHTML = "";
});

// close import box
document.getElementById("close_import_box").addEventListener("click", () => {
  document.getElementById("import").style.display = "none";
});

// load imported data
document.getElementById("load_imported_data").addEventListener("click", () => {

  // set loaded data
  var loaded_data = document.getElementById('import_area').value;
  console.log("the data:"+loaded_data)
  sessionStorage.setItem('items', loaded_data);

  // reload page
  location.reload();

});

// called when shuffle button is clicked
function shuffleCards() {
  // shuffles the array
  contentArray.sort((a, b) => 0.5 - Math.random());
  sessionStorage.setItem('items', JSON.stringify(contentArray));
  sessionStorage.removeItem('known');
  knownCardsArray = [];  
  location.reload();    
}

// show help section
document.getElementById("help_btn").addEventListener("click", () => {
  document.getElementById("help").style.display = "block";
});

// close help box
document.getElementById("close_help_box").addEventListener("click", () => {
  document.getElementById("help").style.display = "none";
});

// highlight text in the export field
function highlight() {
  document.getElementById('export_area').select();
  copyTextToClipboard();
}

// copy text to clipboard
function copyTextToClipboard() {
  // Get the text field 
  var copyText = document.getElementById("export_area");

  // Select the text field 
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices 

  // Copy the text inside the text field 
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text 
  alert("Export data copied to clipboard");
}

// when right click, turn card background green
window.addEventListener('contextmenu', (event) => {

  // prevent context menu from popping (doesn't work 100%, but good enough)
  event.preventDefault();

  if (event.button == 2)
  {
      // color toggle
      var t_color = "";
      var id = event.target.id;

      // get current card background color
      currentColor = document.getElementById(id).style.backgroundColor;

      // swap card background color, based it it was known
      if (currentColor == start_color || currentColor == '')
        t_color = known_color;
      if (currentColor == known_color)
        t_color = start_color;

      if (!t_color)
        t_color = start_color;

      if (event.target.id != 'flashcards') {
        // set background color
        document.getElementById(id).style.backgroundColor = t_color;

        // push div id for flashcard into known cards array
        if (t_color == known_color)
          knownCardsArray.push(id);

        // remove remove card id from array
        if (t_color == start_color) {
          knownCardsArray = arrayRemove(knownCardsArray, id);
        }

        // save array to local storage
        sessionStorage.setItem('known', JSON.stringify(knownCardsArray));
      }
  }

})

// remove value from array
function arrayRemove(arr, value) { 

    return arr.filter(function(ele){ 
        return ele != value; 
    });
}


// function to color the known cards
function selectKnownCards() {
 for (var i=0; i < knownCardsArray.length; i++) {
      document.getElementById(knownCardsArray[i]).style.backgroundColor = known_color;
  }
}

// prompt user for module name, update h1 tag
function getModuleName() {

    if (!title_name)
      title_name = prompt("Enter Module Name");
    
    document.getElementsByTagName('H1')[0].innerHTML = "Flashcards JS - "+title_name;
    document.getElementsByTagName('title')[0].innerHTML = "Flashcards JS - "+title_name;
    sessionStorage.setItem('title', title_name);
}

// on page load, color the known cards
window.onload = function() {
  selectKnownCards();
  getModuleName();
}