function login() {
  const register = document.getElementById("login__submit");
  const messageError = document.getElementById("message__error");
  console.log(register);
  register.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(register); //FormData récupere les données d'un formulaire
    const data = Object.fromEntries(formData);
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data), //convertie en json
    });
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      window.localStorage.setItem("token", data.token); // Stock le token dans localStorage
      window.location.href = "index.html";
    } else {
      ///// MESSAGE DERREUR /////
      messageError.innerHTML = "Email et/ou Mot de passe incorrect";
      messageError.style.display = "block";
    }
  });
}

login();
