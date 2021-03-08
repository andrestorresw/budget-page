//Variables
const formulario = document.getElementById('agregar-gasto');
const gasto = document.getElementById('gasto');
const cantidad = document.getElementById('cantidad');
const total = document.getElementById('total');
const resto = document.getElementById('restante');
const listado = document.querySelector('#gastos ul');

let presupuesto;


//Clases
class Presupuesto{
    constructor(presupuesto, gasto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    newGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        const {nombre, cantidad, id} = gasto;
        presupuesto.restante -= cantidad;
    }

    removeGasto(e){
        if(e.classList.contains('borrar-curso')){
            const info = e.getAttribute('data-id');
            const cantidad = Number(e.getAttribute('valor'));
            presupuesto.gastos = presupuesto.gastos.filter( element => element.id != info);
            presupuesto.restante += cantidad;
        }
    }
}

class UI{
    printPresupuesto(presupuesto){
        const span = document.createElement('span');
        span.textContent = presupuesto;
        total.appendChild(span);
    }
    printRestante(restante){
        const span = document.createElement('span');
        span.textContent = restante;
        resto.appendChild(span);
    }
    cleanRestante(){
        if(restante.firstChild){
            resto.removeChild(restante.firstChild);
        }
    }
    cleanError(){
        if(document.getElementById('msjError')){
            document.getElementById('msjError').remove();
        }
    }
    manageListado(gasto ,cantidad){

        presupuesto.gastos.forEach( e => {
            const {nombre, cantidad, id} = e
            const row = document.createElement('li');
            row.className = 'list-group-item d-flex justify-content-between aling-items-center';
            row.innerHTML = `
                <td>${nombre}</td>
                <td>$${cantidad}</td>
                <td> </td>
                <td><button href="#" valor="${cantidad}" class='borrar-curso' data-id="${id}"/> Borrar </td>
            `;
            listado.appendChild(row);
        })
    }
    cleanListado(){
        while(listado.firstChild){
            listado.removeChild(listado.firstChild);
        }
    }
    printMsj(mensaje, tipo){
        const div = document.createElement('div');
        div.textContent = mensaje;
        div.id ='msjError';

        if(tipo === 'error'){
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success');
        }
        document.querySelector('.primario').insertBefore(div, formulario);

        setTimeout(() => {
            div.remove();
        }, 2000);
    }
    resetForms(){
        if(gasto.value !== ''){
            gasto.value = ''
        }
        if(cantidad.value !==''){
            cantidad.value = ''
        }
    }
}

const ui = new UI();


//Funciones
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', askBudget);
    formulario.addEventListener('submit', calcularRestante);
    listado.addEventListener('click', removeGasto);
}

function removeGasto(e){
    e.preventDefault();
    const btn = e.target;
    presupuesto.removeGasto(btn);
    ui.cleanListado();
    ui.manageListado();
    ui.cleanRestante();
    ui.printRestante(presupuesto.restante);
}

function askBudget(){
    ui.resetForms();
    const budget = prompt('¿Cual es tu presupuesto?');
    const decimal = /^[-+]?[0-9]+\.[0-9]+$/;
    const numbers = /^[-+]?[0-9]+$/;
    if(budget === null || (!budget.match(numbers) && !budget.match(decimal))){
        window.location.reload();
    }
    
    presupuesto = new Presupuesto(budget);
    const {restante} = presupuesto;
    ui.printPresupuesto(presupuesto.presupuesto);
    ui.printRestante(restante);
}

function calcularRestante(e){
    const nombre = document.getElementById('gasto').value;
    const cantidad = document.getElementById('cantidad').value;

    e.preventDefault();
    ui.cleanError();
    if(nombre ==='' || cantidad ===''){
        ui.printMsj('Faltan valores', 'error');
        return;
    }

    if(cantidad > presupuesto.restante){
        ui.printMsj('Presupuesto agotado', 'error');
        return;
    }

    const decimal = /^[-+]?[0-9]+\.[0-9]+$/;
    const numbers = /^[-+]?[0-9]+$/;
    if(!cantidad.match(numbers) || cantidad < 0){
        ui.printMsj('Cantidad no valido', 'error');
        return;
    }
    

    const gasto = {
        nombre,
        cantidad,
        id: Date.now(),
    };
    
    
    presupuesto.newGasto(gasto);

    ui.printMsj('Agregado', 'Correcto')
    ui.cleanRestante();
    const {restante} = presupuesto;
    ui.printRestante(restante);
    ui.cleanListado();
    ui.manageListado();
    ui.resetForms();
}