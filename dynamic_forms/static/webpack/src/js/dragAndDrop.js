// ***** All functions related to drag and drop *****

// ** imports **
import { getForm } from './main'

export function setPlaceHolderPosition(formMO, placeholder, event) {
    let targetMOPositions = formMO.getBoundingClientRect()
    let positions = {
        top: Math.abs(event.clientY - targetMOPositions.top),
        right: Math.abs(event.clientX - targetMOPositions.right),
        bottom: Math.abs(event.clientY - targetMOPositions.bottom),
        left: Math.abs(event.clientX - targetMOPositions.left),
    }

    // finding the smalled number
    let closest = {position: "", distance: Infinity};
    for (let key in positions) {
        if (positions[key] < closest.distance) {
            closest.distance = positions[key];
            closest.position = key;
        }
    }

    if (closest.position === "top" || closest.position === "bottom") {
        switch (closest.position) {
            case "top":
                formMO.insertAdjacentElement("beforebegin", placeholder);
                break;
            case "bottom":
                formMO.insertAdjacentElement("afterend", placeholder);
                break;
        }
    }
}

export const addNewInput = async (data, formDiv, placeholder, formMO, currentDraggedInput) => {
    // cloning the element and adding all the specific settings
    let newField = document.getElementById(data.id).cloneNode(true);
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
    if (placeholder) {
        formDiv.appendChild(newField);
        formDiv.insertBefore(newField, placeholder);
        formDiv.removeChild(placeholder);
    }

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
                    } else {
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
    return newField;
}