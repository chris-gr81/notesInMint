const sidebarCtEl = document.querySelector(".sidebar-ct");
const saveBtnEl = document.querySelector(".save-note");
const categoryInputEl = document.querySelector("#category-input");
const titleInputEl = document.querySelector("#title-input");
const contentInputEl = document.querySelector("#content-input");
const btnNewNoteEl = document.querySelector("#new-note");

document.addEventListener("DOMContentLoaded", () => {
  renderPreviews();
});

saveBtnEl.addEventListener("click", () => {
  getUserInput();
});

btnNewNoteEl.addEventListener("click", () => {
  clickNewNote();
});

function renderPreviews() {
  sidebarCtEl.innerHTML = "";
  const notes = getNotes();
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
    selectCardByClick(e);
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
  let categoryInput = categoryInputEl.value;
  if (!categoryInput) {
    categoryInput = "Unsortiert";
  }
  const titleInput = titleInputEl.value;
  const contentInput = contentInputEl.value;
  const id = getCurrentId();

  if (!titleInput || !contentInput) {
    alert("Bitte gib einen Titel und eine Notiz ein.");
    return;
  }
  saveNotes(categoryInput, titleInput, contentInput, id);
  clearInputScreen();
  renderPreviews();
}

function selectCardByClick(e) {
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

function getCurrentId() {
  const selectedNote = sidebarCtEl.querySelector(".selected-note");
  return selectedNote ? Number(selectedNote.getAttribute("data-id")) : null;
}

function clickNewNote() {
  const prevNotesEls = document.querySelectorAll(".notes-preview");
  prevNotesEls.forEach((e) => {
    e.classList.remove("selected-note");
  });
  clearInputScreen();
  renderPreviews();
}
