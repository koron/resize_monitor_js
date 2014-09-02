/*!
 * Reisze Monitor JavaScript Library v0.1
 *
 * Copyright 2014 MURAOKA Taro (a.k.a. KoRoN)
 * Released under the MIT license
 */

(function(global) {
  var monitor;
  var undef = (void 0);

  function Size(el) {
    var r;
    if (el == undef || el['getBoundingClientRect'] === undef) {
      this.valid = false;
      this.width = -1;
      this.height = -1;
      return this;
    }
    r = el.getBoundingClientRect();
    this.valid = true;
    this.width = r.width;
    this.height = r.height;
    return this;
  }

  Size.prototype.equals = function(o) {
    if (!this.valid || !o.valid) {
      return false;
    }
    return (this.width === o.width && this.height === o.height);
  };

  function Monitor() {
    this._delay = 100;
    this._monitors = [];
  }

  Monitor.prototype.setDelay = function(v) {
    this._delay = v;
  };

  Monitor.prototype._install = function(target) {
    var _this = this;
    this.installedOnResize = function(e) {
      _this._onResize(e);
    };
    target.addEventListener('resize', this.installedOnResize);
  };

  Monitor.prototype._onResize = function(e) {
    var _this = this;
    if (_this._timeoutId !== undef) {
      clearTimeout(_this._timeoutId);
    }
    this._timeoutId = setTimeout(function() {
      delete _this._timeoutId;
      _this._emit(e);
    }, this._delay);
  };

  Monitor.prototype._emit = function(e) {
    var i, target, currSize;
    if (this._monitors.length == 0) {
      return;
    }

    // Check size for monitors.
    for (i = 0; i < this._monitors.length; ++i) {
      target = this._monitors[i];
      currSize = new Size(target.el);
      if (!target.size.equals(currSize)) {
        target.size = currSize;
        target.func({
          width: currSize.width,
          height: currSize.height,
          currentTarget: target.el,
          target: e.target,
          timeStamp: e.timeStamp,
          type: "resize"
        });
      }
    }
  };

  Monitor.prototype.startMonitor = function(el, func) {
    var d;
    if (func === undef) {
      func = el;
      el = null;
    }
    if (typeof func !== 'function') {
      throw 'no monitor function';
    }
    d = { el: el, func: func, size: new Size(el) };
    this._monitors.push(d);
  };

  Monitor.prototype.stopMonitor = function(el_or_func, func) {
    var is_match, i, target;

    // Detemine filter function.
    if (el_or_func === undef && func === undef) {
      throw 'no monitor specified';
    }
    if (el_or_func !== undef && func !== undef) {
      is_match = function(item) {
        return (item.el === el_or_func && item.func === func);
      };
    } else {
      if (el_or_func == undef) {
        el_or_func = func;
      }
      is_match = function(item) {
        return (item.el === el_or_func || item.func === el_or_func);
      };
    }

    // Remove matching monitors from this._monitors.
    for (i = 0; i < this._monitors.length; ++i) {
      target = this._monitors[i];
      if (is_match(target)) {
        this._monitors.splice(i, 1);
        --i;
      }
    }
  };

  Monitor.prototype.clearMonitors = function() {
    this._monitors = [];
  }

  monitor = new Monitor();
  monitor._install(global);

  global.ResizeMonitor = monitor;
})(window);
