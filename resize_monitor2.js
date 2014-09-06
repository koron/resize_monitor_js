/*!
 * Reisze Monitor 2 - v0.1
 *
 * Copyright 2014 MURAOKA Taro (a.k.a. KoRoN)
 * Released under the MIT license
 */

(function(g) {

var UNDEF = (void 0);
var setInterval = g.setInterval;
var clearInterval = g.clearInterval;

function Size(el) {
  var r;
  if (el == UNDEF || el['getBoundingClientRect'] === UNDEF) {
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

Size.prototype = {
  equals: function(o) {
    if (!this.valid || !o.valid) {
      return false;
    }
    return (this.width === o.width && this.height === o.height);
  }
};

function Monitor() {
  this._targets = [];
  this._interval = 250;
  this._delay = 500;
  this._updateInterval();
  this._intervalId = null;

  this._onInterval = this._checkTargets.bind(this);
}

Monitor.prototype = {
  addTarget: function(el, func) {
    // Check arguments.
    if (el == UNDEF) {
      throw 'no elements specified';
    } else if (func == UNDEF || typeof func !== 'function') {
      throw 'no functions specified';
    }
    this._targets.push({
      el: el,
      func: func,
      size: new Size(el),
      notify_at: 0,
      notified: true
    });
    this._updateInterval();
  },

  removeTarget: function(el_or_func, func) {
    var is_match, i, t;
    // Check arguments.
    if (el_or_func == UNDEF && func == UNDEF) {
      throw 'need an element or a function to be deleted';
    }
    // Detemine is_match function.
    if (el_or_func != UNDEF && func != UNDEF) {
      is_match = function(item) {
        return (item.el === el_or_func && item.func === func);
      }
    } else {
      if (el_or_func == UNDEF) {
        el_or_func = func;
      }
      is_match = function(item) {
        return (item.el === el_or_func || item.func === el_or_func);
      };
    }
    // Remove matching targets.
    for (i = 0; i < this._targets.length; ++i) {
      t = this._targets[i];
      if (is_match(t)) {
        this._targets.splice(i, 1);
        --i;
      }
    }
    this._updateInterval();
  },

  clearAllTargets: function() {
    this._targets = [];
    this._updateInterval();
  },

  _updateInterval: function() {
    if (this._targets.length > 0) {
      this._setInterval();
    } else {
      this._clearInterval();
    }
  },

  _setInterval: function() {
    if (this._intervalId == UNDEF) {
      this._intervalId = setInterval(this._onInterval);
    }
  },

  _clearInterval: function() {
    if (this._intervalId != UNDEF) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  },

  _checkTargets: function() {
    var i, t, now, sz;
    now = Date.now();
    for (i = 0; i < this._targets.length; ++i) {
      t = this._targets[i];
      // Check size change.
      sz = new Size(t.el);
      if (!t.size.equals(sz)) {
        t.size = sz;
        t.notify_at = now + this._delay;
        t.notified = false;
      }
      // Check notification.
      if (!t.notified && t.notify_at <= now) {
        t.notified = true;
        t.func({
          width: sz.width,
          height: sz.height,
          currentTarget: t.el,
          target: t.el,
          timeStamp: now,
          type: "resize"
        });
      }
    }
  },

  setInterval: function(val) {
    this._interval = val;
    this._clearInterval();
    this._updateInterval();
  },

  setDelay: function(val) {
    this._delay = val;
  }
};

g.ResizeMonitor2 = new Monitor();

})(this);
