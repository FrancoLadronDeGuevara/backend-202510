const urlBase = "http://localhost:4000";

const $listaContactos = document.getElementById("contact-list");
const $formulario = document.getElementById("add-form");
const $loadingSpinner = document.querySelector(".loading-spinner");

async function obtenerContactos() {
  const respuesta = await fetch(`${urlBase}/api/contacts`);
  const contactos = await respuesta.json();
  return contactos;
}

setTimeout(() => {
  obtenerContactos().then((contactos) =>
    contactos.map(
      (contacto) =>
        ($listaContactos.innerHTML += `<li class='contact-card' id='contact-example'>
                    <div class='contact-avatar'>
                        <span>${recortarNombre(contacto.name)}</span>
                    </div>
                    <div class='contact-info'>
                        <h3 class='contact-name'>${contacto.name}</h3>
                        <p class='contact-detail'>
                            <span class='detail-icon'>📱</span>
                            ${contacto.phone}
                        </p>
                        <p class='contact-detail'>
                            <span class='detail-icon'>✉️</span>
                            ${contacto.email}
                        </p>
                    </div>
                    <div class='contact-actions'>
                        <button class='btn-action btn-update' id='btn-update-example' title='Actualizar contacto'>
                            <span>🔄</span>
                            <span class='action-label'>Editar</span>
                        </button>
                        <button onclick="eliminarContacto(${
                          contacto.id
                        })" class='btn-action btn-delete' id='btn-delete-example' title='Eliminar contacto'>
                            <span>🗑️</span>
                            <span class='action-label'>Eliminar</span>
                        </button>
                    </div>
                </li>`)
    )
  );
  $loadingSpinner.style.display = "none";
}, 2000);

function recortarNombre(nombre) {
  return nombre.slice(0, 1);
}

$formulario.onsubmit = (e) => {
  e.preventDefault();

  const nombre = document.getElementById("name").value;
  const telefono = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  crearContacto(nombre, telefono, email).then((respuesta) =>
    console.log(respuesta)
  );
};

async function crearContacto(nombre, telefono, email) {
  const respuesta = await fetch(`${urlBase}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name: nombre,
      phone: telefono,
      email,
    }),
  });

  const contacto = await respuesta.json();

  return contacto;
}

async function eliminarContacto(id) {
  const respuesta = await fetch(`${urlBase}/api/contacts/${id}`, {
    method: "DELETE",
  });

  const contactoEliminado = await respuesta.json();
  return contactoEliminado;
}
