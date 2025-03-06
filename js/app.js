(function() {
    const url = 'https://app-carros.netlify.app/.netlify/functions/db';
    const resultado = document.querySelector('#resultado');
    const marcaIdSelec = document.querySelector('#marca');
    const modeloIdSelec = document.querySelector('#modelo');
    const anoIdSelec = document.querySelector('#ano');

    //Creamos el array/arreglo de autos 
    let autos = []

    //Generar objeto para buscar
    const datosBusqueda = {
        marca: '',
        modelo: '',
        ano: ''
    }

    

    ///Al cargar el formulario
    document.addEventListener('DOMContentLoaded', async () => {
        //Mostrar en pantalla los autos, y llenar cada uno de los selects de búsqueda
        mostrarAutosDesdeAPI();

        //llenar y Oordenar los selects en forma ascendente:   
         llenarYOrdenarSelect(marcaIdSelec, "texto")
         llenarYOrdenarSelect(modeloIdSelec, "texto")
         llenarYOrdenarSelect(anoIdSelec, "texto")
  
    })

    //Función para mostrar todos los autos desde la API
    async function mostrarAutosDesdeAPI() {
         autos = await obtenerDatosAPI(); //con async - await que no se ejecute hasta que se haya cumplido
         //console.log(autos);
         //Recorrer cada uno de los registros y mostrarlos en el html:
         autos.forEach(x => {
            const { id, marca, modelo, ano, precio} = x; //Extraer cada elemento
            
            //Codigo original anterior sin imagen:
            /*
            const autoParrafo = document.createElement('P');
            autoParrafo.textContent = `               
            `;
            */

            const autoParrafo = document.createElement('P');
            autoParrafo.classList.add('mt-10');
            autoParrafo.innerHTML = `                    
                <img src="img/carros_venta/carro_${id}.png" alt="sin foto" class="imagen-3d"> </br>
                ${marca} - ${modelo} - ${ano} - Precio: $${precio} 
            `;


            //Insertar el html
            resultado.appendChild(autoParrafo);
            
         });
    }

    //Función para obtener los datos desde la API
    const obtenerDatosAPI = async() => {
        try {
            const resultado = await fetch(url);
            const datosCarros = await resultado.json();
            return datosCarros.carros;

        } catch(error) {
            console.log(error);
        }
    }



    /*  Funcion para oordernar de forma ascendente en texto, los cuales vamos a tomar desde la API*/
    async function llenarYOrdenarSelect(_selector, _tipo) {

        const autosSel = await obtenerDatosAPI(); //con async - await que no se ejecute hasta que se haya cumplido

        //Recorrer cada uno de los registros y llenar cada select con su cada valor
        autosSel.forEach(x => {
           const {  marca, modelo, ano} = x; //Extraer cada elemento

            llenarSelects(marcaIdSelec, marca);
            llenarSelects(modeloIdSelec, modelo);
            llenarSelects(anoIdSelec, ano);
         
        });
//Una vez llenados los selects, oordenarlos
        oordenarSelect(_selector, _tipo)
                                                  
    }

        //Llenar los selects con cada uno de los valores encontrados de la api, según su select
    function llenarSelects(_selector, valor) {
            //Validar si no existe el elemento agregado
            let existe = false;
            for (let i = 0; i < _selector.options.length; i++) {
                if (_selector.options[i].value === valor) {
                  existe = true;
                  break;
                }
              }
    
              //Si no existem agregar el elemento al select
            if (!existe) {
                const _option = document.createElement('OPTION');
                _option.value = valor;
                _option.textContent = valor;
               _selector.appendChild(_option);
            }
    
    }

    //Función para oordenar los selects de forma ascendente, una vez llenados los selects con los datos de la API
    function oordenarSelect(_sel, _tipo) {
     //NOTA: Para este ejemplo, todos son de _tipo = texto
                        // Convertir las opciones del select a un array
                        const opcionesArray =  Array.from(_sel.options);
                        //console.log(opcionesArray);
                        
                        // Ordenar el array de opciones por el texto de cada opción
                        opcionesArray.sort((a, b) => a.textContent.localeCompare(b.textContent));
                        // nota: si el tipo fuera numero, se haría asi:   opcionesArray.sort((a, b) => a.value.localeCompare(b.value));

                        // Eliminar todas las opciones actuales del select
                        _sel.innerHTML = '';
                        
                        // Volver a agregar las opciones ordenadas al select
                        opcionesArray.forEach(opcion => _sel.appendChild(opcion));
                  
    }

    //Event listeners para los select de búsqueda
    marcaIdSelec.addEventListener('change', e => {
         datosBusqueda.marca = e.target.value;
         filtrarAuto();
    });

    modeloIdSelec.addEventListener('change', e => {
        datosBusqueda.modelo = e.target.value;       
        filtrarAuto();
   });

   anoIdSelec.addEventListener('change', e => {
       datosBusqueda.ano = e.target.value;
       filtrarAuto();
   })


    //Función para filtrar el auto de acuerdo a lo seleccionado
    function filtrarAuto() {
        //Validación para ver si se seleccionó la opción de 'Todas', filtre por todas, asignando al objeto ese valor en vacío para que no afecte al filtro
        //nota: 'all' es el valor fijo que viene por defecto desde el html, para cada select, varía dependiendo como se le llame:  <option value="all" selected>Todos los modelos</option>
        const { marca, modelo, ano } = datosBusqueda;

        if (marca === "all") { datosBusqueda.marca = ''; }
                  
        if (modelo === "all") { datosBusqueda.modelo = ''; }
                    
        if (ano === "all") { datosBusqueda.ano = ''; }
            
        
           //filter es un array metodo, que sirve para iterar sobre un array o arreglo
        const resultadoFiltro = autos.filter( filtrarMarca ).filter( filtrarModelo ).filter( filtrarAno );

         //console.log(resultadoFiltro);

        if (resultadoFiltro.length) { // si hay al menos 1 elemento en el array, mostrar el contenido
             mostrarAutosFiltrados(resultadoFiltro);

        } else {
            //Mandar mensaje que no hubo resultado
            noResultado(); //PENDIENTE

        }


    }

    function noResultado() {
        limpiarHTML();
        const noResultado = document.createElement('div');
        noResultado.classList.add('alerta', 'error');
        noResultado.textContent = 'No hay resultados';
        resultado.appendChild(noResultado);
    
    }


    //Funcion para filtrar por marca
    function filtrarMarca(auto) {
        //console.log(datosBusqueda.marca);
        if ( datosBusqueda.marca !== '') { //Si se seleccionó algo en el filtro de marca, si hay algo o sea diferente a nada en el elemento marca del objeto
             return auto.marca === datosBusqueda.marca; //Retorna solo el automoviel de la marca seleccionada
        }
        //Pero si no selecciona nada, retorna el automivil completo, para no perder los valores que no estan filtrados
        return auto;
    }

        //Funcion para filtrar por Modelo
    function filtrarModelo(auto) {

            if ( datosBusqueda.modelo !== '') { //Si se seleccionó algo en el filtro de marca, si hay algo o sea diferente a nada en el elemento marca del objeto
                 return auto.modelo === datosBusqueda.modelo; //Retorna solo el automoviel de la marca seleccionada
            }
            //Pero si no selecciona nada, retorna el automivil completo, para no perder los valores que no estan filtrados
            return auto;
        
        }

      //Funcion para filtrar por Anio
    function filtrarAno(auto) {

        if ( datosBusqueda.ano !== '') { //Si se seleccionó algo en el filtro de marca, si hay algo o sea diferente a nada en el elemento marca del objeto
             return auto.ano === datosBusqueda.ano; //Retorna solo el automoviel de la marca seleccionada
        }
        //Pero si no selecciona nada, retorna el automivil completo, para no perder los valores que no estan filtrados
        return auto;
    
    }

    function mostrarAutosFiltrados(_filtro) {
         limpiarHTML(); //limpiar todo el contenido

         _filtro.forEach(x => {
            const { id, marca, modelo, ano, precio } = x;

            /* //Codigo original
            const autoHTML = document.createElement('P');
            //Ir imprimiendo en pantalla cada uno de los elementos
            autoHTML.textContent = `
            ${marca} - ${modelo} - ${ano} - Precio: $${precio}
            `;
            */

            const autoHTML = document.createElement('P');
            autoHTML.classList.add('mt-10');
            autoHTML.innerHTML = `                    
                <img src="img/carros_venta/carro_${id}.png" alt="sin foto" class="imagen-3d"> </br>
                ${marca} - ${modelo} - ${ano} - Precio: $${precio} 
            `;

            //Insertar en el html
            resultado.appendChild(autoHTML);
         });
    };

    //Limpiar html
   function limpiarHTML() {
       while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
    

  })();
  