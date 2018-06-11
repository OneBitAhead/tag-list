"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TagList = (function (_super) {
    __extends(TagList, _super);
    function TagList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._items = [];
        _this._uuid = '';
        return _this;
    }
    Object.defineProperty(TagList.prototype, "value", {
        get: function () {
            var values = [];
            [].forEach.call(this.querySelectorAll('.tagItem'), function (item) {
                if (item && item.firstChild)
                    values.push((item.firstChild.textContent || "").trim());
            });
            return values;
        },
        set: function (val) {
            var _this = this;
            [].forEach.call(this.querySelectorAll('.tagItem'), function (item) {
                if (item && item.parentNode)
                    item.parentNode.removeChild(item);
            });
            if (!Array.isArray(val))
                val = [val];
            val.forEach(function (item) {
                _this.addItem(item);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TagList.prototype, "items", {
        get: function () {
            return this._items || [];
        },
        set: function (value) {
            if (value == null)
                value = [];
            if (!Array.isArray(value))
                value = [value];
            this._items = value;
            this.setItems();
        },
        enumerable: true,
        configurable: true
    });
    TagList.prototype.attachedCallback = function () {
        this.connectedCallback();
    };
    TagList.prototype.connectedCallback = function () {
        var _this = this;
        this._items = [];
        this._uuid = this.uuid();
        this.setupUI();
        this.container = this.querySelector('.tags');
        this.input = this.querySelector('input');
        var valueFromDOM = this.getAttribute('value');
        if (valueFromDOM)
            valueFromDOM.split(',').map(function (item) { _this.addItem(item); });
        var itemsFromDOM = this.getAttribute('items');
        if (itemsFromDOM)
            itemsFromDOM.split(',').map(function (item) { _this.addItem(item); });
        this.setupListeners();
        this.datalist = this.querySelector('datalist');
        if (this._items)
            this.setItems();
    };
    TagList.prototype.attributeChangedCallback = function (attr, oldValue, newValue) {
        if (['value', 'items'].indexOf(attr) === -1)
            return;
        if (oldValue === newValue)
            return;
        this[attr] = (Array.isArray(newValue)) ? newValue : newValue.toString().split(',');
    };
    TagList.prototype.uuid = function () {
        function _() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return _() + _() + '-' + _() + '-' + _() + '-' + _() + '-' + _() + _() + _();
    };
    TagList.prototype.setupUI = function () {
        var styles = "<style>\n\t\ttag-list {\n\t\t\tdisplay: inline-block;\n\t\t}\n\t\t\ttag-list .tags {\n\t\t\t\tmargin: auto;\n\t\t\t\tmax-width:100%;\n\t\t\t\tborder: 1px solid #EAEAEA;\n\t\t\t\tmin-height: 30px;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex-wrap: wrap;\n\t\t\t}\n\t\t\ttag-list .tagItem {\n\t\t\t\tbackground-color: #F4F4F4;\n\t\t\t\tmargin: 1px;\n\t\t\t\theight: 28px;\n\t\t\t\tline-height: 28px;\n\t\t\t}\n\t\t\ttag-list .tagItem > span {\n\t\t\t\tmin-width: 20px;\n\t\t\t\tdisplay: inline-block;\n\t\t\t\tmargin: 0 8px;\n\t\t\t}\n\t\t\ttag-list .tagItem .delete {\n\t\t\t\tcursor: pointer;\n\t\t\t}\n\t\t\ttag-list input {\n\t\t\t\tmin-height: 28px;\n\t\t\t\tflex-grow: 1;\n\t\t\t\tmin-width: 1px;\n\t\t\t\tmax-width:100%; \n\t\t\t\twidth: 1px;\n\t\t\t\tpadding: 0 6px;\n\t\t\t\tmargin: 1px;\n\t\t\t\tbackground-color: yellow;\n\t\t\t\tborder: none;\n\t\t\t}</style>";
        var ui = "<div class=\"tags\">\n\t\t\t\t<input list=\"" + this._uuid + "\" tabindex=\"0\"></input>\n\t\t\t</div><datalist id=\"" + this._uuid + "\"/>";
        this.innerHTML = styles + ui;
    };
    TagList.prototype.addItem = function (value) {
        if (!this.container)
            return;
        var item = document.createElement('div');
        item.classList.add('tagItem');
        item.innerHTML = '<span>' + value + ' <span class="delete">x</span></span>';
        this.container.insertBefore(item, this.input);
    };
    TagList.prototype.setupListeners = function () {
        this.onClickListener = this._OnClickListener.bind(this);
        if (this.container)
            this.container.addEventListener('click', this.onClickListener);
        var _this = this;
        this.input.addEventListener('keyup', function (e) {
            var key = e.which || e.keyCode;
            if (([13, 32].indexOf(key) !== -1) && (this.value != null)) {
                if (this.value.trim() != '')
                    _this.addItem(this.value);
                this.value = '';
            }
        });
    };
    TagList.prototype.setItems = function () {
        if (!this.datalist || !this._items)
            return;
        var fragment = document.createElement('DIV');
        var _items = (Array.isArray(this.items)) ? this.items : [this.items];
        _items.forEach(function (item) {
            var option = document.createElement('OPTION');
            option.innerText = item.toString();
            fragment.appendChild(option);
        });
        this.datalist.innerHTML = fragment.innerHTML;
    };
    TagList.prototype._OnClickListener = function (e) {
        if (e.target && e.target.classList.contains('delete')) {
            var item = e.target.parentNode.parentNode;
            item.parentNode.removeChild(item);
            return;
        }
        this.input.focus();
    };
    return TagList;
}(HTMLElement));
window.customElements.define('tag-list', TagList);
