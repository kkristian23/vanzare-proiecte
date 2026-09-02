function getOnboardingGoogleButtonMarkup() {
  return [
    '<button id="onboardingGoogleSignInBtn" class="google-auth-button" onclick="handleOnboardingGoogleSignIn()">',
    '  <span class="google-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M23.6 12.3c0-.9-.1-1.8-.3-2.7H12v5.1h6.4c-.3 1.7-1.4 3.2-2.9 4.1v3.4h4.7c2.7-2.5 4.3-6.1 4.3-10z"/><path fill="#34A853" d="M12 24c3.5 0 6.5-1.2 8.7-3.4l-4.7-3.4c-1.3.9-2.9 1.4-4 1.4-3.1 0-5.7-2.1-6.6-5.1H1.7v3.2C3.9 21.8 7.7 24 12 24z"/><path fill="#4A90E2" d="M5.4 14.5c-.3-.9-.5-1.8-.5-2.5s.2-1.6.5-2.5V6.3H1.7C.6 8.1 0 10 0 12s.6 3.9 1.7 5.7l3.7-3.2z"/><path fill="#FBBC05" d="M12 4.8c1.9 0 3.5.7 4.8 2.1l3.6-3.6C18.5 1 15.5 0 12 0 7.7 0 3.9 2.2 1.7 5.8l3.7 3.2C6.3 7 8.9 4.8 12 4.8z"/></svg></span>',
    '  <span>Sign in with Google</span>',
    '</button>'
  ].join('');
}

function ensureOnboardingViews() {
  if (!document.getElementById('onboardingModal')) {
    document.body.insertAdjacentHTML('beforeend', [
      '<div id="onboardingModal" class="modal hidden" data-backdrop-close="false">',
      '  <div class="modal-content onboarding-card">',
      '    <h2 class="modal-title" data-i18n="onboardingTitle">Bine ai venit! 💘</h2>',
      '    <p class="modal-subtitle">Conecteaza-te cu Google ID pentru a continua.</p>',
           getOnboardingGoogleButtonMarkup(),
      '  </div>',
      '</div>'
    ].join(''));
  }

  if (!document.getElementById('telegramOptInModal')) {
    document.body.insertAdjacentHTML('beforeend', [
      '<div id="telegramOptInModal" class="modal hidden">',
      '  <div class="modal-content onboarding-card">',
      '    <h2 class="modal-title">Notificari Telegram</h2>',
      '    <p class="modal-subtitle">Vrei sa primesti notificari in Telegram?</p>',
      '    <div class="modal-actions-row">',
      '      <button class="main" id="telegramOptInYesBtn">Da</button>',
      '      <button class="secondary" id="telegramOptInNoBtn">Nu</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join(''));
  }
}