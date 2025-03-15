const LOCAL_STORAGE_KEY = "notesInMintList";

function saveNotes(category, title, content) {
  const notes = getNotes();
  notes.push({
    id: getNextId(),
    category,
    title,
    content,
    lastUpdated: Date.now(),
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
}

function getNotes() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

function getNextId() {
  const notes = getNotes();
  const sortedNotes = notes.sort((a, b) => Number(a.id) - Number(b.id));
  let nextId = 1;

  for (let note of sortedNotes) {
    if (nextId < note.id) break;
    nextId = note.id + 1;
  }
  return nextId;
}
