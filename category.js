const navbarEl = document.querySelector(".navbar");

let currentCategory = "";

function renderNavbar() {
  navbarEl.innerHTML = "";
  const notes = getNotes();
  const categoryObject = getCategoryObject();

  for (const category in categoryObject) {
    console.log(category);
    navbarEl.appendChild(
      createNavbarCategory(
        category,
        categoryObject[category],
        currentCategory === category
      )
    );
  }
}

function getCategoryObject() {
  const notes = getNotes();
  const categoryObject = {
    Alle: notes.length,
    Unsortiert: countEntriesByCategory("Unsortiert"),
  };
  const notesForIteration = notes.filter((note) => {
    return note.category !== "Unsortiert";
  });

  notesForIteration.forEach((note) => {
    if (note.category in categoryObject) {
      categoryObject[note.category]++;
    } else {
      categoryObject[note.category] = 1;
    }
  });
  return categoryObject;
}

function countEntriesByCategory(item) {
  const notes = getNotes();
  let counter = 0;
  notes.forEach((note) => {
    if (note.category == item) counter++;
  });
  return counter;
}

function filterCategory(notes) {
  if (currentCategory == "Alle") {
    return notes;
  } else {
    const filteredNotes = notes.filter((note) => {
      return note.category == currentCategory;
    });
    return filteredNotes;
  }
}

function createNavbarCategory(category, catNumber, isCat) {
  const categoryBtn = document.createElement("button");
  categoryBtn.classList.add("btn");
  categoryBtn.classList.add("category-btn");
  if (isCat) {
    categoryBtn.classList.add("selected-category");
  }
  categoryBtn.setAttribute("data-category", category);
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
                <span class="btn-text">${catNumber}</span>
              </div>
              <span class="btn-text">${category}</span>      
      `;
  return categoryBtn;
}

function clickOnCategory(selectedCategory) {
  const categoryBtnEls = document.querySelectorAll(".category-btn");
  categoryBtnEls.forEach((e) => {
    e.classList.remove("selected-category");
  });
  currentCategory = selectedCategory.dataset.category;
  renderNavbar();
  renderPreviews();
  clearInputScreen();
}

function getCurrentCategoryById(id) {
  const notes = getNotes();
  const currentNote = notes.find((note) => {
    return note.id == id;
  });
  return currentNote.category;
}
