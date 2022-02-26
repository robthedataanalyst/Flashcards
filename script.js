var contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

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
    localStorage.clear();
    flashcards.innerHTML = '';
    contentArray = [];
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
  localStorage.setItem('items', JSON.stringify(contentArray));
  flashcardMaker(contentArray[contentArray.length - 1]);
  question.value = "";
  answer.value = "";
}

/*  Rob Mods */

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
  localStorage.setItem('items', loaded_data);

  // reload page
  location.reload();

});

// called when shuffle button is clicked
function shuffleCards() {
  // shuffles the array
  contentArray.sort((a, b) => 0.5 - Math.random());
  localStorage.setItem('items', JSON.stringify(contentArray));
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

function copyTextToClipboard() {
  /* Get the text field */
  var copyText = document.getElementById("export_area");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  /* Alert the copied text */
  alert("Export data copied to clipboard");
}