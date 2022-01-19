'use strict';

const search = document.forms['search'].querySelector('input[type="text"]');
const searchButton = document.querySelector('.searchButton');
const check = document.querySelector('.check');
const addInput = document.querySelector('.add-input');
const addButton = document.querySelector('.add-button');
const list = document.querySelector('.list');

const storage = function (array) {
  localStorage.setItem('listItems', JSON.stringify(array));
};

const getStorage = function (key) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

const oldlist = getStorage('listItems');
let deleted = getStorage('deletedItems');
const mainlist = oldlist.filter((_, index) => !deleted.includes(index));
storage(mainlist);
localStorage.setItem('deletedItems', JSON.stringify([]));

const init = function () {
  if (!mainlist.length) return;

  const html = mainlist
    .map(function (item, index) {
      return `
      <li class="item" data-id="${index}">
        ${item}
        <span class="delete">X</span>
      </li>
    `;
    })
    .join('');

  list.insertAdjacentHTML('afterbegin', html);
};
init();

const deletedItems = [];
const deleteItemHandler = function (event) {
  if (!event.target.closest('.delete')) return;

  const target = event.target.parentElement;
  deletedItems.push(+target.dataset.id);
  target.remove();
  localStorage.setItem('deletedItems', JSON.stringify(deletedItems));
};

searchButton.addEventListener('click', function (event) {
  event.preventDefault();
});

search.addEventListener('input', function (event) {
  const userSearchFor = event.target.value.toLowerCase();

  list.textContent = '';

  const oldlist = getStorage('listItems');
  let deleted = getStorage('deletedItems');
  const mainlist = oldlist.filter((_, index) => !deleted.includes(index));
  storage(mainlist);
  localStorage.setItem('deletedItems', JSON.stringify([]));

  const html = mainlist
    .map((item, index) => {
      if (item.includes(userSearchFor)) {
        return `
          <li class="item" data-id="${index}">
            ${item}
            <span class="delete">X</span>
          </li>
        `;
      }
    })
    .join('');

  if (html) list.insertAdjacentHTML('afterbegin', html);
});

check.addEventListener('change', function () {
  list.classList.toggle('hide');
});

addButton.addEventListener('click', function (event) {
  event.preventDefault();
  if (!addInput.value) return;

  mainlist.unshift(addInput.value);
  storage(mainlist);
  const newItem = `
      <li class="item">
        ${addInput.value}
        <span class="delete">X</span>
      </li>
    `;
  list.insertAdjacentHTML('afterbegin', newItem);
  addInput.value = '';
  addInput.focus();
});

list.addEventListener('click', deleteItemHandler);
