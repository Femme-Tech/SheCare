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
  while (!currentNode.classList.contains(parentClass)) {
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

// Get the active form panel
const getActivePanel = () => {
  return Array.from(DOMstrings.stepFormPanels).find(elem => elem.classList.contains('js-active'));
};

// Set the active panel based on the panel index
const setActivePanel = (activePanelNum) => {
  removeClasses(DOMstrings.stepFormPanels, 'js-active');
  const activePanel = DOMstrings.stepFormPanels[activePanelNum];
  activePanel.classList.add('js-active');
  setFormHeight(activePanel);
};

// Set the form height to match the active panel's height
const setFormHeight = (activePanel) => {
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
    activePanelNum--;
  } else {
    activePanelNum++;
  }

  setActiveStep(activePanelNum);
  setActivePanel(activePanelNum);
});

// Set the correct form height on window load
window.addEventListener('load', () => {
  setFormHeight(getActivePanel());
});

// Adjust form height on window resize
window.addEventListener('resize', () => {
  setFormHeight(getActivePanel());
});

// If needed, allow changing of the animation type based on user selection
const animationSelect = document.querySelector('.pick-animation__select');
if (animationSelect) {
  animationSelect.addEventListener('change', () => {
    const newAnimationType = animationSelect.value;
    DOMstrings.stepFormPanels.forEach(elem => {
      elem.dataset.animation = newAnimationType;
    });
  });
}
