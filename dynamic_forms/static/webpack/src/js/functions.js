// ***** All methods and functions for dynamic_forms *****
import * as functions from "./functions";

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

export function setNewField(data) {
    let newField = document.getElementById(data.id).cloneNode(true);
    newField.id = "id_" + crypto.randomUUID();
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
        }
    });
    // making the field draggable
    closeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (settingsBtn.dataset.modalOpen === "true") {
                newField.draggable = true;
                newField.classList.add("draggable");
                settingsBtn.dataset.modalOpen = "false";
            }
        });
    });
}

export function setRemoveLogic(newField, droppableSections) {
    let removeBtn = newField.querySelector(".remove-input button");
    removeBtn.dataset.parentId = `#${newField.id}`;
    removeBtn.addEventListener("click", () => {
        let section = getDroppableSection(newField, droppableSections);
        // removing the section-row's ID from droppableSections
        if (newField.dataset.formSection === "true") {
            let sectionRow = document.getElementById(`${newField.id}_section-row`);
            if (sectionRow) {
                let sectionIndex = droppableSections.indexOf(sectionRow.id);
                droppableSections.splice(sectionIndex);
            }
        }
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
        let inputId = formField.input.match(/(?<=id\W+)\w+(?=\W)/g)[0];
        formInputs.push(`#${newField.id} #${inputId}`);
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
        let prefixId = newField.id;
        for (let i = 0; i < formInputs.length; i++) {
            let field = newField.querySelector(formInputs[i]);
            field.id = prefixId + "_" + field.id;
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
        }, 500);
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
                        let choicesToBeRemoved = functions.getChoicesToBeRemove(Object.keys(currentChoices), Object.keys(choices));
                        // getting choices that need to be added
                        let choicesToBeAdded = functions.getChoicesToBeAdded(Object.keys(choices), Object.keys(currentChoices));
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
function getDroppableSection(el, droppableSections) {
    if (el) {
        let elParent = el.parentElement;
        let section;
        while (!droppableSections.includes(elParent.id)) {
            elParent = elParent.parentElement;
        }
        section = elParent;
        return section
    }
    else {
        return null;
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