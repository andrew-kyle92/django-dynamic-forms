// ***** All methods and functions for dynamic_forms *****
import * as dragAndDrop from './dragAndDrop';
import * as main from "./main";

export function getChoicesToBeRemove(currentChoices=[], newChoices=[]) {
    if (currentChoices.length > 0) {
        let choicesToBeRemoved = []
        currentChoices.forEach((choice) => {
            if (!newChoices.includes(choice)) {
                choicesToBeRemoved.push(choice);
            }
        });
        return choicesToBeRemoved;
    }
}

export function getChoicesToBeAdded(newChoices=[], currentChoices=[]) {
    if (newChoices.length > 0) {
        let choicesToBeAdded = []
        newChoices.forEach((choice) => {
            if (!currentChoices.includes(choice)) {
                choicesToBeAdded.push(choice);
            }
        });
        return choicesToBeAdded;
    }
}

export function getNewChoice(isDropDown, formType=null, choice, inputId=null) {
    if (isDropDown) {
        let newChoice = document.createElement("option");
        let value = choice[0];
        let label = choice[1];
        newChoice.setAttribute("value", value);
        newChoice.innerText = label;
        return newChoice;
    }
    else {
        // creating a new form group div
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "choices-form-group form-check");
        // creating the input
        let newInput = document.createElement("input");
        newInput.setAttribute("class", "form-check-input");
        newInput.setAttribute("name", inputId + "_choice");
        newInput.type = formType === "radio_input" ? "radio": "checkbox";
        newInput.value = choice[0];
        newDiv.appendChild(newInput);
        // creating the label
        let newLabel = document.createElement("label");
        newLabel.setAttribute("class", "form-check-label");
        newLabel.setAttribute("for", inputId + "_choice")
        newLabel.innerText = choice[1];
        newDiv.appendChild(newLabel);
        return newDiv;
    }
}

export function removeClass(el, className) {
    if (el.classList.contains(className)) {
        el.classList.remove(className);
    }
}

function replaceTemplateInput(inputClass, newData) {

}

export function setNewField(data, exists=false) {
    let formType = exists ? data.inputType : data.id;
    let newField = document.getElementById(formType).cloneNode(true);
    newField.id = exists ? data.id : "id_" + crypto.randomUUID();
    newField.removeAttribute("hidden");
    return newField;
}

export function setInputModal(newField) {
    let inputModal = newField.querySelector(".input-modal");
    inputModal.id = newField.id + "_modal";
    inputModal.setAttribute("aria-labelledby", newField.id + "_modalLabel");
    inputModal.querySelector(".modal-title").id = newField.id + "_modalLabel";
    return inputModal;
}

export function setSettingsLogic(newField, inputModal) {
    let settingsBtn = newField.querySelector(".input-settings button");
    let settingsCloseBtnFooter = inputModal.querySelector(".modal-footer .btn-secondary");
    let settingsCloseBtnHeader = inputModal.querySelector(".modal-header .btn-close");
    let closeBtns = [settingsCloseBtnHeader, settingsCloseBtnFooter];
    settingsBtn.dataset.bsTarget = "#" + newField.id + "_modal";
    // making the field non-draggable
    settingsBtn.addEventListener("click", () => {
        if (settingsBtn.dataset.modalOpen === "false") {
            newField.draggable = false;
            newField.classList.remove("draggable");
            settingsBtn.dataset.modalOpen = "true";

            // if this input is nested within a form section
            // make that droppable section's parent not draggable
            let parentDropZone = getDroppableSection(newField);
            if (parentDropZone.id !== "formInputsDiv") {
                let parent = parentDropZone.parentElement.parentElement; // should be section_row input, which lives 2 children deep from input div
                parent.draggable = false;
                parent.classList.remove("draggable");
            }
        }
    });
    // making the field draggable
    closeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (settingsBtn.dataset.modalOpen === "true") {
                newField.draggable = true;
                newField.classList.add("draggable");
                settingsBtn.dataset.modalOpen = "false";

                // if this input is nested within a form section
                // make that droppable section's parent not draggable
                let parentDropZone = getDroppableSection(newField);
                if (parentDropZone.id !== "formInputsDiv") {
                    let parent = parentDropZone.parentElement.parentElement; // should be section_row input, which lives 2 children deep from input div
                    parent.draggable = true;
                    parent.classList.add("draggable");
                }
            }
        });
    });
}

export function setRemoveLogic(newField) {
    let removeBtn = newField.querySelector(".remove-input button");
    removeBtn.dataset.parentId = `#${newField.id}`;
    removeBtn.addEventListener("click", () => {
        let droppableSections = main.getDroppableSections();
        let section = getDroppableSection(newField, droppableSections);
        // removing the section-row's ID from droppableSections
        if (newField.dataset.formSection === "true") {
            let sectionRow = document.getElementById(`${newField.id}_section-row`);
            if (sectionRow) {
                let sectionIndex = droppableSections.indexOf(sectionRow.id);
                droppableSections.splice(sectionIndex);
            }
        }
        // adding the field id to removedFields
        let removeData = {id: newField.id, inputType: newField.dataset.formType};
        main.addRemoveField(removeData);
        // removing the field from the section
        section.removeChild(newField);
    });
}

export function createFormFields(formKeys, formData, modalBody, newField) {
    let formInputs = [];
    let formDiv = document.createElement("form");
    formDiv.id = newField.id + "_form";
    modalBody.appendChild(formDiv);
    for (let i = 0; i < formKeys.length; i++) {
        let formField = formData[formKeys[i]];
        // getting the id from the input
        let inputId = formKeys[i];
        formInputs.push(`#${newField.id} #id_${inputId}`);
        // creating the form group div
        let formGroup = document.createElement("div");
        formGroup.setAttribute("class", "form-group mb-3");
        formDiv.appendChild(formGroup);
        // adding all the elements as innerHtml
        formGroup.innerHTML = `
        <label for="${formKeys[i]}" class="form-label">${formField.label}</label>
        ${formField.input}
        `;
        if (formField.helpText.length > 0) {
            formGroup.innerHTML += `<div class="form-text">${formField.helpText}</div>`;
        }
    }
    return formInputs;
}

export function setFormInputIds(newField, formInputs) {
    if (formInputs.length > 0) {
        let newFormInputs = [];
        for (let i = 0; i < formInputs.length; i++) {
            let field = newField.querySelector(formInputs[i]);
            field.id = newField.id + "_" + field.id;
            newFormInputs.push("#" + field.id);
        }
        return newFormInputs;
    }
    return formInputs;
}

export function setValueChanged(input) {
    // setting data-current-value
   input.dataset.currentValue = "";
   // on input, after .5 seconds, if the value is different from the current value, flag the change
   input.addEventListener("input", () => {
       let currentValue = input.dataset.currentValue;
        setTimeout(() => {
            // if the value and currentValue don't match,
            if (currentValue !== input.value) {
                input.dataset.valueChanged = "true";
            }
            else {
                if (!currentValue || currentValue === input.value) {
                    input.dataset.valueChanged = "false";
                }
            }
        }, 250);
   });
}

export function applySettings(formInputs, inputEl, newField, isFormSection) {
    // form label
    let inputLabel = !isFormSection ? inputEl.querySelector(".label") : null;
    // form input if not radio or checkbox type
    let inputInput = !isFormSection ? inputEl.querySelector(".input") : null;
    // form section row
    // if radio or checkbox type
    let inputChoices = !isFormSection ? inputEl.querySelector(`#${newField.id}_choices`) : null;
    // form help_text
    let inputHelpText = !isFormSection ? inputEl.querySelector(".help-text") : null;
    // form title
    let inputTitle = isFormSection ? inputEl.querySelector(".title") : null;
    // form description
    let inputDescription = !isFormSection ? inputEl.querySelector(".description") : null;
    // applying all the settings
    formInputs.forEach((input) => {
        let field = document.querySelector(input);
        let valueChanged = field.dataset.valueChanged === "true";
        switch (field.id) {
            case `${newField.id}_id_parent_classes`:
                if (valueChanged && inputEl) {
                    let classes = field.value;
                    if (classes.length > 0 || classes.length < 1 && field.dataset.addedClasses.length > 0) {
                        let previousClasses = field.dataset.addedClasses ? field.dataset.addedClasses.split(',') : false;
                        let cs = classes.split(' ');
                        if (previousClasses) {
                            let classesToBeRemoved = [];
                            let classesToBeAdded = [];
                            // finding all the classes to be removed
                            previousClasses.filter((c) => {
                                if (!cs.includes(c)) {
                                    classesToBeRemoved.push(c);
                                }
                            });
                            // finding all the classes that need to be added
                            cs.filter((c) => {
                                if (!previousClasses.includes(c)) {
                                    classesToBeAdded.push(c);
                                }
                            });
                            // removing the classes
                            classesToBeRemoved.forEach((c) => {
                                inputEl.classList.remove(c);
                            });
                            // adding the classes
                            if (classes.length > 0) {
                                classesToBeAdded.forEach((c) => {
                                    newField.classList.add(c);
                                });
                            }
                        } else {
                            for (let i = 0; i < cs.length; i++) {
                                newField.classList.add(cs[i]);
                            }
                        }
                        field.dataset.addedClasses = `${cs}`;
                    }
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = field.dataset.addedClasses;
                }
                break;
            case `${newField.id}_id_label`:
                if (valueChanged) {
                    if (field.value.length > 0) {
                        inputLabel.innerText = field.value;
                    }
                    else {
                        inputLabel.innerText = field.value;
                    }
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = field.value;
                }
                break;
            case `${newField.id}_id_placeholder`:
                if (valueChanged && inputInput) {
                    let hasPlaceholder;
                    if (field.value.length > 0) {
                        inputInput.placeholder = field.value;
                    } else {
                        hasPlaceholder = !!inputInput.getAttribute("placeholder");
                        if (hasPlaceholder) {
                            inputInput.placeholder = "";
                        }
                    }
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = `${hasPlaceholder}`;
                }
                break;
            case `${newField.id}_id_help_text`:
                if (valueChanged) {
                    if (field.value.length > 0) {
                        inputHelpText.innerText = field.value;
                    }
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = field.value;
                }
                break;
            case `${newField.id}_id_floating_label`:
                if (valueChanged && inputInput) {
                    if (field.checked) {
                        inputEl.classList.add("form-floating");
                        inputEl.querySelector(".input").insertAdjacentElement("afterend", inputLabel);
                        // making the floating label on a textarea inputs bigger
                        let textAreaInputs = ["multiple_dropdown_input", "text_area"];
                        if (textAreaInputs.includes(newField.dataset.formType)) {
                            inputInput.style.height = '100px';
                        }
                    } else {
                        if (inputEl.className.includes("form-floating")) {
                            inputEl.classList.remove("form-floating");
                            inputEl.querySelector(".input").insertAdjacentElement("beforebegin", inputLabel);
                            // decreasing the size on textarea inputs back to normal
                            let textAreaInputs = ["dropdown_input", "multiple_dropdown_input", "text_area"];
                            if (textAreaInputs.includes(newField.dataset.formType)) {
                                inputInput.removeAttribute("style");
                            }
                        }
                    }
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = `${!field.checked}`;
                }
                break;
            case `${newField.id}_id_required`:
                if (valueChanged || inputInput) {
                    if (field.checked) {
                        inputInput.setAttribute("required", "");
                    }
                    else {
                        inputInput.removeAttribute("required");
                    }
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = `${field.checked}`;
                }
                break;
            case `${newField.id}_id_input_classes` || `${newField.id}_id_classes`:
                if (valueChanged && inputInput || valueChanged && isFormSection) {
                    let classes = field.value;
                    if (classes.length > 0 || classes.length < 1 && field.dataset.addedClasses.length > 0) {
                        let previousClasses = field.dataset.addedClasses ? field.dataset.addedClasses.split(',') : false;
                        let cs = classes.split(' ');
                        if (previousClasses) {
                            let classesToBeRemoved = [];
                            let classesToBeAdded = [];
                            // finding all the classes to be removed
                            previousClasses.filter((c) => {
                                if (!cs.includes(c)) {
                                    classesToBeRemoved.push(c);
                                }
                            });
                            // finding all the classes that need to be added
                            cs.filter((c) => {
                                if (!previousClasses.includes(c)) {
                                    classesToBeAdded.push(c);
                                }
                            });
                            // removing the classes
                            classesToBeRemoved.forEach((c) => {
                                if (!isFormSection) {
                                    inputInput.classList.remove(c);
                                }
                                else {
                                    inputEl.classList.remove(c);
                                }
                            });
                            // adding the classes
                            if (classes.length > 0) {
                                classesToBeAdded.forEach((c) => {
                                    if (!isFormSection) {
                                        inputInput.classList.add(c);
                                    } else {
                                        inputEl.classList.add(c);
                                    }
                                });
                            }
                        } else {
                            for (let i = 0; i < cs.length; i++) {
                                if (!isFormSection) {
                                    inputInput.classList.add(cs[i]);
                                }
                                else {
                                    inputEl.classList.add(cs[i]);
                                }
                            }
                        }
                        field.dataset.addedClasses = `${cs}`;
                    }
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = field.dataset.addedClasses;
                }
                break;
            case `${newField.id}_id_blank_option`:
                if (valueChanged) {
                    if (field.checked) {
                        let label = document.querySelector(formInputs.filter((l) => l.includes(`${newField.id}_id_blank_label`))[0]);
                        inputInput.dataset.blankOption = "true";
                        // creating option element
                        let blankOption = document.createElement("option");
                        blankOption.setAttribute("class", "blank-option");
                        blankOption.classList.add("blank-option");
                        blankOption.value = "";
                        blankOption.innerText = label.value;
                        // adding it to the input
                        if (inputInput.childElementCount > 0) {
                            inputInput.firstElementChild.insertAdjacentElement("beforebegin", blankOption);
                        } else {
                            inputInput.appendChild(blankOption);
                        }
                        // setting the selected choice to the blank option
                        inputInput.selected = blankOption.value;
                        // setting the label inputs value
                        label.dataset.currentValue = label.value;
                        // setting valueChanged for the blank label to false
                        label.dataset.valueChanged = "false";
                    } else {
                        let blankOption = inputInput.querySelector(".blank-option");
                        if (blankOption) {
                            inputInput.removeChild(blankOption);
                        }
                        inputInput.dataset.blankOption = "false";
                    }
                    // setting value changed for blank option to false
                    field.dataset.valueChanged = "false";
                    // setting the current value for the field
                    field.dataset.currentValue = inputInput.dataset.blankOption;
                }
                break;
            case `${newField.id}_id_blank_label`:
                // changing the data if blank option is checked
                if (valueChanged) {
                    let blankOption = document.querySelector(formInputs.filter((l) => l.includes(`${newField.id}_id_blank_option`))[0]);
                    if (blankOption.checked) {
                        let option = inputInput.querySelector(".blank-option");
                        option.innerText = field.value;
                        // settings value changed back to false
                        field.dataset.valueChanged = "false";
                        // setting currentValue
                        field.dataset.currentValue = field.value;
                    }
                }
                break;
            case `${newField.id}_id_choices`:
                if (valueChanged) {
                    let dropDowns = ["multiple_dropdown_input", "dropdown_input"];
                    let radioCheckInputs = ["radio_input", "checkbox_input"];
                    let formType = newField.dataset.formType;
                    let isDropDown = dropDowns.includes(formType);
                    let choices = {};
                    let currentChoices = field.dataset.choices;
                    let inputValues = field.value.split("\n");
                    // creating objects for each choice
                    inputValues.forEach((c) => {
                        choices[c.split(', ')[0]] = [c.split(', ')[0], c.split(', ')[1]];
                    });
                    if (currentChoices) {
                        currentChoices = JSON.parse(currentChoices);
                        // getting choices that need to be removed
                        let choicesToBeRemoved = getChoicesToBeRemove(Object.keys(currentChoices), Object.keys(choices));
                        // getting choices that need to be added
                        let choicesToBeAdded = getChoicesToBeAdded(Object.keys(choices), Object.keys(currentChoices));
                        // removing old choices
                        choicesToBeRemoved.forEach((c) => {
                            let child = isDropDown ? inputInput.querySelector(`option[value=${c}]`): inputChoices.querySelector(`input[value=${c}]`).parentElement;
                            // if input is a dropdown
                            if (inputInput) {
                                inputInput.removeChild(child);
                            }
                            // if input is a radio or checkbox input
                            else if (inputChoices) {
                                inputChoices.removeChild(child);
                            }
                        });
                        // adding new choices
                        choicesToBeAdded.forEach((c) => {
                            let newChoice = getNewChoice(isDropDown, formType, choices[c], newField.id)
                            if (isDropDown){ inputInput.appendChild(newChoice); }
                            else { inputChoices.appendChild(newChoice); }
                        });
                    } else {
                        // adding the options
                        for (let key in choices) {
                            // adding the new choices
                            let newChoice = getNewChoice(isDropDown, formType, choices[key], newField.id)
                            if (isDropDown){ inputInput.appendChild(newChoice); }
                            else { inputChoices.appendChild(newChoice); }
                        }
                    }
                    field.dataset.choices = JSON.stringify(choices);

                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = JSON.stringify(choices);
                }
                break;
            case `${newField.id}_id_min_value`:
                if (valueChanged) {
                    // changing the input
                    inputInput.setAttribute("min", field.value);
                    field.dataset.valueChanged = "false";
                }
                break;
            case `${newField.id}_id_max_value`:
                if (valueChanged) {
                    // changing the input
                    inputInput.setAttribute("max", field.value);
                    field.dataset.valueChanged = "false";
                }
                break;
            case `${newField.id}_id_title`:
                if (valueChanged) {
                    inputTitle.innerText = field.value;
                    field.dataset.valueChanged = "false";
                    field.dataset.currentValue = field.value;
                }
        }
    });
}

export function getMouseOver(targetDiv, targetMO, droppableSections) {
    if (targetMO) {
        let moDS = getDroppableSection(targetMO, droppableSections);
        if (targetDiv === moDS) {
            return targetMO
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

// gets the section that the targetMO belongs to
export function getDroppableSection(el) {
    let droppableSections = main.getDroppableSections();
    if (!droppableSections.includes(el.id)) {
        let elParent = el.parentElement;
        let section;
        while (!droppableSections.includes(elParent.id)) {
            elParent = elParent.parentElement;
        }
        section = elParent;
        return section
    }
    else if (droppableSections.includes(el.id)) {
        return el;
    }
}

export function gatherInputData(input) {
    // gathering all data pertaining to the input
    let inputData = {
        id: input.id,
        inputType: input.dataset.formType,
        children: [],
        formData: {},
    }
    // if formType is one that can contain more inputs
    let droppableTypes = ["form_row", "collapsible_section"];
    if (droppableTypes.includes(input.dataset.formType)) {
        let inputChildren = document.getElementById((`${inputData.id}_section-row`)).children;
        for (let i = 0; i < inputChildren.length; i++) {
            let child = inputChildren[i];
            inputData.children.push(gatherInputData(child));
        }
    }

    // getting all the formData
    let formDiv = document.getElementById(`${input.id}_form`);
    let formData = new FormData(formDiv);
    for (let [key, value] of formData.entries()) {
        if (key !== "csrfmiddlewaretoken") {
            inputData.formData[key] = value;
        }
    }
    return inputData;
}

export function clearFormDiv(formDiv) {
    if (formDiv.childElementCount > 0) {
        while (formDiv.childElementCount > 0) {
            formDiv.removeChild(formDiv.firstElementChild);
        }
    }
}

export function addListenerLogic(el) {
    let ds = main.getDroppableSections();
    // if element is a droppable section
    if (ds.includes(el.id)) {
        // adding the dragover listener
        // ** dragover
        el.addEventListener("dragover", (ev) => {
            ev.stopPropagation();

            let elParent = el.parentElement.parentElement; // form-row element input is two ancestors up.
            let draggedInput = main.getCurrentDraggedInput();
            if (el.id !== "formInputsDiv" || draggedInput.id !== elParent.id) {
                ev.preventDefault();
                // adding dragover logic
                dragAndDrop.setDragOver(el, ev);
            }
        });

        // ** dragleave
        el.addEventListener("dragleave", () => {
            // setting drag leave logic
            dragAndDrop.setDragLeave(el, main.getPlaceholder());
        });
    }
    else {
        // adding the dragover listener
        el.addEventListener("dragover", (ev) => {
            // **  setting propagation
            ev.stopPropagation();
            console.log(el);
            // reassigning formInputMO
            main.setFormInputMO(el);
        });

        // adding the dragstart logic
        el.addEventListener("dragstart", (ev) => {
            ev.stopPropagation();
            let data = dragAndDrop.setInputDragStart(ev, el, main.getPlaceholder());
            ev.dataTransfer.setData("text", JSON.stringify(data));
            // setting currentDraggedInput
            main.setCurrentDraggedInput(el);
        });
    }
}

export function setDropLogic(el, exists=false) {
    el.addEventListener("drop", async (ev) =>{
        ev.preventDefault();
        ev.stopPropagation();

        // removing the border, if there is one
        removeClass(el, "drag-over");

        // getting the id from the dragged object
        // data = {"id": <str:form_type>, "existing": <boolean>}
        let data = JSON.parse(ev.dataTransfer.getData("text"));

        // determining if a new or existing input is being dropped
        if (data.existing) {
            let element = document.getElementById(data.id);
            // adding the element to the target div
            dragAndDrop.setExistingDrop(element, el);
        }
        else {
            // getting event target data
            let newField = await dragAndDrop.addNewInput(data, el, exists);

            // adding functionality to remove-input
            setRemoveLogic(newField);

            // adding the listener logic
            addListenerLogic(newField);

            // adding dragstart logic if specific form section
            let sectionRow = document.getElementById(`${newField.id}_section-row`);
            if (sectionRow) {
                // adding section id to the droppableSections array
                main.addDroppableSection(sectionRow.id);

                // setting section listener logic
                addListenerLogic(sectionRow);
                //
                // sectionRow.addEventListener("dragover", (ev) => {
                //     ev.preventDefault();
                //     // **  setting propagation
                //     ev.stopPropagation();
                //     // to prevent dropping into self
                //     if (main.getCurrentDraggedInput !== newField) {
                //         dragAndDrop.setDragOver(sectionRow, ev);
                //     }
                // });
                //
                // // setting section row dragleave
                // sectionRow.addEventListener("dragleave", () => {
                //     dragAndDrop.setDragLeave(sectionRow, main.getPlaceholder());
                // });

                setDropLogic(sectionRow);

                // sectionRow.addEventListener("drop", async (e) => {
                //
                //     // getting the id from the dragged object
                //     let d = JSON.parse(e.dataTransfer.getData("text"));
                //
                //     // determining if a new or existing input is being dropped
                //     if (d.existing) {
                //         let element = document.getElementById(d.id);
                //         // adding the element to the target div
                //         dragAndDrop.setExistingDrop(element, placeholder, sectionRow);
                //     }
                //     else {
                //         // new field within form row
                //         let nf = await dragAndDrop.addNewInput(d, sectionRow, placeholder);
                //
                //         // adding functionality to remove-input
                //         functions.setRemoveLogic(nf);
                //
                //         // adding the dragover listener
                //         nf.addEventListener("dragover", (ev) => {
                //             // **  setting propagation
                //             ev.stopPropagation();
                //
                //             // formInputMO = dragAndDrop.setInputDragOver(ev, formInputMO, currentDraggedInput, nf);
                //             formInputMO = nf;
                //         });
                //
                //         // adding the dragstart logic
                //         nf.addEventListener("dragstart", (e) => {
                //             e.stopPropagation();
                //             let data = dragAndDrop.setInputDragStart(e, nf, placeholder);
                //             e.dataTransfer.setData("text", JSON.stringify(data));
                //             // setting currentDraggedInput
                //             currentDraggedInput = nf;
                //         });
                //     }
                // });
            }
        }
    });
}

// Arguments:
// el <object>: the element the error is being added to
// errorClass <str>: the classname being added to the error element
// relativeTo <object>: indicates that the error's placement is relative to this element. (default is null, in which error will just be added at the end of all children within el.)
//  position <str>: use when relativeTo is not null, indicating if the error will be placed before or after the relative element. (default as after, which is default behavior of error placement.)
export function addError(el, errorClass, msg, relativeTo=null, position="afterend") {
    // creating the error p
    let error = document.createElement("p");
    error.classList.add(errorClass);
    error.innerHTML = msg;
    // checking if relativeTo is not null
    if (relativeTo) {
        if (typeof relativeTo === 'object') {
            let errorPos = position === "afterend" ? position : "beforebegin";
            relativeTo.insertAdjacentElement(errorPos, error);
        }
    }
    else {
        // append the child at the end its last child
        el.appendChild(error);
    }

}

export function removeErrors(el, errorClass) {
    let errorEls = el.querySelectorAll("." + errorClass);
    for (let i = 0; i < errorEls.length; i++) {
        el.removeChild(errorEls[i]);
    }
}

export function dragStartLogic(el) {

}

export function containerContainsChild(container, child) {
    let children = Array.from(container.children);
    return !!children.includes(child);
}

// ***** Functions pertaining to adding modelform inputs
const fieldConfigs = {
    text: "text_input",
}
export async function getModelFieldType(fieldData) {
    // getting the input type
    return fieldConfigs[fieldData.type];
}