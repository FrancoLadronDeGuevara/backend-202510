const $formulario = document.getElementById("formulario");

$formulario.onsubmit = (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      localStorage.setItem("token", data.token);

      setTimeout(() => {
        location.href = "../index.html";
      }, 2000);
    });
};
