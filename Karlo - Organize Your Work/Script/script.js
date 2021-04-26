let root = document.getElementById("root"); // Getting Root Using Its ID

let task; // letting card as task

const dragStart = (event) => {
  // dragStart arrow function for card's dragStart event listener
  // console.log("dragging");
  task = event.target;
  event.target.classList.add("dragging");
};

const dragEnd = (event) => {
  // dragEnd arrow function for card's dragEnd event listener
  // console.log("dragend");
  event.target.className = "card";
};

class List {
  // List class having List's Essentials
  constructor(place, title = "Untitled") {
    // Constructor having place of list and list title
    this.place = place;
    this.title = title;
    this.cardArray = []; // Initializing cardArray

    this.render(); // Calling this.render();
  }

  addToDo() {
    // function which will push new card in array
    let text = this.input.value;
    this.cardArray.push(new Card(text, this.ListElement, this));
  }

  render() {
    // function which will render List Element
    this.createListElement();
    this.place.append(this.ListElement);
  }

  createListElement() {
    // function which will create list element
    //Create elements
    this.h2 = document.createElement("h2");
    this.h2.innerText = this.title;
    this.input = document.createElement("input");
    this.input.classList.add("comment");
    this.button = document.createElement("button");
    this.button.innerText = "Add";
    this.button.classList.add("btn-save");
    this.button.id = "to-do-list-button";

    this.ListElement = document.createElement("div"); // creating ListElement DIV

    //Adding Event listener on create button for creating List
    this.button.addEventListener("click", () => {
      if (this.input.value != "") {
        this.addToDo.call(this);
        this.input.value = "";
      }
    });

    this.removeButton = document.createElement("button"); // creating removeButton for List
    this.removeButton.innerText = "X";
    this.removeButton.classList = "removeButton";
    this.removeButton.addEventListener("click", () => {
      this.ListElement.remove();
    });

    //Append elements to the to-do list element
    this.ListElement.append(this.removeButton);
    this.ListElement.append(this.h2);
    this.ListElement.append(this.input);
    this.ListElement.append(this.button);

    this.ListElement.classList.add("List");
    this.ListElement.classList.add("dropzone");
  }
}

class Card {
  constructor(text, place, List) {
    // constructor having text, place and list
    this.place = place;
    this.List = List;
    this.state = {
      text: text,
      description: "Click to write a description...",
      comments: [],
    };
    this.render(); // calling this.render()
  }

  render() {
    this.card = document.createElement("div");
    this.card.classList.add("card");
    this.card.setAttribute("draggable", "true"); // making card draggable
    this.card.addEventListener("dragstart", dragStart);
    this.card.addEventListener("dragend", dragEnd);
    this.card.addEventListener("click", (e) => {
      if (e.target != this.deleteButton) {
        this.showMenu.call(this); // if user click target is not deleteButton on card call showMenu
      }
    });

    this.p = document.createElement("p");
    this.p.innerText = this.state.text;

    this.deleteButton = document.createElement("button"); // creating delete button for card
    this.deleteButton.innerText = "X";
    this.deleteButton.addEventListener("click", () => {
      // delete button event listener
      this.deleteCard.call(this);
    });

    this.card.append(this.p);
    this.card.append(this.deleteButton); // appending deleteButton

    this.place.append(this.card); // appending card to the place which is ListElement

    // Drag And Drop
    const dropzones = document.querySelectorAll(".dropzone");

    const dragEnter = (event) => {
      // console.log("ENTER");
      event.preventDefault();
      if (event.target.className === "List dropzone") {
        event.target.className += " hovered";
      }
    };

    function getDragAfterElement(container, y) {
      // getting dragAfter element (this code solves problem having with drag and drop (drag card inside card))

      const draggableElements = [...container.querySelectorAll(".card")];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }

    const dragLeave = (event) => {
      // console.log("LEAVE");
      event.preventDefault();
      if (event.target.className === "column dropzone hovered") {
        event.target.className = "column dropzone";
      }
    };

    for (const dropzone of dropzones) {
      dropzone.addEventListener("dragenter", dragEnter);
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(dropzone, e.clientY);
        // const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
          dropzone.appendChild(task);
        } else {
          dropzone.insertBefore(task, afterElement);
        }
      });
      dropzone.addEventListener("dragleave", dragLeave);
      // dropzone.addEventListener("drop", dragDrop);
    }
  }

  deleteCard() {
    // delete card function which will be called when delete button clicked
    this.card.remove();
    let i = this.List.cardArray.indexOf(this);
    this.List.cardArray.splice(i, 1);
  }

  showMenu() {
    // function which will show menu for card
    //Create elements
    this.menu = document.createElement("div");
    this.menuContainer = document.createElement("div");
    this.menuTitle = document.createElement("div");
    this.menuDescription = document.createElement("div");
    this.commentsInput = document.createElement("input");
    this.commentsButton = document.createElement("button");
    this.menuComments = document.createElement("div");

    //Add class names
    this.menu.className = "menu";
    this.menuContainer.className = "menuContainer";
    this.menuTitle.className = "menuTitle";
    this.menuDescription.className = "menuDescription";
    this.menuComments.className = "menuComments";
    this.commentsInput.className = "commentsInput comment";
    this.commentsButton.className = "commentsButton btn-save";

    //Add inner Text
    this.commentsButton.innerText = "Add";
    this.commentsInput.placeholder = "Write a comment...";

    //Event listeners
    this.menuContainer.addEventListener("click", (e) => {
      //   console.log(e.target);
      if (e.target.classList.contains("menuContainer")) {
        this.menuContainer.remove();
      }
    });

    this.commentsButton.addEventListener("click", () => {
      if (this.commentsInput.value != "") {
        this.state.comments.push(this.commentsInput.value);
        this.renderComments();
        this.commentsInput.value = "";
      }
    });

    //Append
    this.menu.append(this.menuTitle);
    this.menu.append(this.menuDescription);
    this.menu.append(this.commentsInput);
    this.menu.append(this.commentsButton);
    this.menu.append(this.menuComments);
    this.menuContainer.append(this.menu);
    root.append(this.menuContainer);

    this.editableDescription = new EditableText(
      this.state.description,
      this.menuDescription,
      this,
      "description",
      "textarea"
    );
    this.editableTitle = new EditableText(
      this.state.text,
      this.menuTitle,
      this,
      "text",
      "input"
    );

    this.renderComments();
  }

  renderComments() {
    let currentCommentsDOM = Array.from(this.menuComments.childNodes);

    currentCommentsDOM.forEach((commentDOM) => {
      commentDOM.remove();
    });

    this.state.comments.forEach((comment) => {
      new Comment(comment, this.menuComments, this);
    });
  }
}

class EditableText {
  constructor(text, place, card, property, typeOfInput) {
    this.text = text;
    this.place = place;
    this.card = card;
    this.property = property;
    this.typeOfInput = typeOfInput;
    this.render();
  }

  render() {
    this.div = document.createElement("div");
    this.p = document.createElement("p");

    this.p.innerText = this.text;

    this.p.addEventListener("click", () => {
      this.showEditableTextArea.call(this);
    });

    this.div.append(this.p);
    this.place.append(this.div);
  }

  showEditableTextArea() {
    let oldText = this.text;

    this.input = document.createElement(this.typeOfInput);
    this.saveButton = document.createElement("button");

    this.p.remove();
    this.input.value = oldText;
    this.saveButton.innerText = "Save";
    this.saveButton.className = "btn-save";
    this.input.classList.add("comment");

    this.saveButton.addEventListener("click", () => {
      this.text = this.input.value;
      this.card.state[this.property] = this.input.value;
      if (this.property == "text") {
        this.card.p.innerText = this.input.value;
      }
      this.div.remove();
      this.render();
    });

    function clickSaveButton(event, object) {
      // function of saving using save button
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        object.saveButton.click();
      }
    }

    this.input.addEventListener("keyup", (e) => {
      if (this.typeOfInput == "input") {
        clickSaveButton(e, this);
      }
    });

    this.div.append(this.input);

    if (this.typeOfInput == "textarea") {
      this.div.append(this.saveButton);
    }

    this.input.select();
  }
}

class Comment {
  // comment class which is a part of card's show menu
  constructor(text, place, card) {
    this.text = text;
    this.place = place;
    this.card = card;
    this.render();
  }

  render() {
    this.div = document.createElement("div");
    this.div.className = "comment";
    this.div.classList.add("commentDiv");
    this.div.innerText = this.text;

    this.place.append(this.div);

    this.removeButton = document.createElement("button"); // creating removeButton for List
    this.removeButton.innerText = "X";
    this.removeButton.classList = "removeButton";
    this.removeButton.addEventListener("click", () => {
      this.div.remove();
    });

    this.div.append(this.removeButton);
  }
}

//-------------main------------ // in the end because we have to fetch all data then create list

let addListInput = document.getElementById("addListInput");
let addListButton = document.getElementById("addListButton");

addListButton.addEventListener("click", () => {
  // helping in making new list
  if (addListInput.value.trim() != "") {
    new List(root, addListInput.value);
    addListInput.value = "";
  }
});

// index.html and style.css is linked with this file

/* 
    CREDITS!
    Developer Name - Yash Soni
    GitHub - @CHAMP010
    Discord - @CHAMP
    Nationality - India

    Project Category - JavaScript Practice Project
    Project Responsiveness = 0
*/


/* Reference Taken - 
  GitHub - albertoarf13
         - maximesalomon
         - WebDevSimplified
*/