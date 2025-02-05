// DOM elements
const DOMstrings = {
  stepsBtnClass: 'multisteps-form__progress-btn',
  stepsBtns: document.querySelectorAll('.multisteps-form__progress-btn'),
  stepsBar: document.querySelector('.multisteps-form__progress'),
  stepsForm: document.querySelector('.multisteps-form__form'),
  stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
  stepFormPanelClass: 'multisteps-form__panel',
  stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
  stepPrevBtnClass: 'js-btn-prev',
  stepNextBtnClass: 'js-btn-next'
};

// Helper function to remove a class from a set of elements
const removeClasses = (elemSet, className) => {
  elemSet.forEach(elem => elem.classList.remove(className));
};

// Function to find the parent element with a specific class
const findParent = (elem, parentClass) => {
  let currentNode = elem;
  while (currentNode && !currentNode.classList.contains(parentClass)) {
    currentNode = currentNode.parentNode;
  }
  return currentNode;
};

// Get the active step index
const getActiveStep = (elem) => {
  return Array.from(DOMstrings.stepsBtns).indexOf(elem);
};

// Set the active step (and all previous steps)
const setActiveStep = (activeStepNum) => {
  removeClasses(DOMstrings.stepsBtns, 'js-active');
  DOMstrings.stepsBtns.forEach((elem, index) => {
    if (index <= activeStepNum) {
      elem.classList.add('js-active');
    }
  });
};

// Get the active form panel; if none is active, default to the first panel
const getActivePanel = () => {
  const active = Array.from(DOMstrings.stepFormPanels).find(elem => elem.classList.contains('js-active'));
  return active || DOMstrings.stepFormPanels[0];
};

// Set the active panel based on the panel index
const setActivePanel = (activePanelNum) => {
  // Ensure the index is within bounds
  if (activePanelNum < 0 || activePanelNum >= DOMstrings.stepFormPanels.length) {
    console.warn('setActivePanel: Panel index out of bounds', activePanelNum);
    return;
  }
  removeClasses(DOMstrings.stepFormPanels, 'js-active');
  const activePanel = DOMstrings.stepFormPanels[activePanelNum];
  activePanel.classList.add('js-active');
  setFormHeight(activePanel);
};

// Set the form height to match the active panel's height with a guard clause
const setFormHeight = (activePanel) => {
  if (!activePanel) {
    console.warn('setFormHeight: No active panel found.');
    return;
  }
  const activePanelHeight = activePanel.offsetHeight;
  DOMstrings.stepsForm.style.height = `${activePanelHeight}px`;
};

// Event listener for clicking on the steps bar (progress bar)
DOMstrings.stepsBar.addEventListener('click', (e) => {
  const eventTarget = e.target;
  if (!eventTarget.classList.contains(DOMstrings.stepsBtnClass)) {
    return;
  }

  const activeStep = getActiveStep(eventTarget);
  setActiveStep(activeStep);
  setActivePanel(activeStep);
});

// Event listener for Prev/Next buttons
DOMstrings.stepsForm.addEventListener('click', (e) => {
  const eventTarget = e.target;

  if (!(eventTarget.classList.contains(DOMstrings.stepPrevBtnClass) || eventTarget.classList.contains(DOMstrings.stepNextBtnClass))) {
    return;
  }

  const activePanel = findParent(eventTarget, DOMstrings.stepFormPanelClass);
  let activePanelNum = Array.from(DOMstrings.stepFormPanels).indexOf(activePanel);

  if (eventTarget.classList.contains(DOMstrings.stepPrevBtnClass)) {
    if (activePanelNum > 0) {
      activePanelNum--;
    }
  } else {
    if (activePanelNum < DOMstrings.stepFormPanels.length - 1) {
      activePanelNum++;
    }
  }

  setActiveStep(activePanelNum);
  setActivePanel(activePanelNum);
});

// Set the correct form height on window load
window.addEventListener('load', () => {
  setFormHeight(getActivePanel());
  setActiveStep(0);  // Set the first step as active
  setActivePanel(0); // Show the first panel
});

// Adjust form height on window resize
window.addEventListener('resize', () => {
  setFormHeight(getActivePanel());
});

// Wait for DOM content to be loaded before applying event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Allow changing of the animation type based on user selection if needed
  const animationSelect = document.querySelector('.pick-animation__select');
  if (animationSelect) {
    animationSelect.addEventListener('change', () => {
      const newAnimationType = animationSelect.value;
      DOMstrings.stepFormPanels.forEach(elem => {
        elem.dataset.animation = newAnimationType;
      });
    });
  } else {
    console.warn('Animation select element not found.');
  }
});
