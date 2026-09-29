(function () {
  var NUMERIC = { year: true, ask: true, trade: true, delta: true };
  var table = document.getElementById("deals");
  if (!table) return;

  var tbody = table.tBodies[0];
  var rows = Array.prototype.slice.call(tbody.rows);
  var yearSelect = document.getElementById("filter-year");
  var mfrSelect = document.getElementById("filter-manufacturer");
  var modelSelect = document.getElementById("filter-model");
  var status = document.getElementById("filter-status");
  var form = document.getElementById("filters");

  var sortKey = "delta";
  var sortDir = "asc";

  function selected(select) {
    return select.value;
  }

  function unique(list, key) {
    var seen = {};
    var out = [];
    list.forEach(function (row) {
      var value = row.dataset[key];
      if (value && !seen[value]) {
        seen[value] = true;
        out.push(value);
      }
    });
    out.sort(function (a, b) {
      if (NUMERIC[key]) return Number(a) - Number(b);
      return a.localeCompare(b);
    });
    return out;
  }

  function fillSelect(select, values, current) {
    select.innerHTML = "";
    var all = document.createElement("option");
    all.value = "";
    all.textContent = "All";
    select.appendChild(all);
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
    select.value = values.indexOf(current) === -1 ? "" : current;
  }

  function matching(ignore) {
    var year = ignore === "year" ? "" : selected(yearSelect);
    var mfr = ignore === "manufacturer" ? "" : selected(mfrSelect);
    var model = ignore === "model" ? "" : selected(modelSelect);
    return rows.filter(function (row) {
      if (year && row.dataset.year !== year) return false;
      if (mfr && row.dataset.manufacturer !== mfr) return false;
      if (model && row.dataset.model !== model) return false;
      return true;
    });
  }

  function refreshFilterOptions() {
    var yearVal = selected(yearSelect);
    var mfrVal = selected(mfrSelect);
    var modelVal = selected(modelSelect);
    fillSelect(yearSelect, unique(matching("year"), "year"), yearVal);
    fillSelect(mfrSelect, unique(matching("manufacturer"), "manufacturer"), mfrVal);
    fillSelect(modelSelect, unique(matching("model"), "model"), modelVal);
  }

  function numericValue(row, key) {
    var raw = row.dataset[key];
    if (raw === "" || raw == null) return null;
    return Number(raw);
  }

  function compare(a, b) {
    var dir = sortDir === "asc" ? 1 : -1;
    if (NUMERIC[sortKey]) {
      var av = numericValue(a, sortKey);
      var bv = numericValue(b, sortKey);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av === bv) return 0;
      return av < bv ? -dir : dir;
    }
    return a.dataset[sortKey].localeCompare(b.dataset[sortKey]) * dir;
  }

  function updateSortHeaders() {
    var headers = table.tHead.rows[0].cells;
    Array.prototype.forEach.call(headers, function (th) {
      var key = th.getAttribute("data-sort");
      if (!key) {
        th.removeAttribute("aria-sort");
        return;
      }
      th.setAttribute("aria-sort", key === sortKey ? (sortDir === "asc" ? "ascending" : "descending") : "none");
    });
  }

  function apply() {
    var visible = matching();
    visible.sort(compare);
    rows.forEach(function (row) {
      row.hidden = visible.indexOf(row) === -1;
    });
    visible.forEach(function (row) {
      tbody.appendChild(row);
    });
    if (status) {
      status.textContent = "Showing " + visible.length + " of " + rows.length + " rows";
    }
    updateSortHeaders();
  }

  table.tHead.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    var th = button.parentElement;
    var key = th.getAttribute("data-sort");
    if (!key) return;
    if (sortKey === key) {
      sortDir = sortDir === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortDir = "asc";
    }
    apply();
  });

  form.addEventListener("change", function () {
    refreshFilterOptions();
    apply();
  });

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      refreshFilterOptions();
      apply();
    }, 0);
  });

  refreshFilterOptions();
  apply();
})();
