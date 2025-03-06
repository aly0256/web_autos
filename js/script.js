bars = document.querySelector(".bars");
bars.onclick = function() {
    navBar = document.querySelector(".nav-bar");
    navBar.classList.toggle("active"); /*Dispara el evento de la clase active, que hace que el heigh sea de 450px, es decir, que se muestre*/
}


