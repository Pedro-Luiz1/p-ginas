/* ==========================================================================
   clientes.js — Comportamento da tela "Clientes" (Carnegie Imóveis)
   - Iniciais automáticas nos avatares (tabela + rodapé da sidebar)
   - Busca em tempo real na tabela
   - Ordenação por coluna (clique no cabeçalho)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Utilitário: gera iniciais a partir de um nome -------------- */

  function getInitials(fullName) {
    var parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  /* ---- Iniciais no rodapé da sidebar -------------------------------- */

  var sidebarUserName = document.querySelector('.sidebar__footer-user');
  var sidebarAvatar = document.querySelector('.sidebar__footer-avatar');
  if (sidebarUserName && sidebarAvatar) {
    sidebarAvatar.textContent = getInitials(sidebarUserName.textContent);
  }

  /* ---- Iniciais nos avatares da tabela ------------------------------ */

  document.querySelectorAll('[data-user-name]').forEach(function (nameEl) {
    var avatar = nameEl.closest('.table__user').querySelector('.table__user-avatar');
    if (avatar) {
      avatar.textContent = getInitials(nameEl.textContent);
    }
  });

  /* ---- Busca em tempo real na tabela ---------------------------------- */

  var searchInput = document.getElementById('clienteSearch');
  var tableBody = document.querySelector('.table__body');
  var emptyState = document.querySelector('.table__empty');
  var countLabel = document.querySelector('.table-section__count');
  var rows = tableBody ? Array.prototype.slice.call(tableBody.querySelectorAll('.table__row')) : [];
  var totalCount = rows.length;

  function updateCountLabel(visibleCount) {
    if (!countLabel) return;
    if (visibleCount === totalCount) {
      countLabel.textContent = totalCount + (totalCount === 1 ? ' cliente cadastrado' : ' clientes cadastrados');
    } else {
      countLabel.textContent = visibleCount + ' de ' + totalCount + ' clientes';
    }
  }

  function filterRows() {
    var query = (searchInput.value || '').trim().toLowerCase();
    var visibleCount = 0;

    rows.forEach(function (row) {
      var haystack = row.getAttribute('data-search') || row.textContent;
      var matches = haystack.toLowerCase().indexOf(query) !== -1;
      row.classList.toggle('table__row--hidden', !matches);
      if (matches) visibleCount++;
    });

    if (emptyState) {
      emptyState.classList.toggle('table__empty--visible', visibleCount === 0);
    }

    updateCountLabel(visibleCount);
  }

  if (searchInput && tableBody) {
    searchInput.addEventListener('input', filterRows);
    updateCountLabel(totalCount);
  }

  /* ---- Ordenação por coluna -------------------------------------------- */

  var sortableHeaders = document.querySelectorAll('.table__cell--sortable');

  sortableHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      var key = header.getAttribute('data-sort-key');
      var currentDir = header.getAttribute('data-sort-dir');
      var newDir = currentDir === 'asc' ? 'desc' : 'asc';

      sortableHeaders.forEach(function (h) { h.removeAttribute('data-sort-dir'); });
      header.setAttribute('data-sort-dir', newDir);

      var sorted = rows.slice().sort(function (a, b) {
        var aVal = (a.querySelector('[data-col="' + key + '"]') || {}).textContent || '';
        var bVal = (b.querySelector('[data-col="' + key + '"]') || {}).textContent || '';
        aVal = aVal.trim().toLowerCase();
        bVal = bVal.trim().toLowerCase();
        if (aVal < bVal) return newDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return newDir === 'asc' ? 1 : -1;
        return 0;
      });

      sorted.forEach(function (row) { tableBody.appendChild(row); });
    });
  });

});
