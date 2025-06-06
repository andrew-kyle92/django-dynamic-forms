// ***** All functions related to drag and drop *****

// ** imports **
// import {getDroppableSections, getForm} from './main'
import * as main from './main'
import * as functions from "./functions";
import {initializeTinyMCE} from "./init_tinymce.js"
import {initializeEditor} from "./functions";

export function setPlaceHolderPosition(formMO, placeholder, event) {
    let targetMOPositions = formMO.getBoundingClientRect();
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
    switch (closest.position) {
        case "left":
        case "top":
            formMO.insertAdjacentElement("beforebegin", placeholder);
            break;
        case "right":
        case "bottom":
            formMO.insertAdjacentElement("afterend", placeholder);
            break;
    }
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
        else {
            let grandParent = parent.parentElement;
            if (grandParent.id === "formInputsDiv") {
                level = 3;
            }
            let greatGrandParent = grandParent.id.includes("section-row") ? grandParent.parentElement.parentElement : grandParent.parentElement;
            if (grandParent.id === "formInputsDiv") {
                level = 4;
            }
        }
    }
    return level
}

/*
addNewInput function
arguments: data, formDiv, exists, modelField
data: <object> if modelField is false, data = {id:<str>(field_type), existing: false}
      if modelField is true, data = {
                                "label": <str> (label),
                                "input": <str> (html field input),
                                "helpText": <str> (help_text),
                                "data": {
                                    "name": <str>(field_name),
                                    "is_hidden": <boolean>,
                                    "required": <boolean>,
                                    "value": <str or null>,
                                    "attrs": {<object key/value pair of modelForm attrs>},
                                    "template_name": <str>(path to Django widget template),
                                    "type": <str>(input_type)
                                }
                            }
exists: <boolean> if field exists in the database or not already
modelForm: <boolean> if the field belongs to a Django ModelForm type
 */
export const addNewInput = async (data, formDiv, exists=false, modelField=false) => {
    // cloning the element and adding all the specific settings
    let newField = functions.setNewField(data, exists, modelField);

    // adding id string to modal
    let inputModal = functions.setInputModal(newField);

    // determining if the dragged object is a form section
    let isFormSection = newField.dataset.formSection === "true";
    // setting the form for id
    let formRow = newField.querySelector("#section-row");
    if (formRow) {
        formRow.setAttribute("id", newField.id + "_section-row");
        // adding form row id to droppable sections
        main.addDroppableSection(formRow.id);
    }

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

    // adding the form to the settings modal
    let modalBody = inputModal.querySelector(".modal-body");
    // let strExists = exists ? "True": "False" // For python's interpretation of boolean
    let res;
    if (modelField){
        // add initial values
        res = await main.getForm(formType, exists, newField.id, false, functions.getInitials(data));
    }
    else {
        res = await main.getForm(formType, exists, newField.id);
    }
    let formData = JSON.parse(res.form);
    let formKeys = Object.keys(formData);
    // creating and getting the form fields
    let formInputs = functions.createFormFields(formKeys, formData, modalBody, newField);
    // setting formField ids
    formInputs = functions.setFormInputIds(newField, formInputs);

    // hiding the input and order fields
    let hiddenFields = [`#${newField.id}_id_order`, `#${newField.id}_id_input`, `#${newField.id}_id_form_id`,
                                `#${newField.id}_id_input_id`, `#${newField.id}_id_form`, `#${newField.id}_id_parent_section_id`,
                                `#${newField.id}_id_created`, `#${newField.id}_id_modified`];
    for (let i = 0; i < formInputs.length; i++) {
        if (hiddenFields.includes(formInputs[i])) {
            let input = modalBody.querySelector(formInputs[i]);
            input.parentElement.setAttribute("hidden", "true");
        }
    }

    // adding modelField data to settings
    if (modelField) {
        functions.addModelFieldData(newField, formInputs, data)
    }

    // adding the element to the target div
    let placeholder = main.getPlaceholder();
    let placeholderInDiv = false;
    for (let i = 0; i < formDiv.childElementCount; i++) {
        if (formDiv.children[i].className.includes("input-placeholder")) {
            placeholderInDiv = true;
            break;
        }
    }

    if (placeholder && placeholderInDiv) {
        formDiv.insertBefore(newField, placeholder);
        formDiv.removeChild(placeholder);
    }
    else if (!placeholder || !!placeholder) {
        formDiv.appendChild(newField);
    }

    // adding listeners to indicate that an inputs value has been changed
    formInputs.forEach(query => {
       let input = document.querySelector(query);
       let isHidden = !!input.parentElement.getAttribute("hidden");
       // if the inputs are hidden, don't add the listeners to them
       if (!isHidden) {
           // setting data-current-value
           // on input, after .25 second, if the value is different from the current value, flag the change
           functions.setValueChanged(input);
           // if exists set value changed to true
           if (exists) {
               if (input.value.length > 0) {
                    input.dataset.valueChanged = "true";
                    input.dataset.currentValue = input.value;
               }
           }
       }
    });

    // adding a listener to the save changes button
    let saveBtn = newField.querySelector("#saveBtn");
    // changing the id as not to conflict with other inputs
    saveBtn.id = newField.id + "_saveBtn";
    let formGroupClass = isFormSection ? ".form-row" : ".form-group";
    let inputEl = newField.querySelector(`fieldset ${formGroupClass}`);
    saveBtn.addEventListener("click", () => {
        // check for form errors
        // let formValid = functions.checkForm();
        // applying all the settings
        functions.applySettings(formInputs, inputEl, newField, isFormSection);
        inputModal.querySelector(".btn-close").click();
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });

    // if the field is a text_block, initialize the editor
    if (newField.dataset.formType === "text_block") {
        await initializeEditor(`#${newField.id} .tinymce`);
    }

    // if exists apply the settings button to add the existing model data
    if (exists) {
        // saveBtn.click();
        functions.applySettings(formInputs, inputEl, newField, isFormSection, true);
    }

    return newField;
}

export function setDragOver(targetDiv, e) {
    // getting targeted mouse over element
    // let formInputMO = functions.getMouseOver(targetDiv);

    // getting the placeholder
    let placeholder = main.getPlaceholder();

    // setting default target if currentTarget is null
    let container = functions.getDroppableSection(targetDiv);

    // adding drag-over class to formInputsDiv
    container.classList.add("drag-over");

    // adding placeholder either before of after inputs
    if (!container.childElementCount > 0) {
        // if no children within droppable container, just append the placeholder
        container.appendChild(placeholder);
    }
    else {
        // form input moused-over
        let formInputMO = main.getFormInputMO();
        // if formInputMO is not null, check if it lives in the container
        if (formInputMO) {
            let childInContainer = functions.containerContainsChild(container, formInputMO);
            if (!childInContainer) {
                // if child not in container, set formInputMO to null, else leave it
                formInputMO = null;
            }
        }
        // if there are children
        if (container.childElementCount === 1 && container.firstElementChild.className.includes("input-placeholder")) {
            // append the placeholder
            container.appendChild(placeholder);
        }
        else if (formInputMO) {
            // if form input mouse over is not null determine where to place the placeholder
            // in relevance to the mouse over target
            setPlaceHolderPosition(formInputMO, placeholder, e);
        }
        else if (formInputMO === null && placeholder) {
            // if mouse over target is null, place the placeholder after all the children
            container.appendChild(placeholder);
        }
    }
}

export function setDragLeave(targetDiv, placeholder) {
    // remove class from targe div
    functions.removeClass(targetDiv, "drag-over");
    if (placeholder && targetDiv.contains(placeholder)) {
        targetDiv.removeChild(placeholder);
    }
}

export function setExistingDrop(el, targetDiv) {
    // adding the element to the target div
    let placeholder = main.getPlaceholder();
    if (placeholder) {
        targetDiv.insertBefore(el, placeholder);
        targetDiv.removeChild(placeholder);
    }
}

export function setInputDragOver(e, formInputMO, currentDraggedInput, newField) {
    if (currentDraggedInput === null || newField.id !== currentDraggedInput.id) {
        return newField;
    }
    return null
}

export function setInputDragStart(e, newField, placeholder) {
    // copying the templated field html
    let data = {id: newField.id, existing: true};

    // creating the placeholder element
    placeholder = document.createElement("div");
    placeholder.classList.add("input-placeholder");

    // setting the placeholder, globally
    main.setPlaceholder(placeholder);

    return data
}