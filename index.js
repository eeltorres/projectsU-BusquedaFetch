// LLAMAR A ELEMENTOS DE HTML

var cboxMain = document.getElementById('select_Main')
var cboxTema = document.getElementById('select_tema')
var cboxPresentador = document.getElementById('select_presentador')
var cboxDia = document.getElementById('select_dia')
var divResul = document.getElementById('div_resul')
var divData = document.getElementById('div_cboxData')
var btnConsultar = document.getElementById('btn_cosultar')
var textError = document.getElementById('p_error')
var tableResul = document.getElementById('table').getElementsByTagName('tbody')[0]

// VARIABLES QUE GUARDARAN LOS RESULTADOS PRINCIPALES
var valorPrincipal = "";
var valorSecundario = "";
var datoFiltrado;
var datosJSON;
var totalFilas;

// LIMPIAR LAS FILAS DE LA TABLA
function limpiarTabla() {
    tableResul.innerHTML = "";
}

// FUNCION PARA OCULTAR LOS DIV QUE NO SE SELECCIONEN
function ocultarMenus(select1, select2) {
    select1.setAttribute('style', 'display: none')
    select2.setAttribute('style', 'display: none')
}

// FUNCION PARA RESETAR TODOS LOS VALORES A VACIOS
function reset() {
    cboxTema.options[0].selected = true;
    cboxPresentador.options[0].selected = true;
    cboxDia.options[0].selected = true;
}

// EVENTO QUE DETECTA LA ELECCION PRINCIPAL
cboxMain.addEventListener('change', (event) => {
    //OCULTAR DIV TEMPORALMENTE Y LIMPAR RESULTADOS
    reset();
    divData.style.display = 'none';
    divResul.style.display = 'none';
    btnConsultar.setAttribute('disabled', 'true')

    valorPrincipal = cboxMain.value; // obtener el valor seleccionado en una variable

    if (valorPrincipal == 'Dia') {
        ocultarMenus(cboxPresentador, cboxTema)
        divData.setAttribute('style', 'display: block')
        cboxDia.setAttribute('style', 'display:block')
        validar_opcion(cboxDia)
    } else if (valorPrincipal == 'Tema') {
        ocultarMenus(cboxPresentador, cboxDia)
        divData.setAttribute('style', 'display: block')
        cboxTema.setAttribute('style', 'display:block')
        validar_opcion(cboxTema)
    } else if (valorPrincipal == 'Presentador') {
        ocultarMenus(cboxTema, cboxDia)
        divData.setAttribute('style', 'display: block')
        cboxPresentador.setAttribute('style', 'display:block')
        validar_opcion(cboxPresentador)
    }
})


// FUNCION PARA VALIDAR QUE AMBOS CAMPOS ESTEN LLENOS
function validar_opcion(select) {
    select.addEventListener('change', (event) => {
        valorSecundario = select.value;
        textError.innerHTML = "";
        if (valorSecundario != "") {
            btnConsultar.removeAttribute('disabled')
        } else {
            btnConsultar.setAttribute('disabled', 'true') // DESHABILITAR EL BOTON SI NO HAY OPCION ELEGIDA
        }
    })
}



// FUNCION DEL CLIC DEL BOTON CONSULTAR
btnConsultar.addEventListener('click', (event) => {
    limpiarTabla();
    divResul.style.display = 'none';
    valorPrincipal = valorPrincipal.toLowerCase()
    // VALIDAR OPCION ELEGIDA
    if (valorPrincipal == 'dia') {
        datoFiltrado = datosJSON.filter(e => e.dia == valorSecundario)
    } else if (valorPrincipal == 'tema') {
        datoFiltrado = datosJSON.filter(e => e.tema == valorSecundario)
    } else {
        datoFiltrado = datosJSON.filter(e => e.presentador == valorSecundario)
    }



    if (datoFiltrado.length < 1) { // SI LA BUSQUEDA NO ARROJO RESULTADOS
        textError.innerHTML = 'No se encontraron resultados, por favor, use otros términos de búsqueda.';
    } else {
        textError.innerHTML = '';
        divResul.style.display = 'block'

        // RETRASE DE 2 A 5 SEGUNDOS PARA MOSTRAR LOS DATOS
        esperar().then(() => {
            for (var i = 0; i < datoFiltrado.length; i++) {
                let dia = datoFiltrado[i].dia;
                let tema = datoFiltrado[i].tema;
                let presentador = datoFiltrado[i].presentador;
                tableResul.insertRow().innerHTML = `<td>${dia}</td><td>${tema}</td><td>${presentador}</td>`;
            }
        }).catch((err)=> Error(err))

        totalFilas = tableResul.rows.length;
    }
})

// FUNCION DE ESPERA DE 1 A 5 SEGUNOOS
function esperar() {
    return new Promise(resolve => {
        setTimeout(resolve, Math.floor((Math.random() * (5000 - 2000 + 1) + 2000)))
})
}

// FUNCION PARA EXTRAER LOS DATOS DE JSON PARA LOS COMBOBOX
function obtnerDatos() {

    fetch('data/conferencia.json')
        .then(
            response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el archivo JSON')
                }
                return response.json()
            }
        ).then(data => {
            // CARGAR TEMAS Y PRESENTADOR
            datosJSON = data;
            data.forEach(objeto => {
                var optionTema = document.createElement('option')
                var optionPresentador = document.createElement('option')

                optionTema.text = objeto.tema
                optionTema.value = objeto.tema

                optionPresentador.text = objeto.presentador
                optionPresentador.value = objeto.presentador

                cboxPresentador.add(optionPresentador)
                cboxTema.add(optionTema)
            })

            // CARGAR PRESENTADOR
        }).catch(err => console.log('Error', err))
}

// Obtener los datos del JSON al terminar de cargar la pagina
document.addEventListener('DOMContentLoaded', obtnerDatos())