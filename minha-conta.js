/* ==========================================================================
   minha-conta.js — Comportamento da tela "Minha Conta" (Carnegie Imóveis)
   - Iniciais automáticas no avatar do rodapé da sidebar
   - Mostrar/ocultar senha nos 3 campos de senha (atual, nova, confirmar)
   - Feedback simples ao salvar cada bloco (Meus Dados / Segurança / Empresa)
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

  /* ---- Mostrar / ocultar senha (funciona para qualquer quantidade de
     campos, identificados por [data-senha-toggle]) --------------------- */

  document.querySelectorAll('[data-senha-toggle]').forEach(function (toggleBtn) {
    var inputId = toggleBtn.getAttribute('data-senha-toggle');
    var senhaInput = document.getElementById(inputId);
    if (!senhaInput) return;

    var eyeOpen = toggleBtn.querySelector('.icon-eye-open');
    var eyeClosed = toggleBtn.querySelector('.icon-eye-closed');

    toggleBtn.addEventListener('click', function () {
      var isPassword = senhaInput.type === 'password';
      senhaInput.type = isPassword ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  });

  /* ---- Envio dos formulários (Meus Dados / Segurança / Empresa) ------ */

  var forms = ['formMeusDados', 'formSeguranca', 'formEmpresa'];

  forms.forEach(function (formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (formId === 'formSeguranca') {
        var novaSenha = document.getElementById('novaSenha').value;
        var confirmarSenha = document.getElementById('confirmarSenha').value;

        if (novaSenha || confirmarSenha) {
          if (novaSenha !== confirmarSenha) {
            alert('A nova senha e a confirmação não coincidem.');
            return;
          }
        }
      }

      // Aqui entraria a chamada para salvar os dados no backend.
      console.log('Formulário "' + formId + '" enviado.');
    });
  });

});
