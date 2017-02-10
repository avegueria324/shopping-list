// Section 1: Contain the STATE
//Spend some time thinking about which information I may need to store
var state = {
  items: []
};

var listItemTemplate = (
  '<li>' +
    '<span class="shopping-item js-shopping-item"></span>' +
    '<div class="shopping-item-controls">' +
      '<button class="js-shopping-item-toggle">' +
        '<span class="button-label">check</span>' +
      '</button> ' +
      '<button class="js-shopping-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);

//Section 2: Functions that modify the state.
//Takes the state as the first argument and any additional info 
// as additional arguments
//This represents everything we want to do with the state

//function to add items to the list

//another way of pushing the item to the array
//checked off is keeps it unchecked
function addItem(state, item) {
  state.items.push({
    displayName: item,
    checkedOff: false
  });
}

//A way of getting the item from the array using the itemIndex
//this will allow us to modify it later by selecing it's index
function getItem(state, itemIndex) {
  return state.items[itemIndex];
}
//this is a function to delete the item and uses the item index as an argument
//so we know which one to delete
//splice() first argument is the item index we're selecting and the second (1) is choosing
//how many in the array to delete
function deleteItem(state, itemIndex) {
  state.items.splice(itemIndex, 1);
}
//uses three arguments
//1 is refering to the state
//2 is selecting which item in the array
//3 is giving it a new state which would be checking off the item
function updateItem(state, itemIndex, newItemState) {
  state.items[itemIndex] = newItemState;
}



//THIS IS WHERE I GOT LOST! ASK FOR HELP!


//Section 3: Functions that will render the state
// this will render HTML into a DOM element
//HTML should reflect the state.
//There should be a single function for each part of the page we want to update
//For this shopping list, we want to render the list of items every time one of our functions are run

function renderItem(item, itemId, itemTemplate, itemDataAttr) {
  var element = $(itemTemplate);
  element.find('.js-shopping-item').text(item.displayName);
  if (item.checkedOff) {
    element.find('.js-shopping-item').addClass('shopping-item__checked');
  }
  element.find('.js-shopping-item-toggle')
  element.attr(itemDataAttr, itemId);
  return element;
}
function renderList(state, listElement, itemDataAttr) {
  var itemsHTML = state.items.map(
    function(item, index) {
      return renderItem(item, index, listItemTemplate, itemDataAttr);
  });
  listElement.html(itemsHTML);
}

//Section 4: Event Listeners
//JQuery event listeners that call one or more of our state functions to update the state appropriately
// then it calls the render function to make the DOM reflect the new state

function handleItemAdds(
  formElement, newItemIdentifier, itemDataAttr, listElement, state) {

  formElement.submit(function(event) {
    event.preventDefault();
    var newItem = formElement.find(newItemIdentifier).val();
    addItem(state, newItem);
    renderList(state, listElement, itemDataAttr);
    // reset form
    this.reset();
  });
}

function handleItemDeletes(
  formElement, removeIdentifier, itemDataAttr, listElement, state) {

  listElement.on('click', removeIdentifier, function(event) {
    var itemIndex = parseInt($(this).closest('li').attr(itemDataAttr));
    deleteItem(state, itemIndex);
    renderList(state, listElement, itemDataAttr);
  })
}

function handleItemToggles(
  listElement, toggleIdentifier, itemDataAttr, state) {

  listElement.on('click', toggleIdentifier, function(event) {
    var itemId = $(event.currentTarget.closest('li')).attr(itemDataAttr);
    var oldItem = getItem(state, itemId);

    updateItem(state, itemId, {
      displayName: oldItem.displayName,
      checkedOff: !oldItem.checkedOff
    });
    renderList(state, listElement, itemDataAttr)
  });
}

$(function() {
  var formElement = $('#js-shopping-list-form');
  var listElement = $('.js-shopping-list');

  // from index.html -- it's the id of the input
  // containing shopping list items
  var newItemIdentifier = '#js-new-item';

  // from `listItemTemplate` at top of this file. for each
  // displayed shopping list item, we'll be adding a button
  // that has this class name on it
  var removeIdentifier = '.js-shopping-item-delete';

  // we'll use this attribute to store the id of the list item
  var itemDataAttr = 'data-list-item-id';

  //
  var toggleIdentifier = '.js-shopping-item-toggle'

  handleItemAdds(
    formElement, newItemIdentifier, itemDataAttr, listElement, state);
  handleItemDeletes(
    formElement, removeIdentifier, itemDataAttr, listElement, state);
  handleItemToggles(listElement, toggleIdentifier, itemDataAttr, state);
});