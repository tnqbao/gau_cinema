"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logException = exports.logEvent = exports.logPageView = exports.initGA = void 0;

var _reactGa = _interopRequireDefault(require("react-ga4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/utils/analytics.js
var initGA = function initGA() {
  _reactGa["default"].initialize("G-JL34R1GT3W");
};

exports.initGA = initGA;

var logPageView = function logPageView() {
  _reactGa["default"].send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search
  });
};

exports.logPageView = logPageView;

var logEvent = function logEvent() {
  var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  if (category && action) {
    _reactGa["default"].event({
      category: category,
      action: action
    });
  }
};

exports.logEvent = logEvent;

var logException = function logException() {
  var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var fatal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (description) {
    _reactGa["default"].exception({
      description: description,
      fatal: fatal
    });
  }
};

exports.logException = logException;
//# sourceMappingURL=analytics.dev.js.map
