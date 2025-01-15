// import the custom css
import "../scss/styles.scss";

// import bootstrap's js
import * as bootstrap from 'bootstrap';

// importing dragAndDrop.js and functions.js
import * as dragAndDrop from "./dragAndDrop.js";
import * as functions from "./functions";
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
    // droppable sections
    let droppableSections = ["form_row", "section_header", "collapsible_section", "column"];

    // ** dragover
    formInputsDiv.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        // adding dragover logic
        const currentTarget = ev.currentTarget || formInputsDiv;
        dragAndDrop.setDragOver(currentTarget, placeholder, formInputMO, ev);
    });

    // ** dragleave
    formInputsDiv.addEventListener("dragleave", (e) => {
        // setting drag leave logic
        dragAndDrop.setDragLeave(formInputsDiv, placeholder);
    });

    // ** on drop
    formInputsDiv.addEventListener("drop", async (e) => {
        e.preventDefault();
        // **  setting propagation
        e.stopPropagation();

        // removing the border, if there is one
        functions.removeClass(formInputsDiv, "drag-over");

        // getting the id from the dragged object
        let data = JSON.parse(e.dataTransfer.getData("text"));

        // determining if a new or existing input is being dropped
        if (data.existing) {
            let element = document.getElementById(data.id);
            // adding the element to the target div
            dragAndDrop.setExistingDrop(element, placeholder, formInputsDiv);
        }
        else {
            // getting event target data
            let newField = await dragAndDrop.addNewInput(data, formInputsDiv, placeholder);
            let formType = newField.dataset.formType;

            // adding the dragover listener
            newField.addEventListener("dragover", (ev) => {
                // **  setting propagation
                ev.stopPropagation();
                // reassigning formInputMO
                formInputMO = dragAndDrop.setInputDragOver(ev, formInputMO, currentDraggedInput, newField);
            });

            // adding the dragstart logic
            newField.addEventListener("dragstart", (ev) => {
                let data = dragAndDrop.setInputDragStart(e, newField, placeholder);
                ev.dataTransfer.setData("text", JSON.stringify(data));
                // setting currentDraggedInput
                currentDraggedInput = newField;
            });

            // adding dragstart logic if specific form section
            let sectionRow = document.getElementById(`${newField.id}_section-row`);
            if (droppableSections.includes(formType) && sectionRow) {
                // settings section row dragover
                sectionRow.addEventListener("dragover", (ev) => {
                    // to prevent dropping into self
                    if (currentDraggedInput !== newField) {
                        ev.preventDefault();
                        // **  setting propagation
                        ev.stopPropagation();

                        dragAndDrop.setDragOver(sectionRow, placeholder, formInputMO, ev);
                    }
                });

                // setting section row dragleave
                sectionRow.addEventListener("dragleave", () => {
                    dragAndDrop.setDragLeave(sectionRow, placeholder);
                });

                sectionRow.addEventListener("drop", async (e) => {
                    e.preventDefault();
                    // **  setting propagation
                    e.stopPropagation();

                    // removing  the border, if there is one
                    if (e.target.classList.contains("drag-over")) {
                        sectionRow.classList.remove("drag-over");
                    }

                    // getting the id from the dragged object
                    let d = JSON.parse(e.dataTransfer.getData("text"));

                    // determining if a new or existing input is being dropped
                    if (d.existing) {
                        let element = document.getElementById(d.id);
                        // adding the element to the target div
                        dragAndDrop.setExistingDrop(element, placeholder, sectionRow);
                    }
                    else {
                        // new field within form row
                        let nf = await dragAndDrop.addNewInput(d, sectionRow, placeholder);

                        // adding the dragover listener
                        nf.addEventListener("dragover", (ev) => {
                            // **  setting propagation
                            ev.stopPropagation();

                            formInputMO = dragAndDrop.setInputDragOver(ev, formInputMO, currentDraggedInput, nf);
                        });

                        // adding the dragstart logic
                        nf.addEventListener("dragstart", (e) => {
                            e.stopPropagation();
                            let data = dragAndDrop.setInputDragStart(e, nf, placeholder);
                            e.dataTransfer.setData("text", JSON.stringify(data));
                            // setting currentDraggedInput
                            currentDraggedInput = nf;
                        });
                    }
                });
            }
        }
    });

    // ** Input Elements **
    // li elements from left pane
    let inputItems = document.getElementsByClassName("inputItem");
    for (let i = 0; i < inputItems.length; i++) {
        let inputItem = inputItems[i];

        inputItem.addEventListener("dragstart", (e) => {
            // copying the templated field html if the targetType is an li
            if (e.target.tagName === "LI") {
                let fieldReference = document.getElementById(inputItem.dataset.fieldReference);
                let data = {id: fieldReference.id, existing: false}
                e.dataTransfer.setData("text", JSON.stringify(data));

                // creating the placeholder element
                placeholder = document.createElement("div");
                placeholder.classList.add("input-placeholder");

                // setting currentDraggedInput
                currentDraggedInput = inputItem;
            }
        });
    }
});