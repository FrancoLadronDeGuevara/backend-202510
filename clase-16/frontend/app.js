const $listadoProductos = document.getElementById("lista-productos");

const token = localStorage.getItem("token");

const obtenerProductos = async () => {
  const respuesta = await fetch("http://localhost:3000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const productos = await respuesta.json();
  return productos;
};

obtenerProductos().then((productos) => {
  productos.map(
    (prod) =>
      ($listadoProductos.innerHTML += `
    <div class="tarjeta-producto">
      <h4>${prod.name}</h4>
      <p class="descripcion-producto">${prod.description}</p>
      <div class="contenedor-precio">
        <span class="precio">$ ${prod.price}</span>
        <span class="stock">Stock: ${prod.stock}</span>
      </div>
      <button class="boton-agregar">Agregar al carrito</button>
    </div>`)
  );
});
