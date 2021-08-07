const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// Генерация чисел
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const randomFloat = (a = 10, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const number = (lower + Math.random() * (upper - lower)).toFixed(1);
  return String(number).endsWith('0') ? Number(number).toFixed() : Number(number).toFixed(1);
};

export {RenderPosition, render, createElement, getRandomInteger, randomFloat};

