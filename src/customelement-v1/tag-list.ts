class TagList extends HTMLElement {

  private _items: string[] = [];
  private _uuid: string = '';
  container: any;
  onClickListener: any;
  datalist: any;
  input: any;

  get value(): string | string[] {

    var values: string[] = [];
    [].forEach.call(this.querySelectorAll('.tagItem'), function (item: Node) {
      if (item && item.firstChild)
        values.push((item.firstChild.textContent || "").trim());
    });
    return values;

  }
  set value(val: string | string[]) {

    // Clear previous
    [].forEach.call(this.querySelectorAll('.tagItem'), (item: Element) => {
      if (item && item.parentNode) item.parentNode.removeChild(item);
    });

    // Set new items
    if (!Array.isArray(val)) val = [val];

    val.forEach((item: string) => {
      this.addItem(item);
    });

  }
  get items(): string | string[] {
    return this._items || [];
  }
  set items(value: string | string[]) {
    if (value == null)
      value = [];
    if (!Array.isArray(value))
      value = [value];
    this._items = value;
    this.setItems();
  }

  // Workaround for older implementations
  attachedCallback() {
    this.connectedCallback();
  }

  connectedCallback() {

    // Init internal properties
    this._items = [];
    this._uuid = this.uuid();
    this.setupUI();
    //@ts-ignore
    this.container = this.querySelector('.tags');
    //@ts-ignore
    this.input = this.querySelector('input');

    // Reading values from attribute
    var valueFromDOM = this.getAttribute('value');
    if (valueFromDOM) valueFromDOM.split(',').map((item: string) => { this.addItem(item); });
    var itemsFromDOM = this.getAttribute('items');
    if (itemsFromDOM) itemsFromDOM.split(',').map((item: string) => { this.addItem(item); });

    this.setupListeners();
    //@ts-ignore
    this.datalist = this.querySelector('datalist');
    if (this._items)
      this.setItems();
  }

  attributeChangedCallback(attr: string, oldValue: string, newValue: string) {

    if (['value', 'items'].indexOf(attr) === -1)
      return;

    if (oldValue === newValue)
      return;

    //@ts-ignore
    this[attr] = (Array.isArray(newValue)) ? newValue : newValue.toString().split(',');

  }


  uuid() {
    function _() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return _() + _() + '-' + _() + '-' + _() + '-' + _() + '-' + _() + _() + _();
  }
  setupUI() {

    let styles = `<style>
		tag-list {
			display: inline-block;
		}
			tag-list .tags {
				margin: auto;
				max-width:100%;
				border: 1px solid #EAEAEA;
				min-height: 30px;
				box-sizing: border-box;
				display: flex;
				flex-wrap: wrap;
			}
			tag-list .tagItem {
				background-color: #F4F4F4;
				margin: 1px;
				height: 28px;
				line-height: 28px;
			}
			tag-list .tagItem > span {
				min-width: 20px;
				display: inline-block;
				margin: 0 8px;
			}
			tag-list .tagItem .delete {
				cursor: pointer;
			}
			tag-list input {
				min-height: 28px;
				flex-grow: 1;
				min-width: 1px;
				max-width:100%; 
				width: 1px;
				padding: 0 6px;
				margin: 1px;
				background-color: yellow;
				border: none;
			}</style>`;

    let ui = `<div class="tags">
				<input list="${this._uuid}" tabindex="0"></input>
			</div><datalist id="${this._uuid}"/>`;
    this.innerHTML = styles + ui;

  }

  addItem(value: string) {

    if (!this.container) return;

    let item = document.createElement('div');
    item.classList.add('tagItem');
    item.innerHTML = '<span>' + value + ' <span class="delete">x</span></span>';
    this.container.insertBefore(item, this.input);
  }

  setupListeners() {
    this.onClickListener = this._OnClickListener.bind(this);
    if (this.container) this.container.addEventListener('click', this.onClickListener);

    var _this = this;
    this.input.addEventListener('keyup', function (e: KeyboardEvent) {
      var key = e.which || e.keyCode;
      //@ts-ignore
      if (([13, 32].indexOf(key) !== -1) && (this.value != null)) {
        //@ts-ignore
        if (this.value.trim() != '') _this.addItem(this.value);
        //@ts-ignore
        this.value = '';
      }
    });
  }

  setItems() {
    if (!this.datalist || !this._items)
      return;
    let fragment = document.createElement('DIV');
    let _items = (Array.isArray(this.items)) ? this.items : [this.items];
    _items.forEach((item: string) => {
      let option = document.createElement('OPTION');
      option.innerText = item.toString();
      fragment.appendChild(option);
    });
    this.datalist.innerHTML = fragment.innerHTML;
  }
  _OnClickListener(e: MouseEvent) {

    if (e.target && (<Element>e.target).classList.contains('delete')) {
      //@ts-ignore
      let item = e.target.parentNode.parentNode;
      item.parentNode.removeChild(item);
      return;
    }

    this.input.focus();
  }
}
window.customElements.define('tag-list', TagList);