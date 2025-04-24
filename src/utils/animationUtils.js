export const applyAnimationDelay = (selector, delayIncrement) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    element.style.animationDelay = `${delayIncrement * (index + 1)}s`;
  });
};
