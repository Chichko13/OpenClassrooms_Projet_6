let work = null;
let categories = null;
let trash = null;
const gallery = document.querySelector(".gallery");

///// Récupére works depuis l'api /////
async function fetchWork() {
  return await fetch("http://localhost:5678/api/works")
    .then((res) => {
      return res.json();
    })
    .then((data) => data)
    .catch((error) => console.log(error));
}

///// Récupére les categories depuis l'api /////
async function fetchCategories() {
  const data = await fetch("http://localhost:5678/api/categories")
    .then((res) => {
      return res.json();
    })
    .then((data) => data)
    .catch((error) => console.log(error));
  data.unshift({ id: 0, name: "Tous" }); // ajoute tous
  return data;
}

///// AJOUT DES IMAGES /////
function injectWork(works) {
  gallery.innerHTML = "";
  const modalImg = document.querySelector(".modal__gallery");
  modalImg.innerHTML = "";
  // pour chaque travail récupérer crée...
  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                            <figcaption>${work.title}</figcaption>`;
    gallery.append(figure);
    const modalFigure = document.createElement("figure");
    modalFigure.innerHTML = `<img src="${work.imageUrl}" alt="${work.title}">
                            <button data-id="${work.id}" class="delete__work"><svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
                            </svg></button>`;
    modalImg.append(modalFigure);
  });
  deleteWork();
}

// AJOUT DES FILTRES/CATEGORIES ////
function injectCategories(categories) {
  const div = document.createElement("div");
  categories.forEach((filtre, id) => {
    const filterButton = document.createElement("button");
    filterButton.classList.add("btn__filter");
    filterButton.innerHTML = `${filtre.name}`;
    div.append(filterButton);
    div.classList.add("btn__container");

    filterButton.addEventListener("click", () => {
      div.querySelectorAll(".btn__filter").forEach((btn) => {
        btn.classList.remove("btn__filter--active");
      });
      filterButton.classList.add("btn__filter--active");
      filtreWork(filtre);
    });

    const token = window.localStorage.getItem("token");
    if (id !== 0) {
      const selectCategory = document.createElement("option");
      const modalCategory = document.getElementById("category");
      modalCategory.append(selectCategory);
      gallery.insertAdjacentElement("beforebegin", div);
      selectCategory.innerHTML = `${filtre.name}`;
      selectCategory.value = filtre.id;
    }

    if (token) {
      div.style.display = "none";
    } else {
      edit.style.display = "none";
    }

    if (id === 0) {
      filterButton.classList.add("btn__filter--active");
    }
  });
}

function filtreWork(category) {
  if (category.id === 0) {
    // Si tous afficher toutes les images
    injectWork(work);
  } else {
    // Sinon filtrer en function de la catégorie
    const filtreProjet = work.filter(
      (workFilter) => workFilter.categoryId === category.id
    );
    injectWork(filtreProjet);
  }
}

// supprime en fonction de l'id
async function fetchDeleteWork(id) {
  const token = window.localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    work = await fetchWork();
    injectWork(work);
    console.log(work);
  }
}
function deleteWork() {
  const allBtn = document.querySelectorAll(".delete__work");
  allBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      fetchDeleteWork(btn.dataset.id);
    });
  });
}

const addPicture = document.getElementById("add__picture");
const labelPicture = document.querySelector('label[for="add__picture"]');
const imgModal = document.getElementById("img__modal");
const formParagraph = document.querySelector(".add__file p");
const inputFileContainer = document.querySelector(".add__file");
const formValider = document.getElementById("btn__valider");
const modalCategory = document.getElementById("category");
const inputText = document.querySelector("#form__modal--deux #name");

addPicture.addEventListener("change", (event) => {
  btnChangeColor();
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgModal.src = e.target.result;
      formParagraph.style.display = "none";
      labelPicture.style.display = "none";
      inputFileContainer.style.padding = "0";
      formValider.disabled = false;
    };
    reader.readAsDataURL(file);
  }
});
const formModalDeux = document.getElementById("form__modal--deux");

///// ENVOIE DES TRAVAUX
async function sendWork() {
  const formModalDeux = document.getElementById("form__modal--deux");
  const token = window.localStorage.getItem("token");
  const messageError = document.querySelector(".message__error");

  formModalDeux.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formDataModal = new FormData(formModalDeux); //FormData récupere les données d'un formulaire
    console.log(formDataModal);
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataModal,
    });
    ///// Si status de la reponse est ok /////
    if (response.ok) {
      work = await fetchWork(); /// Récupére les données de l'api
      injectWork(work); // Met à jour l'affichage avec les nouveau envoie
      console.log(work);
      formModalDeux.reset(); // Reset les champs
      modalDeux.close();
      imgModal.src = "assets/icons/picture-svgrepo-com 1.png";
      formParagraph.style.display = "";
      labelPicture.style.display = "";
      inputFileContainer.style.padding = "0.81rem 0 1.19rem";
      formValider.disabled = true;
      formValider.style.background = "#a7a7a7";
      messageError.style.opacity = "0";
    } else {
      console.log(response.status);
      ///// MESSAGE DERREUR /////
      messageError.innerHTML = "Veuillez remplir tous les champs";
      messageError.style.opacity = "1";
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function btnChangeColor() {
  if (
    inputText.value !== "" &&
    addPicture.files.length !== 0 &&
    modalCategory.value !== ""
  ) {
    formValider.style.background = "#1D6154";
  } else {
    formValider.style.background = "#a7a7a7";
  }
  console.log(modalCategory.value);
}
inputText.addEventListener("change", btnChangeColor);
modalCategory.addEventListener("change", btnChangeColor);

function checkLoggin() {
  const login = document.querySelector("#login");
  const token = window.localStorage.getItem("token");
  const editMode = document.querySelector(".edit__mode");
  if (token) {
    login.innerText = "logout";
    editMode.style.display = "flex";
    editMode.innerHTML = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.0229 2.18576L14.3939 2.55679C14.6821 2.84503 14.6821 3.31113 14.3939 3.5963L13.5016 4.49169L12.0879 3.07808L12.9803 2.18576C13.2685 1.89751 13.7346 1.89751 14.0198 2.18576H14.0229ZM6.93332 8.23578L11.0484 4.11759L12.4621 5.53121L8.34387 9.64633C8.25494 9.73525 8.14455 9.79964 8.02496 9.83337L6.23111 10.3455L6.7432 8.55162C6.77693 8.43203 6.84133 8.32164 6.93025 8.23271L6.93332 8.23578ZM11.9408 1.14625L5.89074 7.1932C5.62397 7.45998 5.43078 7.78808 5.32959 8.14685L4.4526 11.2133C4.379 11.4708 4.44953 11.7468 4.63965 11.9369C4.82977 12.127 5.10574 12.1976 5.36332 12.124L8.42973 11.247C8.79156 11.1427 9.11967 10.9495 9.38338 10.6858L15.4334 4.63888C16.2951 3.77722 16.2951 2.37894 15.4334 1.51728L15.0624 1.14625C14.2007 0.284585 12.8024 0.284585 11.9408 1.14625ZM3.19844 2.34214C1.70816 2.34214 0.5 3.55031 0.5 5.04058V13.3812C0.5 14.8715 1.70816 16.0796 3.19844 16.0796H11.5391C13.0293 16.0796 14.2375 14.8715 14.2375 13.3812V9.94683C14.2375 9.539 13.9094 9.21089 13.5016 9.21089C13.0937 9.21089 12.7656 9.539 12.7656 9.94683V13.3812C12.7656 14.0589 12.2167 14.6078 11.5391 14.6078H3.19844C2.52076 14.6078 1.97188 14.0589 1.97188 13.3812V5.04058C1.97188 4.36291 2.52076 3.81402 3.19844 3.81402H6.63281C7.04065 3.81402 7.36875 3.48591 7.36875 3.07808C7.36875 2.67025 7.04065 2.34214 6.63281 2.34214H3.19844Z" fill="white"/></svg> 
                                <p>Mode édition</p>`;
  } else {
    login.innerText = "login";
  }

  login.addEventListener("click", () => {
    window.localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

const modal = document.querySelector(".modal");
const edit = document.querySelector(".edit");

const modalClose = document.querySelector(".modal__close"); // CROIX X
const modalCloseDeux = document.querySelector(".modal__close--deux"); // CROIX X

const modalContainer = document.querySelector(".modal__container"); // modal intérieur
const modalContainerDeux = document.querySelector(".modal__container--deux");

const modalAddBtn = document.querySelector(".add__btn");
const modalReturn = document.querySelector(".modal__return");

const modalUn = document.getElementById("modal1");
const modalDeux = document.getElementById("modal2");

modal.addEventListener("click", () => modal.close()); // event on click 1
modalDeux.addEventListener("click", () => modalDeux.close()); // event on click 2
edit.addEventListener("click", () => modal.showModal()); // on click sur sur modifier
modalClose.addEventListener("click", () => modal.close()); // ferme la modale sur la X
modalCloseDeux.addEventListener("click", () => modalDeux.close()); // ferme la modale sur la X
modalContainer.addEventListener("click", (event) => event.stopPropagation()); // stop la propagation
modalContainerDeux.addEventListener("click", (event) =>
  event.stopPropagation()
);

modalAddBtn.addEventListener("click", () => {
  // btn ajout au click modal 1 se ferme et ouvre la modal 2
  modalUn.close();
  modalDeux.showModal();
  formModalDeux.reset();
  formParagraph.style.display = "block";
  labelPicture.style.display = "block";
  imgModal.src = "assets/icons/picture-svgrepo-com 1.png";
  inputFileContainer.style.padding = "0.81rem 0 1.19rem";
});

modalReturn.addEventListener("click", () => {
  // au click sur la fleche retour revenir a modal 1
  modalUn.showModal();
  modalDeux.close();
});

async function init() {
  // Vérifie si l'utilisateur est connecté
  checkLoggin();
  work = await fetchWork(); // récupére work
  categories = await fetchCategories(); // récupére les catégories
  console.log(work, categories, trash); // les affiches sur la console
  injectWork(work); // inject dans la galerie
  injectCategories(categories); //inject les categories
  categories.forEach(() => filtreWork({ id: 0, name: "Tous" })); // commence avec tous
  sendWork(); //ajout des nouveaux travaux
}

init();
