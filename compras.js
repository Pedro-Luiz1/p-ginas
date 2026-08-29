/* ==========================================================================
   compras.js — Comportamento da tela "Compras" (Carnegie Imóveis)
   - Iniciais automáticas no rodapé da sidebar
   - Busca em tempo real na tabela "Todas as compras"
   - Ordenação por coluna (clique no cabeçalho)
   - Favoritar item para recompra (estrela)
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

  /* ---- Favoritar item para recompra ---------------------------------- */
  /* Marca visualmente a linha e o botão; pode futuramente persistir via API. */

  document.querySelectorAll('.favorite-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isActive = btn.classList.toggle('favorite-btn--active');
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.title = isActive ? 'Remover dos favoritos' : 'Favoritar para recompra';

      var row = btn.closest('.table__row');
      if (row) {
        row.classList.toggle('table__row--favorited', isActive);
      }
    });
  });

  /* ---- Busca em tempo real na tabela "Todas as compras" -------------- */

  var searchInput = document.getElementById('compraSearch');
  var tableBody = document.getElementById('comprasBody');
  var emptyState = document.querySelector('.table__empty');
  var countLabel = document.getElementById('comprasCount');
  var rows = tableBody ? Array.prototype.slice.call(tableBody.querySelectorAll('.table__row')) : [];
  var totalCount = rows.length;

  function updateCountLabel(visibleCount) {
    if (!countLabel) return;
    if (visibleCount === totalCount) {
      countLabel.textContent = totalCount + (totalCount === 1 ? ' compra registrada' : ' compras registradas');
    } else {
      countLabel.textContent = visibleCount + ' de ' + totalCount + ' compras';
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

  /* ---- Contagem de pendentes ------------------------------------------ */

  var pendentesBody = document.getElementById('pendentesBody');
  var pendentesCount = document.getElementById('pendentesCount');
  if (pendentesBody && pendentesCount) {
    var total = pendentesBody.querySelectorAll('.table__row').length;
    pendentesCount.textContent = total + (total === 1 ? ' compra pendente' : ' compras pendentes');
  }

  /* ---- Ordenação por coluna (tabela "Todas as compras") --------------- */

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
