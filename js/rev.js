//Variables o campos del formulario

let DB;
const mascotaInput=document.querySelector("#mascota")
const propietarioInput=document.querySelector("#propietario")
const telefonoInput=document.querySelector("#telefono")
const fechaInput=document.querySelector("#fecha")
const horaInput=document.querySelector("#hora")
const sintomasInput=document.querySelector("#sintomas")

//Interfaz del usuario
const formulario= document.querySelector("#nueva-cita")
const contenedorCitas=document.querySelector("#citas")

let editando;


class Citas{
    constructor(){
        this.citas=[]
    }
    agregarCita(cita){
        this.citas=[...this.citas, cita]
    }
    eliminarCita(id){
        this.citas=this.citas.filter(cita =>cita.id !== id)
    }
    editarCita(citaActualizada){
        this.citas=this.citas.map(cita =>cita.id===citaActualizada.id ? citaActualizada : cita )

    }

}

class UI{
    imprimirAlerta(mensaje, tipo){
        //Creando el div
        const divMensaje= document.createElement("div")
        divMensaje.classList.add("text-center", "alert","d.block", "col-12")

        //Agregar clase en base al tipo error
        if(tipo==="error"){
            divMensaje.classList.add("alert-danger")

        }
        else{
            divMensaje.classList.add("alert-success")
        }
        //Mensaje de error 
        divMensaje.textContent=mensaje;

        //Agregar al DOM 
        document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector(".agregar-cita"))
        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 5000);
    }
    imprimirCitas(){
        this.limpiarHTML()

        //Leer contenido de la base de datos
        const objectStore= DB.transaction("citas").objectStore("citas")
        const total= objectStore.count()
        total.onsuccess= function(){
            console.log(total.result)
        }
        objectStore.openCursor().onsuccess= function (e){

            const cursor =e.target.result
            if(cursor){
                const {mascota, propietario, telefono, fecha, hora, sintomas, id}= cursor.value;
                const divCita= document.createElement("div")
                divCita.classList.add("cita", "p-3")
                divCita.dataset.id= id
    
                //Scripting de los elementos de la cita
                const mascotaParrafo= document.createElement("h2")
                mascotaParrafo.classList.add("card-title", "font-weight-bolder")
                mascotaParrafo.textContent= mascota
    
    
    
                //Para el propietario
                const propietarioParrafo= document.createElement("p")
                propietarioParrafo.innerHTML= `
                      <span class= "font-weight-bolder">Propietario: </span> ${propietario}
                `
                //Para el teléfono
                const telefonoParrafo= document.createElement("p")
                telefonoParrafo.innerHTML= `
                      <span class= "font-weight-bolder">Teléfono: </span> ${telefono}
                `
                //Para el fecha
                const fechaParrafo= document.createElement("p")
                fechaParrafo.innerHTML= `
                      <span class= "font-weight-bolder">Fecha: </span> ${fecha}
                `
                //Para la hora
                const horaParrafo= document.createElement("p")
                horaParrafo.innerHTML= `
                      <span class= "font-weight-bolder">Hora: </span> ${hora}
                `   
                
                //Para los síntomas
                const sintomasParrafo= document.createElement("p")
                sintomasParrafo.innerHTML= `
                      <span class= "font-weight-bolder">Síntomas: </span> ${sintomas}
                `  
    
                //Botón para borrar la cita
                const btnEliminar= document.createElement("button")
                btnEliminar.classList.add("btn", "btn-danger", "mr-2")
                btnEliminar.innerHTML='Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    
                btnEliminar.onclick= ()=> eliminarCita(id)
    
                //Añade un botón para editar:
                const btnEditar= document.createElement("button")
                const cita= cursor.value
                btnEditar.onclick= () => cargarEdicion(cita)
                btnEditar.classList.add("btn",  "btn-info")

                btnEditar.innerHTML='Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>'

    
                //Agregar los párrafos a divCita
                divCita.appendChild(mascotaParrafo)
                divCita.appendChild(propietarioParrafo)
                divCita.appendChild(telefonoParrafo)
                divCita.appendChild(fechaParrafo)
                divCita.appendChild(horaParrafo)
                divCita.appendChild(sintomasParrafo)
                divCita.appendChild(btnEliminar)
                divCita.appendChild(btnEditar)
    
                //Agregar las citas al HTML
                contenedorCitas.appendChild(divCita)

                //Ve al siguiente elemento
                cursor.continue();
                
            }
        }


    }
    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)

        }
    }
}
const administrarCitas= new Citas()

const ui= new UI(administrarCitas)


window.onload=()=>{
    eventListeners()

    creadDB();

}

//eventListeners
function eventListeners(){
    mascotaInput.addEventListener("input", datosCita)
    propietarioInput.addEventListener("input", datosCita)
    telefonoInput.addEventListener("input", datosCita)
    fechaInput.addEventListener("input", datosCita)
    horaInput.addEventListener("input", datosCita)
    sintomasInput.addEventListener("input", datosCita)
    formulario.addEventListener("submit", nuevaCita)
}

//Objeto
const citaObj={
    mascota: "",
    propietario:"",
    telefono: "",
    fecha: "",
    sintomas: ""
    
}


//funciones
function datosCita(e){
    citaObj[e.target.name]=e.target.value;
    console.log(citaObj)    
}

//funcion nuevaCita(2) - valida y agrega la nueva cita
function nuevaCita(e){
    e.preventDefault();
    
    //Extrae la informción del objeto de cita
    const {mascota, propietario, telefono, fecha, hora, sintomas}= citaObj;
    //Validar
    if(mascota==="" || propietario==="" || telefono==="" || fecha==="" || hora==="" || sintomas==="") {
        ui.imprimirAlerta("Todos los campos son obligatorios", "error")
        return;
    }
    //Editando
    if(editando){
        
        //Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj})

        //Edita en indexedDB
        const transaction=DB.transaction(["citas"], "readwrite")
        const objectStore= transaction.objectStore("citas");
        objectStore.put(citaObj);

        transaction.oncomplete= () =>{
            ui.imprimirAlerta("Se ha editado exitosamente")

            //Regresar el texto de botón a su estado original
            formulario.querySelector('button[type="submit"]').textContent='Guardar cambios'
            
            //Quitando el modo edición
            editando=false;
    
            
        }

        transaction.onerror= () =>{
            console.log("Hubo un error")
        }

 

    }
    
    else{
        //Nuevo registro

        //Generar un id unico    
        citaObj.id= Date.now();

        //Creando una nueva cita
        administrarCitas.agregarCita({...citaObj})

        //Insertar registro en IndexedDB
        const transaction = DB.transaction(["citas"], "readwrite");

        //Habilitar el objectStore
        const objectStore= transaction.objectStore("citas")

        //Insertar en la base de datos
        objectStore.add(citaObj);

        transaction.oncomplete = () => { 

            console.log("cita agregada")
            //Mensaje de agregado bien
            ui.imprimirAlerta("Se agregó correctamente")
        }

   
    }

    //Mostrar el HTML de las citas
    ui.imprimirCitas()
    
    //Reiniciar objeto para la validación
    reiniciarObjeto()

    //Reinicando el formulario 
    formulario.reset()



}

//Reiniciando el objeto para que sea limpio e inicie todo de cero
function reiniciarObjeto(){
    citaObj.mascota=""
    citaObj.propietario=""
    citaObj.telefono=""
    citaObj.fecha=""
    citaObj.hora=""
    citaObj.sintomas=""
}

//Definir eliminar ciita
function eliminarCita(id){

    //Eliminar la cita 
    const transaction=  DB.transaction(["citas"], "readwrite")
    const objectStore= transaction.objectStore("citas")

    objectStore.delete(id)

    transaction.oncomplete= () =>{
        console.log(`Cita ${id} eliminada`)
        ui.imprimirCitas()
    }
    
    transaction.onerror= () =>{
        coonsole.log("Hubo errores")
    }


    
}

//Carga los datos y el modo edición
function cargarEdicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas,id}= cita;

    //Llenar los inputs
    mascotaInput.value =mascota
    propietarioInput.value =propietario
    telefonoInput.value =telefono
    fechaInput.value =fecha
    horaInput.value =hora
    sintomasInput.value =sintomas

    //Llenar el objeto

    citaObj.mascota=mascota
    citaObj.propietario=propietario
    citaObj.telefono=telefono
    citaObj.fecha=fecha
    citaObj.hora=hora
    citaObj.sintomas=sintomas
    citaObj.id=id

    //Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent='Guardar cambios'

    editando=true;


}

function creadDB(){
    //Crear la base de datos 1.0
    const creaDB= window.indexedDB.open("citas", 1)


    //Si hay un error
    creaDB.onerror = function(){
        console.log("Hubo un error")

    }
    //Si todo sale perfecto
    creaDB.onsuccess= function(){
        console.log("La base de datos fue creada")
        DB= creaDB.result;

        //Imprimir citas al cargar (Pero IndexedDB está listo)
        ui.imprimirCitas();
    }
    //Definir el esquema
    creaDB.onupgradeneeded= function(e){
        const db= e.target.result,

        objectStore = db.createObjectStore('citas', { keyPath: 'id',  autoIncrement: true } );

        

        //Definir todas las columnas
        objectStore.createIndex("mascota", "mascota", {unique: false});
        objectStore.createIndex("propietario", "propietario", {unique: false});
        objectStore.createIndex("telefono", "telefono", {unique: false});
        objectStore.createIndex("fecha", "fecha", {unique: false});
        objectStore.createIndex("hora", "hora", {unique: false});
        objectStore.createIndex("sintomas", "sintomas", {unique: false});
        objectStore.createIndex("id", "id", {unique: true});

        console.log("DB creada y lista")




    }

}
