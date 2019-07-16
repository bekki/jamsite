(function() {
  function SongTable(table, nav) {
    this.init(table, nav);
  }

  SongTable.prototype = {
    init: function(table, nav) {
      var that = this;
      that.table = table;
      that.nav = nav;
      this.currentMode = null;
      this.touchTimer = null;
      this.touchTr = null;
      this.uuidToRow = null;

      table.addEventListener(
        'touchstart',
        function(e) {
          var tr = that._getTr(e);
          that.touchTr = tr;
          that.touchTimer = setTimeout(function() { that.touchTimerFired(); }, 200);
        },
        false
      );

      table.addEventListener(
        'touchend',
        function(e) {
          var tr = that.touchTr;
          if (tr) {
            tr.classList.add('selected');
            window.location = tr.getAttribute('data-download-link');
          }
          that.touchTr = null;
        },
        false
      );

      table.addEventListener(
        'touchmove',
        function(e) {
          that.cancelTouch();
        },
        false
      );

      table.addEventListener(
        'touchcancel',
        function(e) {
          that.cancelTouch();
        },
        false
      );

      table.addEventListener(
        'click',
        function(e) {
          var tr = that._getTr(e);
          if (!mobileAndTabletcheck()) {
            window.location = tr.getAttribute('data-view-link');
          }
        },
        false
      );

      this._getNavItem('title').addEventListener(
        'click',
        function(e) { that.sort('title'); },
        false
      );
      this._getNavItem('artist').addEventListener(
        'click',
        function(e) { that.sort('artist'); },
        false
      );
      this._getNavItem('year').addEventListener(
        'click',
        function(e) { that.sort('year'); },
        false
      );
    },

    touchTimerFired: function() {
      if (this.touchTr) {
        this.touchTr.classList.add('selected');
      }
    },

    cancelTouch: function() {
      this.touchTr = null;
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
        this.touchTimer = null;
      }
      this.clearRowSelection();
    },

    clearRowSelection: function() {
      for (var i = 0; i < this.table.tBodies[0].rows.length; i++) {
        var row = this.table.tBodies[0].rows[i];
        row.classList.remove('selected');
      }
    },

    sort: function(type) {
      var toKey;
      if (type == 'title') {
        toKey = function(c) { return [c[0], c[1], c[2]]; }
      } else if (type == 'artist') {
        toKey = function(c) { return [c[1], c[0], c[2]]; }
      } else {
        toKey = function(c) { return [c[2], c[1], c[0]]; }
      }

      var rowData = [];
      for (var i = 0; i < this.table.tBodies[0].rows.length; i++) {
        var row = this.table.tBodies[0].rows[i];
        var get_cell_value = function(idx) {
          return row.cells[idx].getAttribute('data-sort') || row.cells[idx].textContent;
        }
        var cellsValues = [
          get_cell_value(0),
          get_cell_value(1),
          get_cell_value(2)
        ];
        rowData.push({
          tr: row,
          key: toKey(cellsValues)
        });
      }

      rowData.sort(function(a, b) {
        return a['key'][0].localeCompare(b['key'][0]) ||
          a['key'][1].localeCompare(b['key'][1]) ||
          a['key'][2].localeCompare(b['key'][2]);
      });

      for (var i = 0; i < rowData.length; i++) {
        this.table.tBodies[0].appendChild(rowData[i]['tr']);
      }

      if (this.currentMode) {
        this._getNavItem(this.currentMode).classList.remove('selected');
      }
      this._getNavItem(type).classList.add('selected');
      this.currentMode = type;
      window.scrollTo(0, 0);
    },

    showRows: function(uuids) {
      var u = new Set(uuids);
      for (var i = 0; i < this.table.tBodies[0].rows.length; i++) {
        var row = this.table.tBodies[0].rows[i];
        row.style.display = u.has(row.id) ? 'block' : 'none';
      }
    },

    showAllRows: function() {
      for (var i = 0; i < this.table.tBodies[0].rows.length; i++) {
        var row = this.table.tBodies[0].rows[i];
        row.style.display = 'block';
      }
    },

    _getNavItem: function(name) {
      return this.nav.getElementsByClassName(name)[0];
    },

    _getTr: function(e) {
      return e.target.parentElement;
    },

    _getUuidToRow: function() {
      for (var i = 0; i < this.table.tBodies[0].rows.length; i++) {
      }
    }
  }

  window.SongTable = SongTable;
})();
