(function () {
  const loadingByComponent = new WeakMap();
  let lastInteractionTarget = null;

  function rememberInteraction(event) {
    if (event.target instanceof Element) lastInteractionTarget = event.target;
  }

  document.addEventListener('pointerdown', rememberInteraction, true);
  document.addEventListener('keydown', rememberInteraction, true);
  document.addEventListener('submit', rememberInteraction, true);

  function getComponent(target) {
    const source = target instanceof Element ? target : lastInteractionTarget || document.activeElement;
    const selector = '.app-modal, .plan-card, .partner-request-row, .partner-row, form, .app-card, .card, main, #calendarPageRoot, #appPageRoot, #resultPageRoot';
    return source instanceof Element ? source.closest(selector) : null;
  }

  function showInComponent(message, target) {
    const component = getComponent(target);
    if (!component) return null;
    let state = loadingByComponent.get(component);
    if (!state) {
      const indicator = document.createElement('div');
      indicator.className = 'component-loading-indicator section-loader';
      indicator.setAttribute('role', 'status');
      indicator.setAttribute('aria-live', 'polite');
      indicator.innerHTML = '<span class="spinner" aria-hidden="true"></span><span class="loader-text component-loading-message"></span>';
      component.classList.add('component-loading-host');
      component.appendChild(indicator);
      state = { count: 0, indicator };
      loadingByComponent.set(component, state);
    }
    state.count += 1;
    const text = state.indicator.querySelector('.component-loading-message');
    if (text) text.textContent = message || 'Se încarcă…';
    state.indicator.classList.add('is-visible');
    return component;
  }

  function hideInComponent(component) {
    if (!component) return;
    const state = loadingByComponent.get(component);
    if (!state) return;
    state.count = Math.max(0, state.count - 1);
    if (state.count === 0) {
      state.indicator.remove();
      component.classList.remove('component-loading-host');
      loadingByComponent.delete(component);
    }
  }

  window.showGlobalLoading = function (message, target) {
    return showInComponent(message, target);
  };

  window.hideGlobalLoading = function (component) {
    hideInComponent(component);
  };

  window.withGlobalLoading = async function (operation, message, target) {
    const component = showInComponent(message, target);
    try {
      return await (typeof operation === 'function' ? operation() : operation);
    } finally {
      hideInComponent(component);
    }
  };

  function trackPromise(result, message, target) {
    if (!result || typeof result.then !== 'function') return result;
    const component = showInComponent(message, target);
    return Promise.resolve(result).finally(() => hideInComponent(component));
  }

  function wrapAsyncFunction(name, message) {
    const original = window[name];
    if (typeof original !== 'function' || original.__componentLoadingWrapped) return;
    const wrapped = function () {
      try {
        return trackPromise(original.apply(this, arguments), message, lastInteractionTarget);
      } catch (error) {
        throw error;
      }
    };
    wrapped.__componentLoadingWrapped = true;
    window[name] = wrapped;
  }

  if (typeof window.fetch === 'function') {
    const originalFetch = window.fetch.bind(window);
    window.fetch = function () {
      const fetchPromise = originalFetch.apply(this, arguments);
      const source = lastInteractionTarget;
      let component = null;
      const timer = window.setTimeout(() => { component = showInComponent('Se comunică cu serviciul…', source); }, 180);
      return Promise.resolve(fetchPromise).finally(() => {
        window.clearTimeout(timer);
        hideInComponent(component);
      });
    };
  }

  window.addEventListener('load', function () {
    [
      ['getAllUsersFromFirebase', 'Se încarcă utilizatorii…'],
      ['getAllPlanificationsFromFirestore', 'Se încarcă planificările…'],
      ['getPlanificationById', 'Se încarcă evenimentul…'],
      ['savePlanificationToFirestore', 'Se salvează evenimentul…'],
      ['updatePlanificationInFirestore', 'Se salvează modificările…'],
      ['deletePlanificationFromFirestore', 'Se șterge evenimentul…'],
      ['deleteAllPlanificationsFromFirestore', 'Se șterg planificările…'],
      ['getAllUsers', 'Se încarcă utilizatorii…'],
      ['sendPartnerRequestByNickname', 'Se trimite cererea…'],
      ['cancelSentPartnerRequest', 'Se anulează cererea…'],
      ['answerPartnerRequest', 'Se actualizează cererea…'],
      ['removeApprovedPartner', 'Se actualizează lista de prieteni…'],
      ['sendPartnerEventReminder', 'Se trimite reamintirea…'],
      ['editEntirePlanification', 'Se pregătește editarea…'],
      ['deletePlanification', 'Se șterge evenimentul…'],
      ['sendTelegramVersionBroadcastToProduction', 'Se trimite update-ul…'],
      ['startTelegramLinkFlow', 'Se conectează Telegram…'],
      ['enableTelegramNotifications', 'Se activează notificările…'],
      ['disconnectTelegramNotifications', 'Se deconectează Telegram…']
    ].forEach(([name, message]) => wrapAsyncFunction(name, message));
  });
})();
