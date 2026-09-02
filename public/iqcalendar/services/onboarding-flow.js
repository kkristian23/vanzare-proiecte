async function handleOnboardingGoogleSignIn() {
  const btn = document.getElementById('onboardingGoogleSignInBtn');
  if (btn) btn.disabled = true;
  try {
    signInWithGoogle();
  } finally {
    setTimeout(() => {
      if (btn) btn.disabled = false;
    }, 1200);
  }
}

function waitForGoogleAuthentication() {
  return new Promise((resolve) => {
    try {
      if (isFirebaseAvailable() && firebase.auth && firebase.auth().currentUser) {
        resolve(true);
        return;
      }

      if (!isFirebaseAvailable() || !firebase.auth) {
        resolve(false);
        return;
      }

      const unsubscribe = firebase.auth().onAuthStateChanged((fbUser) => {
        if (fbUser) {
          unsubscribe();
          resolve(true);
        }
      });
    } catch (err) {
      console.error('waitForGoogleAuthentication error', err);
      resolve(false);
    }
  });
}

function askTelegramOptIn() {
  return new Promise((resolve) => {
    const modal = document.getElementById('telegramOptInModal');
    const yesBtn = document.getElementById('telegramOptInYesBtn');
    const noBtn = document.getElementById('telegramOptInNoBtn');

    if (!modal || !yesBtn || !noBtn) {
      resolve(false);
      return;
    }

    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    const cleanup = () => {
      yesBtn.removeEventListener('click', onYes);
      noBtn.removeEventListener('click', onNo);
      modal.classList.add('hidden');
      if (!document.querySelector('.modal:not(.hidden)')) {
        document.body.classList.remove('modal-open');
      }
    };

    const onYes = async () => {
      cleanup();
      localStorage.setItem('telegramOptInChoice', 'yes');
      try {
        await startTelegramLinkFlow();
      } catch (err) {
        console.error('Telegram connect flow error', err);
      }
      resolve(true);
    };

    const onNo = () => {
      cleanup();
      localStorage.setItem('telegramOptInChoice', 'no');
      resolve(false);
    };

    yesBtn.addEventListener('click', onYes);
    noBtn.addEventListener('click', onNo);
  });
}

async function runGoogleOnboarding(options = {}) {
  const { onReady } = options;

  ensureOnboardingViews();

  const wasFirstLogin = isFirstLogin();

  if (typeof ensureCurrentUserProfileLoaded === 'function') {
    await ensureCurrentUserProfileLoaded();
  }

  let authenticatedUser = null;
  try {
    authenticatedUser = isFirebaseAvailable() && firebase.auth
      ? firebase.auth().currentUser
      : null;
  } catch (_) {}

  const onboardingModal = document.getElementById('onboardingModal');

  // Local profile data never bypasses Google authentication.
  if (!authenticatedUser) {
    if (!onboardingModal) return;
    onboardingModal.classList.remove('hidden');
    document.body.classList.add('modal-open');

    const isAuthenticated = await waitForGoogleAuthentication();
    if (!isAuthenticated) return;

    try {
      authenticatedUser = firebase.auth().currentUser;
    } catch (_) {}
    if (!authenticatedUser) return;
  }

  if (typeof ensureCurrentUserProfileLoaded === 'function') {
    await ensureCurrentUserProfileLoaded();
  }

  if (onboardingModal) onboardingModal.classList.add('hidden');

  if (typeof ensureMandatoryNicknameForCurrentUser === 'function') {
    const nicknameReady = await ensureMandatoryNicknameForCurrentUser();
    if (!nicknameReady) return;
  }

  if (wasFirstLogin && !hasStoredTelegramChatId(currentUser)) {
    await askTelegramOptIn();
  }

  if (typeof onReady === 'function') {
    onReady();
  }
}
