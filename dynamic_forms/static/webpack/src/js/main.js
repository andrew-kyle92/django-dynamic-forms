// import the custom css
import "../scss/styles.scss"

// import bootstrap's js
import * as bootstrap from 'bootstrap'
// ***** End Import *****

// ***** Fetch Requests *****
const getForm = async (field) => {
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
    formInputsDiv.addEventListener("dragenter", (ev) => {
        ev.preventDefault();
        // create the placeholder div
        let placeHolder = document.createElement("div");
        placeHolder.classList.add("placeholder");
        formInputsDiv.appendChild(placeHolder);
    });

    // dragleave
    formInputsDiv.addEventListener("dragleave", () => {
        formInputsDiv.classList.remove("drag-over");
    });

    // on drop
    formInputsDiv.addEventListener("drop", async (e) => {
        e.preventDefault();
        // removing  the border, if there is one
        if (e.target.classList.contains("drag-over")) {
            formInputsDiv.classList.remove("drag-over");
        }

        // getting the id from the dragged object
        let data = e.dataTransfer.getData("text");

        // adding the form row div
        let formRow = document.getElementsByClassName("form-row-template")[0];
        formRow.className = "form-row";
        formRow.removeAttribute("hidden");
        e.target.appendChild(formRow);

        // cloning the element and adding all the specific settings
        let newField = document.getElementById(data).cloneNode(true);
        newField.id = "id_" + crypto.randomUUID();
        newField.removeAttribute("hidden");
        let inputModal = newField.querySelector(".input-modal");
        inputModal.id = newField.id + "_modal";
        inputModal.setAttribute("aria-labelledby", newField.id + "_modalLabel");
        inputModal.querySelector(".modal-title").id = newField.id + "_modalLabel";

        // adding the target id to the settings button
        let settingsBtn = newField.querySelector(".input-settings button");
        settingsBtn.dataset.bsTarget = "#" + newField.id + "_modal";

        // adding the form to the settings modal
        let formType = newField.dataset.formType;
        let modalBody = inputModal.querySelector(".modal-body");
        let res = await getForm(formType);
        let formData = JSON.parse(res.form);
        let formKeys = Object.keys(formData);
        let formInputs = [];
        // creating the form fields
        for (let i = 0; i < formKeys.length; i++) {
            let formField = formData[formKeys[i]];
            // getting the id from the input
            let inputId = formField.input.match(/(?<=id\W+)\w+(?=\W)/g)[0];
            formInputs.push(`#${newField.id} #${inputId}`);
            // creating the form group div
            let formGroup = document.createElement("div");
            formGroup.setAttribute("class", "form-group mb-3");
            modalBody.appendChild(formGroup);
            // adding all the elements as innerHtml
            formGroup.innerHTML = `
                <label for="${formKeys[i]}" class="form-labal">${formField.label}</label>
                ${formField.input}
            `;
            if (formField.helpText.length > 0) {
                formGroup.innerHTML += `<div class="form-text">${formField.helpText}</div>`;
            }
        }
        // hiding the input and order fields
        modalBody.querySelector("#id_order").parentElement.setAttribute("hidden", "");
        modalBody.querySelector("#id_input").parentElement.setAttribute("hidden", "");

        // adding the element to the target div
        formRow.appendChild(newField);

        // adding a listener to the save changes button
        let saveBtn = document.getElementById("saveBtn");
        let inputEl = newField.querySelector(`fieldset .form-group`);
        saveBtn.addEventListener("click", () => {
            let inputLabel = inputEl.querySelector(".label");
            let inputInput = inputEl.querySelector(".input");
            let inputHelpText = inputEl.querySelector(".help-text");
            // applying all the settings
            formInputs.forEach((input) => {
                let field = document.querySelector(input);
                switch (field.id) {
                    case "id_label":
                        if (field.value.length > 0) {
                            inputLabel.innerText = field.value;
                        }
                        break;
                    case "id_placeholder":
                        if (field.value.length > 0) {
                            inputInput.placeholder = field.value;
                        }
                        break;
                    case "id_help_text":
                        if (field.value.length > 0) {
                            inputHelpText.innerText = field.value;
                        }
                        break;
                    case "id_floating_label":
                        if (field.checked) {
                            inputEl.classList.add("form-floating");
                            inputEl.querySelector(".input").insertAdjacentElement("afterend", inputLabel);
                        }
                        else {
                            if (inputEl.className.includes("form-floating")) {
                                inputEl.classList.remove("form-floating");
                                inputEl.querySelector(".input").insertAdjacentElement("beforebegin", inputLabel);
                            }
                        }
                        break;
                }
            });
            inputModal.querySelector(".btn-close").click();
        });
    });

    // ** Input Elements **
    let inputItems = document.getElementsByClassName("inputItem");
    for (let i = 0; i < inputItems.length; i++) {
        let inputItem = inputItems[i];

        inputItem.addEventListener("dragstart", (e) => {
            // copying the templated field html
            let fieldReference = document.getElementById(inputItem.dataset.fieldReference);
            e.dataTransfer.setData("text", `${fieldReference.id}`);
        });
    }
})