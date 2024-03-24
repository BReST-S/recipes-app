import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './vievs/recipeView.js';
import searchViev from './vievs/searchViev.js';
import resultView from './vievs/resultView.js';
import paginationView from './vievs/paginationView.js';
import bookmarksView from './vievs/bookmarksView.js';
import addReceipeView from './vievs/addReceipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecupes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // loading recipes
    recipeView.renderSpinner();

    resultView.update(model.getSearchResultsPage());

    await model.loadRecepi(id);
    // 2) Rendering recipe

    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const contorlSearchResults = async function () {
  try {
    // console.log('boba');
    resultView.renderSpinner();
    const query = searchViev.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage(1));
    console.log(model.state.search.results);
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
// contorlSearchResults();

const controlPagination = function (goToPage) {
  resultView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    addReceipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addReceipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    setTimeout(function () {
      addReceipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addReceipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecupes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchViev.addHandlerSearch(contorlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addReceipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
