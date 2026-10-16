const notificacion = document.getElementById("notificacion");

fetch("http://localhost:3000/api")
  .then((res) => res.json())
  .then((data) => {
    if (data.success == true) {
      notificacion.style.backgroundColor = "green";
    } else {
      notificacion.style.backgroundColor = "red";
    }

    notificacion.innerHTML = `<p>${data.message}</p>`;
  });
