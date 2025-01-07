// import the custom css
import "../scss/styles.scss"

// import bootstrap's js
import * as bootstrap from 'bootstrap'

// importing drag and drop functions
import { setPlaceHolderPosition, addNewInput } from "./dragAndDrop.js"
// ***** End Import *****

// ***** Fetch Requests *****
export const getForm = async (field) => {
    let url = '/get-form/?' + new URLSearchParams({
        "field": field,
    });
    return await fetch(url, {
       method: 'get'
    }).then(async response => {
        return response.json()
    });
}

// ***** script functions *****
// Get the element after which the placeholder should be inserted
function getDragAfterElement(container, y) {
    const draggableElements = [
        ...container.querySelectorAll(".input-wrapper:not(.input-placeholder)"),
    ];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ***** script variables *****
let placeholder = null;
let formInputMO = null;
let currentDraggedInput = null;
let formInputs = [];

// ***** main logic *****
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

    // ** dragover
    formInputsDiv.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        // ev.stopPropagation();

        // adding drag-over class to formInputsDiv
        formInputsDiv.classList.add("drag-over");

        // adding placeholder either before of after inputs
        if (!formInputsDiv.childElementCount > 0) {
            formInputsDiv.appendChild(placeholder);
        }
        else {
            if (formInputMO && placeholder) {
                setPlaceHolderPosition(formInputMO, placeholder, ev);
            }
            else if (formInputMO === null && placeholder) {
                formInputsDiv.appendChild(placeholder);
            }
        }

    });

    // ** dragleave
    formInputsDiv.addEventListener("dragleave", () => {
        formInputsDiv.classList.remove("drag-over");
        if (placeholder && formInputsDiv.contains(placeholder)) {
            formInputsDiv.removeChild(placeholder);
        }
    });

    // ** on drop
    formInputsDiv.addEventListener("drop", async (e) => {
        e.preventDefault();
        // removing  the border, if there is one
        if (e.target.classList.contains("drag-over")) {
            formInputsDiv.classList.remove("drag-over");
        }

        // getting the id from the dragged object
        let data = JSON.parse(e.dataTransfer.getData("text"));

        // determining if a new or existing input is being dropped
        if (data.existing) {
            let element = document.getElementById(data.id);

            // adding the element to the target div
            if (placeholder) {
                // formInputsDiv.appendChild(element);
                formInputsDiv.insertBefore(element, placeholder);
                formInputsDiv.removeChild(placeholder);
            }
        }
        else {
            let newField = await addNewInput(data, formInputsDiv, placeholder);

            // adding the dragover listener
            newField.addEventListener("dragover", (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                if (currentDraggedInput === null || newField.id !== currentDraggedInput.id) {
                    formInputMO = newField;
                }
            });

            // adding the dragstart logic
            newField.addEventListener("dragstart", (e) => {
                // copying the templated field html
                let data = {id: newField.id, existing: true};
                e.dataTransfer.setData("text", JSON.stringify(data));

                // creating the placeholder element
                placeholder = document.createElement("div");
                placeholder.classList.add("input-placeholder");

                currentDraggedInput = newField;
            });
        }
    });

    // ** Input Elements **
    // li elements from left pane
    let inputItems = document.getElementsByClassName("inputItem");
    for (let i = 0; i < inputItems.length; i++) {
        let inputItem = inputItems[i];

        inputItem.addEventListener("dragstart", (e) => {
            // copying the templated field html
            let fieldReference = document.getElementById(inputItem.dataset.fieldReference);
            let data = {id: fieldReference.id, existing: false}
            e.dataTransfer.setData("text", JSON.stringify(data));

            // creating the placeholder element
            placeholder = document.createElement("div");
            placeholder.classList.add("input-placeholder");
        });
    }
});