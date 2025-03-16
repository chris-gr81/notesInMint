const sidebarCtEl = document.querySelector(".sidebar-ct");
const saveBtnEl = document.querySelector(".save-note");
const deleteBtnEl = document.querySelector(".delete-note");
const categoryInputEl = document.querySelector("#category-input");
const titleInputEl = document.querySelector("#title-input");
const contentInputEl = document.querySelector("#content-input");
const btnNewNoteEl = document.querySelector("#new-note");
const navbandEl = document.querySelector(".navband");

let currentCategory = "";

document.addEventListener("DOMContentLoaded", () => {
  currentCategory = "Alle";
  renderPreviews();
  renderNavband();
});

saveBtnEl.addEventListener("click", () => {
  getUserInput();
});

deleteBtnEl.addEventListener("click", () => {
  deleteCurrentNote();
});

btnNewNoteEl.addEventListener("click", () => {
  clickNewNote();
});

function renderPreviews() {
  sidebarCtEl.innerHTML = "";
  const notes = filterCategory(getNotes());
  const sortedNotes = notes.sort((a, b) => {
    return Number(b.lastUpdated) - Number(a.lastUpdated);
  });
  sortedNotes.forEach((note) => {
    sidebarCtEl.appendChild(createPreviewNote(note));
  });
}

function renderContentScreen(currentNote) {
  categoryInputEl.value = currentNote.category;
  contentInputEl.value = currentNote.content;
  titleInputEl.value = currentNote.title;
}

function renderNavband() {
  navbandEl.innerHTML = "";
  notes = getNotes();
  const categoryList = getCategoryList(notes);
  categoryList.forEach((category) => {
    if (currentCategory == category.category) {
      navbandEl.appendChild(createNavbandCategory(category, true));
    } else {
      navbandEl.appendChild(createNavbandCategory(category, false));
    }
  });
}

function getCategoryList(notes) {
  const categoryList = [];
  const categorySet = new Set();
  notes.forEach((note) => {
    categorySet.add(note.category);
  });

  categoryList.push({ category: "Alle", number: notes.length });
  categorySet.forEach((setItem) => {
    let counter = 0;
    notes.forEach((e) => {
      if (e.category == setItem) counter++;
    });
    categoryList.push({ category: setItem, number: counter });
  });
  return categoryList;
}

function filterCategory(notes) {
  console.log(currentCategory);
  if (currentCategory == "Alle") {
    return notes;
  } else {
    const filteredNotes = notes.filter((note) => {
      console.log(note.category);
      return note.category == currentCategory;
    });
    return filteredNotes;
  }
}

function clearInputScreen() {
  categoryInputEl.value = "";
  titleInputEl.value = "";
  contentInputEl.value = "";
}

function createNavbandCategory(category, haveCat) {
  const categoryBtn = document.createElement("button");
  categoryBtn.classList.add("btn");
  categoryBtn.classList.add("category-btn");
  console.log(haveCat);
  if (haveCat) {
    categoryBtn.classList.add("selected-category");
  }
  categoryBtn.setAttribute("data-category", category.category);
  categoryBtn.addEventListener("click", (e) => {
    clickOnCategory(e.currentTarget);
  });
  categoryBtn.innerHTML = `
            <div class="btn-inner-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="icon"
              >
                <path
                  d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H12.5A1.5 1.5 0 0 1 14 5.5v1.401a2.986 2.986 0 0 0-1.5-.401h-9c-.546 0-1.059.146-1.5.401V3.5ZM2 9.5v3A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 12.5 8h-9A1.5 1.5 0 0 0 2 9.5Z"
                />
              </svg>
              <span class="btn-text">${category.number}</span>
            </div>
            <span class="btn-text">${category.category}</span>      
    `;
  return categoryBtn;
}

function createPreviewNote(note) {
  const notesPreviewEl = document.createElement("div");
  notesPreviewEl.classList.add("notes-preview");
  notesPreviewEl.setAttribute("data-id", note.id);
  notesPreviewEl.addEventListener("click", (e) => {
    clickOnCard(e);
  });
  notesPreviewEl.innerHTML = `
              <div class="preview-title">${note.title}</div>
              <div class="preview-text">${note.content}</div>
              <div class="preview-category">${note.category}</div>
              <div class="preview-time">${new Date(
                note.lastUpdated
              ).toLocaleString("de-DE")}</div> `;
  return notesPreviewEl;
}

function getUserInput() {
  let categoryInput = parseInput(categoryInputEl.value);
  if (!categoryInput || categoryInput == "Alle") {
    categoryInput = "Unsortiert";
  }
  const titleInput = parseInput(titleInputEl.value);
  const contentInput = parseInput(contentInputEl.value);
  const id = getCurrentId();

  if (!titleInput || !contentInput) {
    alert("Bitte gib einen Titel und eine Notiz ein.");
    return;
  }
  saveNotes(categoryInput, titleInput, contentInput, id);
  clearInputScreen();
  renderPreviews();
  renderNavband();
}

function clickOnCard(e) {
  const selectedId = e.currentTarget.dataset.id;
  const notes = getNotes();
  if (e.currentTarget.classList.contains("selected-note")) {
    return;
  }

  const selectedNote = notes.find((note) => {
    return note.id == selectedId;
  });

  const notesPreviewEls = document.querySelectorAll(".notes-preview");
  notesPreviewEls.forEach((e) => {
    e.classList.remove("selected-note");
  });

  e.currentTarget.classList.add("selected-note");
  renderContentScreen(selectedNote);
}

function clickOnCategory(selectedCategory) {
  const categoryBtnEls = document.querySelectorAll(".category-btn");
  categoryBtnEls.forEach((e) => {
    e.classList.remove("selected-category");
  });
  currentCategory = selectedCategory.dataset.category;
  renderNavband();
  renderPreviews();
  clearInputScreen();
}

function clickNewNote() {
  const prevNotesEls = document.querySelectorAll(".notes-preview");
  prevNotesEls.forEach((e) => {
    e.classList.remove("selected-note");
  });
  clearInputScreen();
  renderPreviews();
  renderNavband();
}

function getCurrentId() {
  const selectedNote = sidebarCtEl.querySelector(".selected-note");
  return selectedNote ? Number(selectedNote.getAttribute("data-id")) : null;
}

function deleteCurrentNote() {
  const currentId = getCurrentId();
  clearInputScreen();
  deleteNote(currentId);
  renderPreviews();
  renderNavband();
}

function parseInput(text) {
  if (typeof text !== "string") {
    return text;
  }

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
