const obtenerProductos = async () => {
  const respuesta = await fetch("http://localhost:3000/api/products");
  const productos = await respuesta.json();
  console.log(productos);
  return productos;
};

obtenerProductos();
