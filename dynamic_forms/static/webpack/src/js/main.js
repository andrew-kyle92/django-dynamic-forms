// import the custom css
import "../scss/styles.scss"

// import bootstrap's js
import * as bootstrap from 'bootstrap'
// ***** End Import *****

// Fetch Requests
const getForm = async (field) => {
    let url = 'get-form/?' + new URLSearchParams({
        "field": field,
    });
    return await fetch(url, {
       method: 'get'
    }).then(async response => {
        return response.json()
    });
}

window.addEventListener("load", () => {
    // animate all dropdown carets
    const dropdownBtns = document.getElementsByClassName("dropdown-caret");
    for (let i = 0; i < dropdownBtns.length; i++) {
        dropdownBtns[i].addEventListener('click', () => {
            let dropdown = dropdownBtns[i]
            let caret = dropdown.querySelector('.fa-caret-up');
            let currentRotation = parseInt(caret.dataset.rotation);
            let rotation = currentRotation === 0 ? currentRotation + 180 : 0;
            caret.dataset.rotation = rotation.toString();
            caret.animate([{transform: `rotate(${rotation}deg)`}], {duration: 200, fill: "forwards"});
        });
    }
    // checking to see if any carets need to start in the expanded direction
    for (let i = 0; i < dropdownBtns.length; i++) {
        let dropdown = dropdownBtns[i]
        let caret = dropdown.querySelector('.fa-caret-up');
        let currentRotation = parseInt(caret.dataset.rotation);
        let newRotation = currentRotation === 0 ? currentRotation + 180 : 0;
        if (dropdown.ariaExpanded === 'true') {
            caret.dataset.rotation = newRotation.toString();
            caret.animate([{transform: `rotate(${newRotation}deg)`}], {duration: 200, fill: "forwards"});
        }
    }

    // form logic
    // for_table checkbox
    let tableCheckbox = document.getElementById("id_for_table");
    let tableInput = document.getElementById("id_table");
    // initially hiding the checkbox
    if (!tableCheckbox.checked) {
        tableInput.parentElement.setAttribute("hidden", "");
    }
    else {
        tableInput.parentElement.removeAttribute("hidden");
    }
    tableCheckbox.addEventListener("change", () => {
        if (!tableCheckbox.checked) {
            tableInput.parentElement.setAttribute("hidden", "");
        }
        else {
            tableInput.parentElement.removeAttribute("hidden");
        }
    });

    // form name input
    let formName = document.getElementById("id_name");
    let formHeader = document.getElementById("formHeaderText");
    formName.addEventListener("input", () => {
        formHeader.innerText = formName.value;
    });

    // ***** input drag and drop logic *****
    // ** Form div element **
    const formInputsDiv = document.getElementById("formInputsDiv");
    // dragover
    formInputsDiv.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        formInputsDiv.classList.add("drag-over");
    });

    // dragleave
    formInputsDiv.addEventListener("dragleave", () => {
        formInputsDiv.classList.remove("drag-over");
    });

    // ** Input Elements **
    let inputItems = document.getElementsByClassName("inputItem");
    for (let i = 0; i < inputItems.length; i++) {
        let inputItem = inputItems[i];

        inputItem.addEventListener("dragstart", (e) => {
            let fieldReference = document.getElementById(inputItem.dataset.fieldReference);
            let field = fieldReference.cloneNode(true);
            // e.dataTransfer.setDragImage(field, field.offsetWidth / 2, field.offsetHeight / 2);
            e.dataTransfer.setData("text/plain", "This works!");
        });
    }
})