const sidebarCtEl = document.querySelector(".sidebar-ct");
const saveBtnEl = document.querySelector(".save-note");
const deleteBtnEl = document.querySelector(".delete-note");
const categoryInputEl = document.querySelector("#category-input");
const titleInputEl = document.querySelector("#title-input");
const contentInputEl = document.querySelector("#content-input");
const btnNewNoteEl = document.querySelector("#new-note");
const navbandEl = document.querySelector(".navband");

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

function clearInputScreen() {
  categoryInputEl.value = "";
  titleInputEl.value = "";
  contentInputEl.value = "";
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
  currentCategory = "Alle";
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

function clickNewNote() {
  const prevNotesEls = document.querySelectorAll(".notes-preview");
  prevNotesEls.forEach((e) => {
    e.classList.remove("selected-note");
  });
  currentCategory = "Alle";
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
  currentCategory = "Alle";
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
