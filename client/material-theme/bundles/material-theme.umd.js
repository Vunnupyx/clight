(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(
        exports,
        require('@angular/core'),
        require('@angular/flex-layout')
      )
    : typeof define === 'function' && define.amd
    ? define(
        'material-theme',
        ['exports', '@angular/core', '@angular/flex-layout'],
        factory
      )
    : ((global =
        typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory(
        (global['material-theme'] = {}),
        global.ng.core,
        global.ng.flexLayout
      ));
})(this, function (exports, core, flexLayout) {
  'use strict';

  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
  /* global Reflect, Promise */
  var extendStatics = function (d, b) {
    extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
    return extendStatics(d, b);
  };
  function __extends(d, b) {
    if (typeof b !== 'function' && b !== null)
      throw new TypeError(
        'Class extends value ' + String(b) + ' is not a constructor or null'
      );
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }
  var __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  }
  function __param(paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  }
  function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(metadataKey, metadataValue);
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  var __createBinding = Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          }
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      };
  function __exportStar(m, o) {
    for (var p in m)
      if (p !== 'default' && !Object.prototype.hasOwnProperty.call(o, p))
        __createBinding(o, m, p);
  }
  function __values(o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(
      s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    );
  }
  function __read(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  /** @deprecated */
  function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  }
  /** @deprecated */
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }
  function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
      to[j] = from[i];
    return to;
  }
  function __await(v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
    return (
      (i = {}),
      verb('next'),
      verb('throw'),
      verb('return'),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume('next', value);
    }
    function reject(value) {
      resume('throw', value);
    }
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  }
  function __asyncDelegator(o) {
    var i, p;
    return (
      (i = {}),
      verb('next'),
      verb('throw', function (e) {
        throw e;
      }),
      verb('return'),
      (i[Symbol.iterator] = function () {
        return this;
      }),
      i
    );
    function verb(n, f) {
      i[n] = o[n]
        ? function (v) {
            return (p = !p)
              ? { value: __await(o[n](v)), done: n === 'return' }
              : f
              ? f(v)
              : v;
          }
        : f;
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator)
      throw new TypeError('Symbol.asyncIterator is not defined.');
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === 'function' ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb('next'),
        verb('throw'),
        verb('return'),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  }
  function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  }
  var __setModuleDefault = Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      };
  function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  }
  function __importDefault(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  }
  function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a getter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot read private member from an object whose class did not declare it'
      );
    return kind === 'm'
      ? f
      : kind === 'a'
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  }
  function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === 'm') throw new TypeError('Private method is not writable');
    if (kind === 'a' && !f)
      throw new TypeError('Private accessor was defined without a setter');
    if (
      typeof state === 'function'
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        'Cannot write private member to an object whose class did not declare it'
      );
    return (
      kind === 'a'
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  }

  var hideInputs = ['fxHide.xxl'];
  var showInputs = ['fxShow.xxl'];
  var classInputs = ['ngClass.xxl'];
  var styleInputs = ['ngStyle.xxl'];
  var imgInputs = ['imgSrc.xxl'];
  var flexInputs = ['fxFlex.xxl'];
  var orderInputs = ['fxFlexOrder.xxl'];
  var offsetInputs = ['fxFlexOffset.xxl'];
  var flexAlignInputs = ['fxFlexAlign.xxl'];
  var fillInputs = ['fxFlexFill.xxl', 'fxFill.xxl'];
  var BreakpointHideXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointHideXxlDirective, _super);
    function BreakpointHideXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = hideInputs;
      return _this;
    }
    return BreakpointHideXxlDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointHideXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxHide.xxl]',
          inputs: hideInputs
        }
      ]
    }
  ];
  var BreakpointShowXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointShowXxlDirective, _super);
    function BreakpointShowXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = showInputs;
      return _this;
    }
    return BreakpointShowXxlDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointShowXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxShow.xxl]',
          inputs: showInputs
        }
      ]
    }
  ];
  var BreakpointClassXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointClassXxlDirective, _super);
    function BreakpointClassXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = classInputs;
      return _this;
    }
    return BreakpointClassXxlDirective;
  })(flexLayout.ClassDirective);
  BreakpointClassXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngClass.xxl]',
          inputs: classInputs
        }
      ]
    }
  ];
  var BreakpointStyleXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointStyleXxlDirective, _super);
    function BreakpointStyleXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = styleInputs;
      return _this;
    }
    return BreakpointStyleXxlDirective;
  })(flexLayout.StyleDirective);
  BreakpointStyleXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngStyle.xxl]',
          inputs: styleInputs
        }
      ]
    }
  ];
  var BreakpointImgSrcXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointImgSrcXxlDirective, _super);
    function BreakpointImgSrcXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = imgInputs;
      return _this;
    }
    return BreakpointImgSrcXxlDirective;
  })(flexLayout.ImgSrcDirective);
  BreakpointImgSrcXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[imgSrc.xxl]',
          inputs: imgInputs
        }
      ]
    }
  ];
  var BreakpointFlexXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexXxlDirective, _super);
    function BreakpointFlexXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexInputs;
      return _this;
    }
    return BreakpointFlexXxlDirective;
  })(flexLayout.FlexDirective);
  BreakpointFlexXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlex.xxl]',
          inputs: flexInputs
        }
      ]
    }
  ];
  var BreakpointOrderXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointOrderXxlDirective, _super);
    function BreakpointOrderXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = orderInputs;
      return _this;
    }
    return BreakpointOrderXxlDirective;
  })(flexLayout.FlexOrderDirective);
  BreakpointOrderXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOrder.xxl]',
          inputs: orderInputs
        }
      ]
    }
  ];
  var BreakpointOffsetXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointOffsetXxlDirective, _super);
    function BreakpointOffsetXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = offsetInputs;
      return _this;
    }
    return BreakpointOffsetXxlDirective;
  })(flexLayout.FlexOffsetDirective);
  BreakpointOffsetXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOffset.xxl]',
          inputs: offsetInputs
        }
      ]
    }
  ];
  var BreakpointFlexAlignXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexAlignXxlDirective, _super);
    function BreakpointFlexAlignXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexAlignInputs;
      return _this;
    }
    return BreakpointFlexAlignXxlDirective;
  })(flexLayout.FlexAlignDirective);
  BreakpointFlexAlignXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexAlign.xxl]',
          inputs: flexAlignInputs
        }
      ]
    }
  ];
  var BreakpointFillXxlDirective = /** @class */ (function (_super) {
    __extends(BreakpointFillXxlDirective, _super);
    function BreakpointFillXxlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = fillInputs;
      return _this;
    }
    return BreakpointFillXxlDirective;
  })(flexLayout.FlexFillDirective);
  BreakpointFillXxlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexFill.xxl]',
          inputs: fillInputs
        }
      ]
    }
  ];

  var hideInputs$1 = ['fxHide.xxs'];
  var showInputs$1 = ['fxShow.xxs'];
  var classInputs$1 = ['ngClass.xxs'];
  var styleInputs$1 = ['ngStyle.xxs'];
  var imgInputs$1 = ['imgSrc.xxs'];
  var flexInputs$1 = ['fxFlex.xxs'];
  var orderInputs$1 = ['fxFlexOrder.xxs'];
  var offsetInputs$1 = ['fxFlexOffset.xxs'];
  var flexAlignInputs$1 = ['fxFlexAlign.xxs'];
  var fillInputs$1 = ['fxFlexFill.xxs', 'fxFill.xxs'];
  var BreakpointHideXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointHideXxsDirective, _super);
    function BreakpointHideXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = hideInputs$1;
      return _this;
    }
    return BreakpointHideXxsDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointHideXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxHide.xxs]',
          inputs: hideInputs$1
        }
      ]
    }
  ];
  var BreakpointShowXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointShowXxsDirective, _super);
    function BreakpointShowXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = showInputs$1;
      return _this;
    }
    return BreakpointShowXxsDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointShowXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxShow.xxs]',
          inputs: showInputs$1
        }
      ]
    }
  ];
  var BreakpointClassXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointClassXxsDirective, _super);
    function BreakpointClassXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = classInputs$1;
      return _this;
    }
    return BreakpointClassXxsDirective;
  })(flexLayout.ClassDirective);
  BreakpointClassXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngClass.xxs]',
          inputs: classInputs$1
        }
      ]
    }
  ];
  var BreakpointStyleXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointStyleXxsDirective, _super);
    function BreakpointStyleXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = styleInputs$1;
      return _this;
    }
    return BreakpointStyleXxsDirective;
  })(flexLayout.StyleDirective);
  BreakpointStyleXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngStyle.xxs]',
          inputs: styleInputs$1
        }
      ]
    }
  ];
  var BreakpointImgSrcXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointImgSrcXxsDirective, _super);
    function BreakpointImgSrcXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = imgInputs$1;
      return _this;
    }
    return BreakpointImgSrcXxsDirective;
  })(flexLayout.ImgSrcDirective);
  BreakpointImgSrcXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[imgSrc.xxs]',
          inputs: imgInputs$1
        }
      ]
    }
  ];
  var BreakpointFlexXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexXxsDirective, _super);
    function BreakpointFlexXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexInputs$1;
      return _this;
    }
    return BreakpointFlexXxsDirective;
  })(flexLayout.FlexDirective);
  BreakpointFlexXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlex.xxs]',
          inputs: flexInputs$1
        }
      ]
    }
  ];
  var BreakpointOrderXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointOrderXxsDirective, _super);
    function BreakpointOrderXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = orderInputs$1;
      return _this;
    }
    return BreakpointOrderXxsDirective;
  })(flexLayout.FlexOrderDirective);
  BreakpointOrderXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOrder.xxs]',
          inputs: orderInputs$1
        }
      ]
    }
  ];
  var BreakpointOffsetXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointOffsetXxsDirective, _super);
    function BreakpointOffsetXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = offsetInputs$1;
      return _this;
    }
    return BreakpointOffsetXxsDirective;
  })(flexLayout.FlexOffsetDirective);
  BreakpointOffsetXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOffset.xxs]',
          inputs: offsetInputs$1
        }
      ]
    }
  ];
  var BreakpointFlexAlignXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexAlignXxsDirective, _super);
    function BreakpointFlexAlignXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexAlignInputs$1;
      return _this;
    }
    return BreakpointFlexAlignXxsDirective;
  })(flexLayout.FlexAlignDirective);
  BreakpointFlexAlignXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexAlign.xxs]',
          inputs: flexAlignInputs$1
        }
      ]
    }
  ];
  var BreakpointFillXxsDirective = /** @class */ (function (_super) {
    __extends(BreakpointFillXxsDirective, _super);
    function BreakpointFillXxsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = fillInputs$1;
      return _this;
    }
    return BreakpointFillXxsDirective;
  })(flexLayout.FlexFillDirective);
  BreakpointFillXxsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexFill.xxs]',
          inputs: fillInputs$1
        }
      ]
    }
  ];

  var CELOSNEXT_BREAKPOINTS = [
    {
      alias: 'xxs',
      suffix: 'xxsScreen',
      mediaQuery: 'screen and (max-width: 479.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'xs',
      suffix: 'xsScreen',
      mediaQuery: 'screen and (min-width: 480px) and (max-width: 575.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'gt-xs',
      suffix: 'gtXsScreen',
      mediaQuery: 'screen and (min-width: 480px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'lt-xs',
      suffix: 'ltXsScreen',
      mediaQuery: 'screen and (max-width: 575.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'sm',
      suffix: 'smScreen',
      mediaQuery: 'screen and (min-width: 576px) and (max-width: 767.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'gt-sm',
      suffix: 'gtSmScreen',
      mediaQuery: 'screen and (min-width: 576px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'lt-sm',
      suffix: 'ltSmScreen',
      mediaQuery: 'screen and (max-width: 767.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'md',
      suffix: 'mdScreen',
      mediaQuery: 'screen and (min-width: 768px) and (max-width: 991.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'gt-md',
      suffix: 'gtMdScreen',
      mediaQuery: 'screen and (min-width: 768px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'lt-md',
      suffix: 'ltMdScreen',
      mediaQuery: 'screen and (max-width: 991.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'lg',
      suffix: 'lgScreen',
      mediaQuery: 'screen and (min-width: 992px) and (max-width: 1280.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'gt-lg',
      suffix: 'gtLgScreen',
      mediaQuery: 'screen and (min-width: 992px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'lt-lg',
      suffix: 'ltLgScreen',
      mediaQuery: 'screen and (max-width: 1280.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'xl',
      suffix: 'xlScreen',
      mediaQuery: 'screen and (min-width: 1281px) and (max-width: 1919.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'gt-xl',
      suffix: 'gtXlScreen',
      mediaQuery: 'screen and (min-width: 1281px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'lt-xl',
      suffix: 'ltXlScreen',
      mediaQuery: 'screen and (max-width: 1919.9px)',
      overlapping: false,
      priority: 1001
    },
    {
      alias: 'xxl',
      suffix: 'xxlScreen',
      mediaQuery: 'screen and (min-width: 1920px)',
      overlapping: false,
      priority: 1001
    }
  ];
  var CelosNextBreakPointsProvider = {
    provide: flexLayout.BREAKPOINT,
    useValue: CELOSNEXT_BREAKPOINTS,
    multi: true
  };

  var hideInputs$2 = ['fxHide.lt-xs'];
  var showInputs$2 = ['fxShow.lt-xs'];
  var classInputs$2 = ['ngClass.lt-xs'];
  var styleInputs$2 = ['ngStyle.lt-xs'];
  var imgInputs$2 = ['imgSrc.lt-xs'];
  var flexInputs$2 = ['fxFlex.lt-xs'];
  var orderInputs$2 = ['fxFlexOrder.lt-xs'];
  var offsetInputs$2 = ['fxFlexOffset.lt-xs'];
  var flexAlignInputs$2 = ['fxFlexAlign.lt-xs'];
  var fillInputs$2 = ['fxFlexFill.lt-xs', 'fxFill.lt-xs'];
  var BreakpointHideLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointHideLtXsDirective, _super);
    function BreakpointHideLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = hideInputs$2;
      return _this;
    }
    return BreakpointHideLtXsDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointHideLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxHide.lt-xs]',
          inputs: hideInputs$2
        }
      ]
    }
  ];
  var BreakpointShowLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointShowLtXsDirective, _super);
    function BreakpointShowLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = showInputs$2;
      return _this;
    }
    return BreakpointShowLtXsDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointShowLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxShow.lt-xs]',
          inputs: showInputs$2
        }
      ]
    }
  ];
  var BreakpointClassLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointClassLtXsDirective, _super);
    function BreakpointClassLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = classInputs$2;
      return _this;
    }
    return BreakpointClassLtXsDirective;
  })(flexLayout.ClassDirective);
  BreakpointClassLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngClass.lt-xs]',
          inputs: classInputs$2
        }
      ]
    }
  ];
  var BreakpointStyleLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointStyleLtXsDirective, _super);
    function BreakpointStyleLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = styleInputs$2;
      return _this;
    }
    return BreakpointStyleLtXsDirective;
  })(flexLayout.StyleDirective);
  BreakpointStyleLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngStyle.lt-xs]',
          inputs: styleInputs$2
        }
      ]
    }
  ];
  var BreakpointImgSrcLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointImgSrcLtXsDirective, _super);
    function BreakpointImgSrcLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = imgInputs$2;
      return _this;
    }
    return BreakpointImgSrcLtXsDirective;
  })(flexLayout.ImgSrcDirective);
  BreakpointImgSrcLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[imgSrc.lt-xs]',
          inputs: imgInputs$2
        }
      ]
    }
  ];
  var BreakpointFlexLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexLtXsDirective, _super);
    function BreakpointFlexLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexInputs$2;
      return _this;
    }
    return BreakpointFlexLtXsDirective;
  })(flexLayout.FlexDirective);
  BreakpointFlexLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlex.lt-xs]',
          inputs: flexInputs$2
        }
      ]
    }
  ];
  var BreakpointOrderLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointOrderLtXsDirective, _super);
    function BreakpointOrderLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = orderInputs$2;
      return _this;
    }
    return BreakpointOrderLtXsDirective;
  })(flexLayout.FlexOrderDirective);
  BreakpointOrderLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOrder.lt-xs]',
          inputs: orderInputs$2
        }
      ]
    }
  ];
  var BreakpointOffsetLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointOffsetLtXsDirective, _super);
    function BreakpointOffsetLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = offsetInputs$2;
      return _this;
    }
    return BreakpointOffsetLtXsDirective;
  })(flexLayout.FlexOffsetDirective);
  BreakpointOffsetLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOffset.lt-xs]',
          inputs: offsetInputs$2
        }
      ]
    }
  ];
  var BreakpointFlexAlignLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexAlignLtXsDirective, _super);
    function BreakpointFlexAlignLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexAlignInputs$2;
      return _this;
    }
    return BreakpointFlexAlignLtXsDirective;
  })(flexLayout.FlexAlignDirective);
  BreakpointFlexAlignLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexAlign.lt-xs]',
          inputs: flexAlignInputs$2
        }
      ]
    }
  ];
  var BreakpointFillLtXsDirective = /** @class */ (function (_super) {
    __extends(BreakpointFillLtXsDirective, _super);
    function BreakpointFillLtXsDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = fillInputs$2;
      return _this;
    }
    return BreakpointFillLtXsDirective;
  })(flexLayout.FlexFillDirective);
  BreakpointFillLtXsDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexFill.lt-xs]',
          inputs: fillInputs$2
        }
      ]
    }
  ];

  var hideInputs$3 = ['fxHide.gt-xl'];
  var showInputs$3 = ['fxShow.gt-xl'];
  var classInputs$3 = ['ngClass.gt-xl'];
  var styleInputs$3 = ['ngStyle.gt-xl'];
  var imgInputs$3 = ['imgSrc.gt-xl'];
  var flexInputs$3 = ['fxFlex.gt-xl'];
  var orderInputs$3 = ['fxFlexOrder.gt-xl'];
  var offsetInputs$3 = ['fxFlexOffset.gt-xl'];
  var flexAlignInputs$3 = ['fxFlexAlign.gt-xl'];
  var fillInputs$3 = ['fxFlexFill.gt-xl', 'fxFill.gt-xl'];
  var BreakpointHideGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointHideGtXlDirective, _super);
    function BreakpointHideGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = hideInputs$3;
      return _this;
    }
    return BreakpointHideGtXlDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointHideGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxHide.gt-xl]',
          inputs: hideInputs$3
        }
      ]
    }
  ];
  var BreakpointShowGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointShowGtXlDirective, _super);
    function BreakpointShowGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = showInputs$3;
      return _this;
    }
    return BreakpointShowGtXlDirective;
  })(flexLayout.ShowHideDirective);
  BreakpointShowGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxShow.gt-xl]',
          inputs: showInputs$3
        }
      ]
    }
  ];
  var BreakpointClassGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointClassGtXlDirective, _super);
    function BreakpointClassGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = classInputs$3;
      return _this;
    }
    return BreakpointClassGtXlDirective;
  })(flexLayout.ClassDirective);
  BreakpointClassGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngClass.gt-xl]',
          inputs: classInputs$3
        }
      ]
    }
  ];
  var BreakpointStyleGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointStyleGtXlDirective, _super);
    function BreakpointStyleGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = styleInputs$3;
      return _this;
    }
    return BreakpointStyleGtXlDirective;
  })(flexLayout.StyleDirective);
  BreakpointStyleGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[ngStyle.gt-xl]',
          inputs: styleInputs$3
        }
      ]
    }
  ];
  var BreakpointImgSrcGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointImgSrcGtXlDirective, _super);
    function BreakpointImgSrcGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = imgInputs$3;
      return _this;
    }
    return BreakpointImgSrcGtXlDirective;
  })(flexLayout.ImgSrcDirective);
  BreakpointImgSrcGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[imgSrc.gt-xl]',
          inputs: imgInputs$3
        }
      ]
    }
  ];
  var BreakpointFlexGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexGtXlDirective, _super);
    function BreakpointFlexGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexInputs$3;
      return _this;
    }
    return BreakpointFlexGtXlDirective;
  })(flexLayout.FlexDirective);
  BreakpointFlexGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlex.gt-xl]',
          inputs: flexInputs$3
        }
      ]
    }
  ];
  var BreakpointOrderGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointOrderGtXlDirective, _super);
    function BreakpointOrderGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = orderInputs$3;
      return _this;
    }
    return BreakpointOrderGtXlDirective;
  })(flexLayout.FlexOrderDirective);
  BreakpointOrderGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOrder.gt-xl]',
          inputs: orderInputs$3
        }
      ]
    }
  ];
  var BreakpointOffsetGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointOffsetGtXlDirective, _super);
    function BreakpointOffsetGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = offsetInputs$3;
      return _this;
    }
    return BreakpointOffsetGtXlDirective;
  })(flexLayout.FlexOffsetDirective);
  BreakpointOffsetGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexOffset.gt-xl]',
          inputs: offsetInputs$3
        }
      ]
    }
  ];
  var BreakpointFlexAlignGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointFlexAlignGtXlDirective, _super);
    function BreakpointFlexAlignGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = flexAlignInputs$3;
      return _this;
    }
    return BreakpointFlexAlignGtXlDirective;
  })(flexLayout.FlexAlignDirective);
  BreakpointFlexAlignGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexAlign.gt-xl]',
          inputs: flexAlignInputs$3
        }
      ]
    }
  ];
  var BreakpointFillGtXlDirective = /** @class */ (function (_super) {
    __extends(BreakpointFillGtXlDirective, _super);
    function BreakpointFillGtXlDirective() {
      var _this = _super.apply(this, __spread(arguments)) || this;
      _this.inputs = fillInputs$3;
      return _this;
    }
    return BreakpointFillGtXlDirective;
  })(flexLayout.FlexFillDirective);
  BreakpointFillGtXlDirective.decorators = [
    {
      type: core.Directive,
      args: [
        {
          selector: '[fxFlexFill.gt-xl]',
          inputs: fillInputs$3
        }
      ]
    }
  ];

  var DmgLayoutModule = /** @class */ (function () {
    function DmgLayoutModule() {}
    return DmgLayoutModule;
  })();
  DmgLayoutModule.decorators = [
    {
      type: core.NgModule,
      args: [
        {
          declarations: [
            BreakpointHideXxlDirective,
            BreakpointShowXxlDirective,
            BreakpointClassXxlDirective,
            BreakpointStyleXxlDirective,
            BreakpointImgSrcXxlDirective,
            BreakpointFlexXxlDirective,
            BreakpointOrderXxlDirective,
            BreakpointOffsetXxlDirective,
            BreakpointFlexAlignXxlDirective,
            BreakpointFillXxlDirective,
            BreakpointHideXxsDirective,
            BreakpointShowXxsDirective,
            BreakpointClassXxsDirective,
            BreakpointStyleXxsDirective,
            BreakpointImgSrcXxsDirective,
            BreakpointFlexXxsDirective,
            BreakpointOrderXxsDirective,
            BreakpointOffsetXxsDirective,
            BreakpointFlexAlignXxsDirective,
            BreakpointFillXxsDirective,
            BreakpointFillLtXsDirective,
            BreakpointHideLtXsDirective,
            BreakpointShowLtXsDirective,
            BreakpointClassLtXsDirective,
            BreakpointStyleLtXsDirective,
            BreakpointImgSrcLtXsDirective,
            BreakpointFlexLtXsDirective,
            BreakpointOrderLtXsDirective,
            BreakpointOffsetLtXsDirective,
            BreakpointFlexAlignLtXsDirective,
            BreakpointFillGtXlDirective,
            BreakpointHideGtXlDirective,
            BreakpointShowGtXlDirective,
            BreakpointClassGtXlDirective,
            BreakpointStyleGtXlDirective,
            BreakpointImgSrcGtXlDirective,
            BreakpointFlexGtXlDirective,
            BreakpointOrderGtXlDirective,
            BreakpointOffsetGtXlDirective,
            BreakpointFlexAlignGtXlDirective
          ],
          exports: [
            BreakpointHideXxlDirective,
            BreakpointShowXxlDirective,
            BreakpointClassXxlDirective,
            BreakpointStyleXxlDirective,
            BreakpointImgSrcXxlDirective,
            BreakpointFlexXxlDirective,
            BreakpointOrderXxlDirective,
            BreakpointOffsetXxlDirective,
            BreakpointFlexAlignXxlDirective,
            BreakpointFillXxlDirective,
            BreakpointHideXxsDirective,
            BreakpointShowXxsDirective,
            BreakpointClassXxsDirective,
            BreakpointStyleXxsDirective,
            BreakpointImgSrcXxsDirective,
            BreakpointFlexXxsDirective,
            BreakpointOrderXxsDirective,
            BreakpointOffsetXxsDirective,
            BreakpointFlexAlignXxsDirective,
            BreakpointFillXxsDirective,
            BreakpointFillLtXsDirective,
            BreakpointHideLtXsDirective,
            BreakpointShowLtXsDirective,
            BreakpointClassLtXsDirective,
            BreakpointStyleLtXsDirective,
            BreakpointImgSrcLtXsDirective,
            BreakpointFlexLtXsDirective,
            BreakpointOrderLtXsDirective,
            BreakpointOffsetLtXsDirective,
            BreakpointFlexAlignLtXsDirective,
            BreakpointFillGtXlDirective,
            BreakpointHideGtXlDirective,
            BreakpointShowGtXlDirective,
            BreakpointClassGtXlDirective,
            BreakpointStyleGtXlDirective,
            BreakpointImgSrcGtXlDirective,
            BreakpointFlexGtXlDirective,
            BreakpointOrderGtXlDirective,
            BreakpointOffsetGtXlDirective,
            BreakpointFlexAlignGtXlDirective
          ],
          providers: [CelosNextBreakPointsProvider]
        }
      ]
    }
  ];

  /*
   * Public API Surface of material-theme
   */

  /**
   * Generated bundle index. Do not edit.
   */

  exports.BreakpointClassGtXlDirective = BreakpointClassGtXlDirective;
  exports.BreakpointClassLtXsDirective = BreakpointClassLtXsDirective;
  exports.BreakpointClassXxlDirective = BreakpointClassXxlDirective;
  exports.BreakpointClassXxsDirective = BreakpointClassXxsDirective;
  exports.BreakpointFillGtXlDirective = BreakpointFillGtXlDirective;
  exports.BreakpointFillLtXsDirective = BreakpointFillLtXsDirective;
  exports.BreakpointFillXxlDirective = BreakpointFillXxlDirective;
  exports.BreakpointFillXxsDirective = BreakpointFillXxsDirective;
  exports.BreakpointFlexAlignGtXlDirective = BreakpointFlexAlignGtXlDirective;
  exports.BreakpointFlexAlignLtXsDirective = BreakpointFlexAlignLtXsDirective;
  exports.BreakpointFlexAlignXxlDirective = BreakpointFlexAlignXxlDirective;
  exports.BreakpointFlexAlignXxsDirective = BreakpointFlexAlignXxsDirective;
  exports.BreakpointFlexGtXlDirective = BreakpointFlexGtXlDirective;
  exports.BreakpointFlexLtXsDirective = BreakpointFlexLtXsDirective;
  exports.BreakpointFlexXxlDirective = BreakpointFlexXxlDirective;
  exports.BreakpointFlexXxsDirective = BreakpointFlexXxsDirective;
  exports.BreakpointHideGtXlDirective = BreakpointHideGtXlDirective;
  exports.BreakpointHideLtXsDirective = BreakpointHideLtXsDirective;
  exports.BreakpointHideXxlDirective = BreakpointHideXxlDirective;
  exports.BreakpointHideXxsDirective = BreakpointHideXxsDirective;
  exports.BreakpointImgSrcGtXlDirective = BreakpointImgSrcGtXlDirective;
  exports.BreakpointImgSrcLtXsDirective = BreakpointImgSrcLtXsDirective;
  exports.BreakpointImgSrcXxlDirective = BreakpointImgSrcXxlDirective;
  exports.BreakpointImgSrcXxsDirective = BreakpointImgSrcXxsDirective;
  exports.BreakpointOffsetGtXlDirective = BreakpointOffsetGtXlDirective;
  exports.BreakpointOffsetLtXsDirective = BreakpointOffsetLtXsDirective;
  exports.BreakpointOffsetXxlDirective = BreakpointOffsetXxlDirective;
  exports.BreakpointOffsetXxsDirective = BreakpointOffsetXxsDirective;
  exports.BreakpointOrderGtXlDirective = BreakpointOrderGtXlDirective;
  exports.BreakpointOrderLtXsDirective = BreakpointOrderLtXsDirective;
  exports.BreakpointOrderXxlDirective = BreakpointOrderXxlDirective;
  exports.BreakpointOrderXxsDirective = BreakpointOrderXxsDirective;
  exports.BreakpointShowGtXlDirective = BreakpointShowGtXlDirective;
  exports.BreakpointShowLtXsDirective = BreakpointShowLtXsDirective;
  exports.BreakpointShowXxlDirective = BreakpointShowXxlDirective;
  exports.BreakpointShowXxsDirective = BreakpointShowXxsDirective;
  exports.BreakpointStyleGtXlDirective = BreakpointStyleGtXlDirective;
  exports.BreakpointStyleLtXsDirective = BreakpointStyleLtXsDirective;
  exports.BreakpointStyleXxlDirective = BreakpointStyleXxlDirective;
  exports.BreakpointStyleXxsDirective = BreakpointStyleXxsDirective;
  exports.CELOSNEXT_BREAKPOINTS = CELOSNEXT_BREAKPOINTS;
  exports.CelosNextBreakPointsProvider = CelosNextBreakPointsProvider;
  exports.DmgLayoutModule = DmgLayoutModule;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=material-theme.umd.js.map
