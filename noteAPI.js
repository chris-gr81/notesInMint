const LOCAL_STORAGE_KEY = "notesInMintList";

function saveNotes(category, title, content, id) {
  const notes = getNotes();
  if (id) {
    const currentNote = notes.find((note) => {
      return note.id == id;
    });
    currentNote.id = id;
    currentNote.category = category;
    currentNote.title = title;
    currentNote.content = content;
    currentNote.lastUpdated = Date.now();
  } else {
    notes.push({
      id: getNextId(),
      category,
      title,
      content,
      lastUpdated: Date.now(),
    });
  }
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

function deleteNote(id) {
  const notes = getNotes();
  const filteredNotes = notes.filter((note) => {
    return Number(note.id) !== Number(id);
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredNotes));
}
