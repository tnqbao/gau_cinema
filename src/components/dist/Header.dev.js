"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Header = function Header(_ref) {
  var onCategorySelect = _ref.onCategorySelect;
  var navigate = (0, _reactRouterDom.useNavigate)();

  var handleCategoryClick = function handleCategoryClick(category) {
    onCategorySelect(category);
    navigate("/".concat(category.replace(/\s+/g, '-').toLowerCase()));
  };
};

var _default = Header;
exports["default"] = _default;
//# sourceMappingURL=Header.dev.js.map
