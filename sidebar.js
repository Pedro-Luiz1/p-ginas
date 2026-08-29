/* ==========================================================================
   sidebar.js — Comportamento da sidebar (Carnegie Imóveis)
   - Abre/fecha cada grupo (Comercial, Compras & Estoque, Projetos, Administração)
   - Abre/fecha o menu do rodapé (três barrinhas) com Notificações e Sair
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Grupos do menu (accordion) --------------------------------- */

  var toggles = document.querySelectorAll('.sidebar__section-toggle');

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var list = toggle.nextElementSibling;
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';

      toggle.setAttribute('aria-expanded', String(!isOpen));
      list.classList.toggle('sidebar__list--open', !isOpen);
    });
  });

  /* ---- Menu do rodapé (três barrinhas) ------------------------------ */

  var menuBtn = document.getElementById('sidebarFooterMenuBtn');
  var menuPanel = document.getElementById('sidebarFooterMenu');

  if (menuBtn && menuPanel) {
    menuBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = menuPanel.classList.contains('sidebar__footer-menu--open');
      menuPanel.classList.toggle('sidebar__footer-menu--open', !isOpen);
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', function (event) {
      if (!menuPanel.contains(event.target) && event.target !== menuBtn) {
        menuPanel.classList.remove('sidebar__footer-menu--open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

});
