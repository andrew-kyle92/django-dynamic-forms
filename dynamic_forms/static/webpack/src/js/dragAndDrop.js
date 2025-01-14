// ***** All functions related to drag and drop *****

// ** imports **
import { getForm } from './main'
import * as functions from "./functions";

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

    // if (closest.position === "top" || closest.position === "bottom") {
    switch (closest.position) {
        case "top" || "lef":
            formMO.insertAdjacentElement("beforebegin", placeholder);
            break;
        case "bottom" || "right":
            formMO.insertAdjacentElement("afterend", placeholder);
            break;
    }
    // }
}

export function setDepth(targetDiv) {
    let level = 1
    if (targetDiv.id === "formInputsDiv") {
        level = 1;
    }
    else if (targetDiv.id.includes("id_") && !targetDiv.id.includes("section-row")) {
        let parent = targetDiv.parentElement;
        if (parent.id === "formInputsDiv") {
            level = 2;
        }
    }
    else if (targetDiv.id.includes("section-row")) {
        let parent = targetDiv.parentElement.parentElement;
        if (parent.id === "formInputsDiv") {
            level = 2;
        }
        else if (parent.id.includes("section-row")) {
            let grandParent = parent.parentElement.parentElement;
            if (grandParent.id === "section-row") {
                level = 3;
            }
        }
    }
    return level
}

export function setDrop(targetDiv, event) {
    // removing the class 'drag-over'
    functions.removeClass(targetDiv, "drag-over");

    // add dragover listener
}

export const addNewInput = async (data, formDiv, placeholder) => {
    // cloning the element and adding all the specific settings
    let newField = functions.setNewField(data);

    // adding id string to modal
    let inputModal = functions.setInputModal(newField);

    // determining if the dragged object is a form section
    let isFormSection = newField.dataset.formSection === "true";

    // checking if input type is radio or checkbox
    let formType = newField.dataset.formType;
    if (formType === "radio_input" || formType === "checkbox_input") {
        let choicesDiv = newField.querySelector("#choices");
        if (choicesDiv) {
            choicesDiv.id = newField.id + "_" + choicesDiv.id;
        }
    }

    // adding the target id to the settings button
    functions.setSettingsLogic(newField, inputModal);

    // adding functionality to remove-input
    functions.setRemoveLogic(newField, formDiv);

    // adding the form to the settings modal
    let modalBody = inputModal.querySelector(".modal-body");
    let res = await getForm(formType);
    let formData = JSON.parse(res.form);
    let formKeys = Object.keys(formData);
    // creating and getting the form fields
    let formInputs = functions.createFormFields(formKeys, formData, modalBody, newField);

    // hiding the input and order fields
    modalBody.querySelector("#id_order").parentElement.setAttribute("hidden", "true");
    if (newField.dataset.formSection === "false") {
        modalBody.querySelector("#id_input").parentElement.setAttribute("hidden", "true");
    }

    // adding the element to the target div
    if (placeholder) {
        formDiv.appendChild(newField);
        formDiv.insertBefore(newField, placeholder);
        formDiv.removeChild(placeholder);
    }

    // adding listeners to indicate that an inputs value has been changed
    formInputs.forEach(query => {
       let input = document.querySelector(query);
       let isHidden = !!input.parentElement.getAttribute("hidden");
       // if the inputs are hidden, don't add the listeners to them
       if (!isHidden) {
           // setting data-current-value
           // on input, after 1 second, if the value is different from the current value, flag the change
           functions.setValueChanged(input);
       }
    });

    // adding a listener to the save changes button
    let saveBtn = newField.querySelector("#saveBtn");
    // changing the id as not to conflict with other inputs
    saveBtn.id = newField.id + "_saveBtn";
    let formGroupClass = isFormSection ? "#section-row" : ".form-group";
    let inputEl = newField.querySelector(`fieldset ${formGroupClass}`);
    saveBtn.addEventListener("click", () => {
        // form label
        let inputLabel = !isFormSection ? inputEl.querySelector(".label") : null;
        // form input if not radio or checkbox type
        let inputInput = !isFormSection ? inputEl.querySelector(".input") : null;
        // form section row
        // if radio or checkbox type
        let inputChoices = !isFormSection ? inputEl.querySelector(`#${newField.id}_choices`) : null;
        // form help_text
        let inputHelpText = !isFormSection ? inputEl.querySelector(".help-text") : null;
        // applying all the settings
        functions.applySettings(formInputs, inputLabel, inputInput, inputHelpText, inputChoices, inputEl, newField, isFormSection);
        inputModal.querySelector(".btn-close").click();
    });

    return newField;
}

export function setDragOver(targetDiv, placeholder, formInputMO, e) {
    // determining if formSection
    let isFormSection = targetDiv.dataset.formSection === "true";
    // setting default target if currentTarget is null
    let container = targetDiv || e.target;
    if (isFormSection) {
        let sectionRow = targetDiv.querySelector("#section-row");
        if (sectionRow) {
            container = sectionRow;
        }
        else {
            container = targetDiv || e.target;
        }
    }

    // adding drag-over class to formInputsDiv
    container.classList.add("drag-over");

    // adding placeholder either before of after inputs
    if (!container.childElementCount > 0) {
        // if no children within droppable container, just append the placeholder
        container.appendChild(placeholder);
    }
    else {
        // if there are children
        if (formInputMO && placeholder) {
            // if form input mouse over is not null determine where to place the placeholder
            // in relevance to the mouse over target
            let isFormInputMOFormSection = formInputMO.dataset.formSection === "true";
            if (isFormInputMOFormSection) {
                // making sure it's not a section-row
                let isSectionRow = formInputMO.id.includes("section-row");
                if (!isSectionRow) {
                    setPlaceHolderPosition(formInputMO, placeholder, e);
                }
                else {
                    if (!formInputMO.childElementCount > 0) {
                        formInputMO.appendChild(placeholder);
                    }
                }
            }
        }
        else if (formInputMO === null && placeholder) {
            // if mouse over target is null, place the placeholder after all the children
            container.appendChild(placeholder);
        }
    }
}

export function setDragLeave(targetDiv, placeholder) {
    let isFormSection = targetDiv.dataset.formSection === "true";
    // remove class from targe div
    functions.removeClass(targetDiv, "drag-over");
    if (placeholder && targetDiv.contains(placeholder)) {
        targetDiv.removeChild(placeholder);
    }
    else if (isFormSection) {
        // re-assign targetDiv
        targetDiv = targetDiv.querySelector("#section-row");
        // attempt to remove class from new target
        functions.removeClass(targetDiv, "drag-over");
        // attempt to remove placeholder
        if (placeholder && targetDiv.contains.placeholder) {
            targetDiv.removeChild(placeholder);
        }
    }
}

export function setExistingDrop(el, placeholder, targetDiv) {
    // adding the element to the target div
    if (placeholder) {
        targetDiv.insertBefore(el, placeholder);
        targetDiv.removeChild(placeholder);
    }
}

export function setInputDragOver(e, formInputMO, currentDraggedInput, newField) {
    let isFormSection = newField.dataset.formSection === "true";
    let targetMO = newField;
    if (isFormSection) {
        // if isFormSection, set the section-row div as the target mouse over
        // targetMO = document.querySelector("#section-row");
        return targetMO;
    }
    if (currentDraggedInput === null || newField.id !== currentDraggedInput.id) {
        return targetMO;
    }
    return null
}

export function setInputDragStart(e, newField, placeholder) {
    // copying the templated field html
    let data = {id: newField.id, existing: true};

    // creating the placeholder element
    placeholder = document.createElement("div");
    placeholder.classList.add("input-placeholder");

    return data
}