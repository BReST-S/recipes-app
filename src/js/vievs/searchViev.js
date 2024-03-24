class SearchView {
  _perentEl = document.querySelector('.search');

  getQuery() {
    const query = this._perentEl.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this._perentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._perentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
