// import the custom css
import "../scss/styles.scss";

// import bootstrap's js
import * as bootstrap from 'bootstrap';

// importing dragAndDrop.js and functions.js
import * as dragAndDrop from "./dragAndDrop.js";
import * as functions from "./functions";
import {addNewInput} from "./dragAndDrop.js";
// ***** End Import *****

// ########## Getting the csrf token for the fetch calls ##########
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
export const csrftoken = getCookie('csrftoken');

// ***** Fetch Requests *****
export const getForm = async (field, exists="False", inputId="None", modelForm=false, initial=false) => {
    let bodyData = {
        "field": field,
        "exists": exists,
        "inputId": inputId,
        "modelForm": modelForm,
        "initial": initial,
    }
    let url = '/forms/get-form/';
    return await fetch(url, {
        method: 'post',
        credentials: 'same-origin',
        headers: {
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(bodyData),
    }).then(async response => {
        return response.json();
    });
}

export const getModelForm = async (modelName) => {
    let url = "/forms/get-model-form/?" + new URLSearchParams({modelName: modelName});
    return await fetch(url, {
       method: 'get'
    }).then(async response => {
        return response.json();
    });
}

const getFormLayout = async (formId) => {
    let url = '/forms/get-form-layout/?' + new URLSearchParams({
       form_id:  formId,
    });

    return await fetch(url, {
        method: "get",
        credentials: "same-origin",
        headers: {
            "X-CSRFToken": csrftoken,
        }
    }).then(async response => {
        return response.json();
    })
}

const saveFormToServer = async (formEl, formData) => {
    let url = formEl.action;
    return await fetch(url, {
        method: "post",
        credentials: "same-origin",
        headers: {
            "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(formData)
    }).then(async (response) => {
        return response.json();
    });
}

// ***** script variables *****
let placeholder = null;
let formInputMO = null;
let currentDraggedInput = null;
let formInputs;
let removedFields = []; // ids of fields to be removed
// droppable sections
let droppableSections = ["formInputsDiv"]; // ids of droppable sections

// ***** script functions *****
export function getDroppableSections() {
    return droppableSections;
}

export function addDroppableSection(elId) {
    let ds = getDroppableSections();
    ds.push(elId);
}

function getRemovedFields() {
    return removedFields;
}

export function addRemoveField(field) {
    removedFields.push(field);
}

function addNewMessage(message) {
    // getting the domMessage div
    let domMessages = document.getElementById("domMessages");
    // creating the alert div
    let newMessageDiv = document.createElement("div");
    newMessageDiv.className = "alert alert-success alert-dismissible fade show";
    newMessageDiv.role = "alert";
    newMessageDiv.innerHTML = message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    // adding alert to domMessages
    domMessages.appendChild(newMessageDiv);
}

export function getPlaceholder() {
    if (!placeholder) {
        return null
    }
    return placeholder;
}

export function setPlaceholder(el) {
    placeholder = el;
}

export function setCurrentDraggedInput(el) {
    currentDraggedInput = el;
}

export function getCurrentDraggedInput() {
    return currentDraggedInput;
}

export function setFormInputMO(el) {
    formInputMO = el;
}

export function getFormInputMO() {
    return formInputMO;
}

// ***** End Script Functions *****
// ***** main logic *****
window.addEventListener("DOMContentLoaded", async () => {
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
    // creating the database table apply button. This button will add the inputs and remove the current form data
    let formElement = document.querySelector("#formSection form"); // getting the main form
    let applyBtn = document.createElement("button");
    applyBtn.innerText = "Apply";
    applyBtn.id = "tableApplyBtn";
    applyBtn.className = "btn btn-primary mb-2";
    applyBtn.type = "button";
    formElement.appendChild(applyBtn);

    // initially hiding the checkbox and applyBtn
    if (!tableCheckbox.checked) {
        tableInput.parentElement.setAttribute("hidden", "");
        applyBtn.setAttribute("hidden", "");
    }
    else {
        tableInput.parentElement.removeAttribute("hidden");
        applyBtn.setAttribute("hidden", "");
    }
    const forTableModal = new bootstrap.Modal("#forTableModal");
    tableCheckbox.addEventListener("change", () => {
        if (!tableCheckbox.checked) {
            tableInput.parentElement.setAttribute("hidden", "");
            applyBtn.setAttribute("hidden", "");
        }
        else {
            tableInput.parentElement.removeAttribute("hidden");
            applyBtn.removeAttribute("hidden");
        }
    });

    // applyBtn logic
    applyBtn.addEventListener("click", () => {
        let error = false;
        if (tableInput.value === "") {
            // add error
            let msg = "Input value must not be blank.";
            functions.addError(tableInput.parentElement, "form-error", msg);
            error = true;
        }

        if (!error) {
            // removing any errors if they exist
            functions.removeErrors(tableInput.parentElement, "form-error");
            // show the modal
            forTableModal.show();
        }
    });

    // ***** forTableModal *****
    let forTableCloseBtns = document.getElementsByClassName("cancel-btn");
    for (let i = 0; i < forTableCloseBtns.length; i++) {
        let btn = forTableCloseBtns[i];
        btn.addEventListener("click", () => {
            tableCheckbox.checked = false;
        });
    }

    let forTableProceedBtn = document.getElementById("forTableProceedBtn");
    forTableProceedBtn.addEventListener("click", async () => {
        // clearing the form section
        let formDiv = document.getElementById("formInputsDiv")
        functions.clearFormDiv(formDiv);
        // getting the selected table inputs
        let res = await getModelForm(tableInput.value);
        let formFields = JSON.parse(res.formFields);
        let formFieldKeys = Object.keys(formFields);
        // iterating through the form fields and creating the inputs
        for (let i = 0; i < formFieldKeys.length; i++) {
            let key = formFieldKeys[i];
            let field = formFields[key];
            field["inputType"] = await functions.getModelFieldType(field.type);
            // getting event target data
            let newField = await dragAndDrop.addNewInput(field, formInputsDiv, false, true);

            // adding all the attributes from the model data to the templated input

            // adding functionality to remove-input
            functions.setRemoveLogic(newField);
            // adding listener logic
            functions.addListenerLogic(newField);

            // adding dragstart logic if specific form section
            // realistically, no db will have this input type, but this is just in case.
            let sectionRow = document.getElementById(`${newField.id}_section-row`);
            if (sectionRow) {
                functions.setDropLogic(sectionRow);
            }
        }
        // hiding the modal
        forTableModal._hideModal();
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

    // setting listener logic
    functions.addListenerLogic(formInputsDiv);

    // setting drop logic
    functions.setDropLogic(formInputsDiv);

    // ***** Input Elements *****
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

    // ***** Save Form Button *****
    const saveBtn = document.getElementById("saveForm");
    saveBtn.addEventListener("click", async () => {
        let formItems = formInputsDiv.children;
        let mainForm = document.querySelector(".mainForm");
        let formId = !mainForm.id ? "id_" + crypto.randomUUID(): mainForm.id;
        let formData = {
            id: formId,
            formData: {},
            inputType: "main_form",
            removedFields: getRemovedFields(),
        }

        // gathering the form data

        let mainFormData = new FormData(mainForm);
        for (let [key, value] of mainFormData.entries()) {
            if (key !== "csrfmiddlewaretoken") {
                if (key === "for_table") {
                let forTableCheckbox = document.querySelector(".mainForm").querySelector("#id_for_table");
                value = forTableCheckbox.checked;
            }
                formData.formData[key] = value;
            }
        }

        let formObjects = {};
        for (let i = 0; i < formItems.length; i++) {
            let formItem = formItems[i];
            formObjects[i] = functions.gatherInputData(formItem);
        }
        formData.formObjects = formObjects;
        // adding formData as the form layout
        let res = await saveFormToServer(mainForm, formData);
        if (res.res === "success") {
            if (document.URL.includes("new-form")) {
                window.location = `/view-form/${res.form_id}/`;
            }
            else {
                let message = "Form updated"
                addNewMessage(message);
            }
        }
    });

    // ***** Table Checkbox *****
    let tableDropDown = document.getElementById("id_for_table");
    tableDropDown.addEventListener("change", () => {

    });

    // ***** Handling an existing form *****
    const mainForm = document.getElementsByClassName("mainForm")[0];
    if (mainForm.dataset.formExists === "true") {
        let formLayoutData = await getFormLayout(mainForm.id);
        let formLayout = JSON.parse(formLayoutData.layout);
        // adding inputs
        let formObjects = formLayout.formObjects;
        let objectKeys = Object.keys(formObjects);
        for (let i = 0; i < objectKeys.length; i++) {
            let object = formObjects[objectKeys[i]];
            // adding the field input/section
            let newField = await addNewInput(object, formInputsDiv, true, false);

            // adding the remove logic
            functions.setRemoveLogic(newField);

            // adding listener logic
            functions.addListenerLogic(newField);


            // adding dragstart logic if specific form section
            let sectionRow = document.getElementById(`${newField.id}_section-row`);
            if (sectionRow) {
                functions.addListenerLogic(sectionRow);
            }

            // adding children, if any
            for (let j = 0; j < object.children.length; j++) {
                // child
                let child = object.children[j];
                // adding the field input/section
                let nf = await addNewInput(child, sectionRow, true, false);

                // adding the remove logic
                functions.setRemoveLogic(nf);

                // adding listener logic
                functions.addListenerLogic(nf);
            }
        }
    }

    document.addEventListener('focusin', (e) => {
        if (e.target.closest(".tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
            e.stopImmediatePropagation();
        }
    });
});