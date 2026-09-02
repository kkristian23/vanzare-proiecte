const boundModalBackdrops = new WeakSet();
let settingsPartnerPresenceSubscriptions = [];

function clearSettingsPartnerPresenceSubscriptions() {
  settingsPartnerPresenceSubscriptions.forEach(({ ref, handler }) => {
    try { ref.off('value', handler); } catch (_) {}
  });
  settingsPartnerPresenceSubscriptions = [];
}

function subscribeToSettingsPartnerPresence(partners) {
  clearSettingsPartnerPresenceSubscriptions();
  partners.forEach(partner => {
    const ref = getUserProfileRef(partner.id, getCurrentDataScope()).child('presence');
    const handler = snapshot => {
      const online = snapshot.val()?.state === 'online';
      const status = Array.from(document.querySelectorAll('[data-friend-presence-id]'))
        .find(element => element.dataset.friendPresenceId === String(partner.id));
      if (!status) return;
      status.className = `friend-presence ${online ? 'online' : 'offline'}`;
      status.innerHTML = `<i aria-hidden="true"></i>${online ? 'Online acum' : 'Offline'}`;
    };
    ref.on('value', handler);
    settingsPartnerPresenceSubscriptions.push({ ref, handler });
  });
}

async function openSettings() {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;
  if (typeof buildLanguageSwitcher === 'function') buildLanguageSwitcher();
  if (typeof applyTranslations === 'function') applyTranslations();
  loadNotificationSettings();
  bindNotificationSettings();
  if (typeof refreshTelegramLinkStatus === 'function') {
    await refreshTelegramLinkStatus().catch(() => {});
  }
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setupModalBackdropClose(modal);
}

function openAppearanceModal() {
  closeModal('settingsModal');
  loadBackgroundEmojiSettings();
  bindBackgroundEmojiSettings();
  loadAppScaleSettings();
  bindAppScaleSettings();

  const modal = document.getElementById('appearanceModal');
  if (!modal) return;

  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setupModalBackdropClose(modal);
}

function loadNotificationSettings() {
  const selectedMinutes = typeof getNotificationLeadTime === 'function' ? getNotificationLeadTime() : 10;
  const radios = document.querySelectorAll('input[name="notificationLeadTime"]');
  radios.forEach(radio => {
    radio.checked = Number(radio.value) === Number(selectedMinutes);
  });
}

function bindNotificationSettings() {
  document.querySelectorAll('input[name="notificationLeadTime"]').forEach(radio => {
    radio.removeEventListener('change', notificationLeadTimeChanged);
    radio.addEventListener('change', notificationLeadTimeChanged);
  });
}

function notificationLeadTimeChanged(event) {
  const value = parseFloat(event.target.value);
  if (typeof setNotificationLeadTime === 'function') {
    setNotificationLeadTime(value);
  }
}

function loadBackgroundEmojiSettings() {
  const input = document.getElementById('backgroundEmojiInput');
  const saveBtn = document.getElementById('saveBackgroundEmojiBtn');
  if (!input) return;

  const emoji = (typeof getBackgroundStarEmoji === 'function')
    ? getBackgroundStarEmoji()
    : '⭐';
  input.value = emoji;
  input.dataset.savedEmoji = String(emoji || '');
  if (saveBtn) {
    saveBtn.classList.remove('is-active');
    saveBtn.setAttribute('aria-disabled', 'true');
  }
}

function bindBackgroundEmojiSettings() {
  const saveBtn = document.getElementById('saveBackgroundEmojiBtn');
  const input = document.getElementById('backgroundEmojiInput');
  if (!saveBtn || !input) return;

  saveBtn.onclick = saveBackgroundEmoji;
  input.oninput = updateBackgroundEmojiSaveState;
  input.onkeydown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (canSaveBackgroundEmoji()) {
        saveBackgroundEmoji();
      }
    }
  };

  updateBackgroundEmojiSaveState();
}

function updateBackgroundEmojiSaveState() {
  const saveBtn = document.getElementById('saveBackgroundEmojiBtn');
  const input = document.getElementById('backgroundEmojiInput');
  if (!saveBtn || !input) return;

  const normalized = String(input.value || '').trim();
  const saved = String(input.dataset.savedEmoji || '');
  const hasChanges = normalized !== saved;

  saveBtn.classList.toggle('is-active', hasChanges);
  saveBtn.setAttribute('aria-disabled', hasChanges ? 'false' : 'true');
}

function canSaveBackgroundEmoji() {
  const input = document.getElementById('backgroundEmojiInput');
  if (!input) return false;

  const normalized = String(input.value || '').trim();
  const saved = String(input.dataset.savedEmoji || '');
  return normalized !== saved;
}

function saveBackgroundEmoji() {
  const input = document.getElementById('backgroundEmojiInput');
  const saveBtn = document.getElementById('saveBackgroundEmojiBtn');
  if (!input) return;
  if (!canSaveBackgroundEmoji()) return;

  const emoji = String(input.value || '').trim();
  if (typeof setBackgroundStarEmoji === 'function') {
    setBackgroundStarEmoji(emoji);
  }
  input.value = emoji;
  input.dataset.savedEmoji = emoji;
  if (saveBtn) {
    saveBtn.classList.remove('is-active');
    saveBtn.setAttribute('aria-disabled', 'true');
  }

  const message = emoji
    ? 'Emoji-ul pentru stele a fost actualizat.'
    : 'Stelele din background au fost ascunse.';

  if (typeof showAlertApp === 'function') showAlertApp(message);
  else alert(message);
}

function loadAppScaleSettings() {
  const slider = document.getElementById('appScaleRange');
  const valueLabel = document.getElementById('appScaleValue');
  if (!slider || !valueLabel) return;

  const currentScale = (typeof getAppScalePercent === 'function')
    ? getAppScalePercent()
    : 95;

  slider.value = String(currentScale);
  valueLabel.textContent = `${currentScale}%`;
}

function bindAppScaleSettings() {
  const slider = document.getElementById('appScaleRange');
  const valueLabel = document.getElementById('appScaleValue');
  if (!slider || !valueLabel) return;

  slider.oninput = () => {
    const scale = Number(slider.value || 95);
    valueLabel.textContent = `${scale}%`;
    if (typeof setAppScalePercent === 'function') {
      setAppScalePercent(scale);
    }
  };
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    if (id === 'partnersModal') clearSettingsPartnerPresenceSubscriptions();
    modal.classList.add('hidden');
    if (!document.querySelector('.modal:not(.hidden)')) {
      document.body.classList.remove('modal-open');
    }
  }
}

function setupModalBackdropClose(modal) {
  if (!modal || boundModalBackdrops.has(modal)) return;
  boundModalBackdrops.add(modal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal.id);
    }
  });
}

function returnToSettingsFrom(modalId) {
  closeModal(modalId);
  setTimeout(() => {
    const settingsModal = document.getElementById('settingsModal');
    if (!settingsModal) return;
    settingsModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    setupModalBackdropClose(settingsModal);
  }, 200);
}

function goBackToSettings() {
  returnToSettingsFrom('partnersModal');
}

function goBackToSettingsFromAppearance() {
  returnToSettingsFrom('appearanceModal');
}

function refreshPartnerDisplays() {
  if (typeof loadPartners === 'function') {
    loadPartners();
  }

  if (typeof displayPlanifications === 'function') {
    if (typeof getAllPlanificationsFromFirestore === 'function' && isFirebaseAvailable()) {
      getAllPlanificationsFromFirestore().then(displayPlanifications).catch(() => {});
    } else {
      const planifications = JSON.parse(localStorage.getItem('planifications') || '[]');
      displayPlanifications(planifications);
    }
  }

  if (typeof currentViewMode !== 'undefined' && currentViewMode === 'calendar' && typeof buildCalendarView === 'function') {
    buildCalendarView();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

let groupMembersDraftSelection = [];
let cachedGroupPartners = [];

async function openGroupsModal() {
  closeModal('settingsModal');

  cachedGroupPartners = (typeof getApprovedPartnersFromFirebase === 'function'
    ? await getApprovedPartnersFromFirebase()
    : await getAllUsersFromFirebase()).filter(u => u.id !== getCurrentUserId());
  groupMembersDraftSelection = [];

  const nameInput = document.getElementById('groupNameInput');
  if (nameInput) nameInput.value = '';

  renderGroupsList();
  renderGroupMembersCheckboxList();
  applyTranslations();

  const modal = document.getElementById('groupsModal');
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setupModalBackdropClose(modal);
}

function renderGroupsList() {
  const list = document.getElementById('groupsList');
  if (!list) return;

  const groups = Object.values((typeof getPartnerGroups === 'function' ? getPartnerGroups() : {}) || {});

  if (groups.length === 0) {
    list.innerHTML = `<p class="empty-state" data-i18n="groupsNoGroups">Nu ai încă niciun grup creat.</p>`;
    applyTranslations();
    return;
  }

  list.innerHTML = groups.map(group => {
    const memberIds = Array.isArray(group.memberIds) ? group.memberIds : [];
    const memberNames = memberIds.map(id => {
      const user = cachedGroupPartners.find(u => u.id === id);
      return getLocalPartnerNickname(id, user ? user.name : id);
    });

    return `
      <div class="group-row">
        <div class="group-row-header">
          <div class="group-row-name">${escapeHtml(group.name)}</div>
        </div>
        <div class="group-row-members">${escapeHtml(memberNames.join(', ') || '—')}</div>
        <div class="group-row-actions">
          <button class="button-small secondary" onclick="deleteGroupById('${group.id}')" data-i18n="groupsDelete">Șterge</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderGroupMembersCheckboxList() {
  const container = document.getElementById('groupMembersCheckboxList');
  if (!container) return;

  if (cachedGroupPartners.length === 0) {
    container.innerHTML = `<p class="empty-state" data-i18n="groupsNoPartnersAvailable">Nu ai parteneri disponibili pentru a crea un grup.</p>`;
    applyTranslations();
    return;
  }

  container.innerHTML = cachedGroupPartners.map(user => {
    const checked = groupMembersDraftSelection.includes(user.id);
    const displayName = getLocalPartnerNickname(user.id, user.name);
    return `
      <label class="partner-checkbox-row${checked ? ' checked' : ''}">
        <input type="checkbox" value="${user.id}" ${checked ? 'checked' : ''} onchange="toggleGroupMemberDraft('${user.id}')" />
        <span>${escapeHtml(displayName)}</span>
      </label>
    `;
  }).join('');
}

function toggleGroupMemberDraft(userId) {
  const idx = groupMembersDraftSelection.indexOf(userId);
  if (idx > -1) {
    groupMembersDraftSelection.splice(idx, 1);
  } else {
    groupMembersDraftSelection.push(userId);
  }
  renderGroupMembersCheckboxList();
}

async function saveNewGroup() {
  const nameInput = document.getElementById('groupNameInput');
  const name = nameInput ? nameInput.value.trim() : '';

  if (!name) {
    const msg = translate('groupsNameRequired') || 'Introdu un nume pentru grup.';
    if (typeof showAlertApp === 'function') await showAlertApp(msg); else alert(msg);
    return;
  }

  if (groupMembersDraftSelection.length === 0) {
    const msg = translate('groupsMembersRequired') || 'Selectează cel puțin un membru pentru grup.';
    if (typeof showAlertApp === 'function') await showAlertApp(msg); else alert(msg);
    return;
  }

  const group = {
    id: 'grp_' + Date.now(),
    name,
    memberIds: [...groupMembersDraftSelection]
  };

  const ok = await savePartnerGroup(group);
  if (!ok) {
    if (typeof showAlertApp === 'function') await showAlertApp('Eroare la salvarea grupului.'); else alert('Eroare la salvarea grupului.');
    return;
  }

  groupMembersDraftSelection = [];
  if (nameInput) nameInput.value = '';
  renderGroupsList();
  renderGroupMembersCheckboxList();

  const msg = translate('groupsSavedSuccess') || 'Grupul a fost salvat.';
  if (typeof showAlertApp === 'function') showAlertApp(msg); else alert(msg);
}

async function deleteGroupById(groupId) {
  const confirmMsg = translate('groupsDeletedConfirm') || 'Sigur vrei să ștergi acest grup?';
  const confirmed = (typeof showConfirmApp === 'function') ? await showConfirmApp(confirmMsg) : confirm(confirmMsg);
  if (!confirmed) return;

  await deletePartnerGroup(groupId);
  renderGroupsList();
}

function goBackToSettingsFromGroups() {
  returnToSettingsFrom('groupsModal');
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof refreshTelegramLinkStatus === 'function') {
    refreshTelegramLinkStatus().catch(() => {});
  }
});

// Partnership UI: users are visible here only after both sides approve the request.
async function openPartnersModal() {
  closeModal('settingsModal');
  const list = document.getElementById('partnersList');
  const requests = document.getElementById('partnerRequestsList');
  const modal = document.getElementById('partnersModal');
  if (!list || !requests || !modal) return;

  list.innerHTML = '<p class="empty-state">Se încarcă partenerii…</p>';
  requests.innerHTML = '';
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  setupModalBackdropClose(modal);

  try {
    const snapshot = await getUserProfileRef(getCurrentUserId()).once('value');
    if (snapshot.exists()) {
      currentUser = snapshot.val();
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  } catch (_) {}

  const incoming = (currentUser && currentUser.partnerRequests && typeof currentUser.partnerRequests === 'object')
    ? Object.entries(currentUser.partnerRequests) : [];
  if (incoming.length) {
    requests.innerHTML = `<h3 class="partner-section-title">Cereri primite</h3>${incoming.map(([id, request]) => `
      <div class="partner-request-row">
        <div><strong>${escapeHtml(request.fromName || 'Utilizator')}</strong><small>${escapeHtml(request.fromNickname || '')}</small></div>
        <div class="partner-row-actions"><button class="button-small secondary" onclick="respondToPartnerRequest('${id}', false)">Refuză</button><button class="button-small main" onclick="respondToPartnerRequest('${id}', true)">Acceptă</button></div>
      </div>`).join('')}`;
  }

  const partners = await getApprovedPartnersFromFirebase();
  list.innerHTML = '<h3 class="partner-section-title">Partenerii mei</h3>';
  if (!partners.length) {
    list.innerHTML += '<p class="empty-state">Nu ai încă parteneri acceptați.</p>';
    return;
  }
  list.innerHTML += partners.map(partner => `
    <div class="partner-row">
      <div class="partner-identity"><div class="partner-name">${escapeHtml(partner.name || 'Utilizator')}</div><small>${escapeHtml(partner.nickname || '')}</small><span class="friend-presence offline" data-friend-presence-id="${escapeHtml(partner.id)}"><i aria-hidden="true"></i>Offline</span></div>
      <div class="partner-row-actions"><button class="button-small secondary" onclick="disconnectPartner('${partner.id}')">Elimină</button></div>
    </div>`).join('');
  subscribeToSettingsPartnerPresence(partners);
}

async function sendPartnerRequestFromSettings(event) {
  event.preventDefault();
  const input = document.getElementById('partnerNicknameSearch');
  try {
    await sendPartnerRequestByNickname(input && input.value);
    if (input) input.value = '';
    if (typeof showAlertApp === 'function') await showAlertApp('Cererea a fost trimisă. Persoana trebuie să o accepte.');
  } catch (error) {
    if (typeof showAlertApp === 'function') await showAlertApp(error.message || 'Cererea nu a putut fi trimisă.');
  }
}

async function respondToPartnerRequest(requesterId, accepted) {
  try {
    await answerPartnerRequest(requesterId, accepted);
    await openPartnersModal();
    refreshPartnerDisplays();
  } catch (error) {
    if (typeof showAlertApp === 'function') await showAlertApp(error.message || 'Nu am putut procesa cererea.');
  }
}

async function disconnectPartner(partnerId) {
  try {
    const confirmed = typeof showConfirmApp === 'function'
      ? await showConfirmApp('Sigur vrei să elimini acest prieten din lista ta?', 'Elimină prieten')
      : confirm('Sigur vrei să elimini acest prieten?');
    if (!confirmed) return;
    await removeApprovedPartner(partnerId);
    await openPartnersModal();
    refreshPartnerDisplays();
  } catch (error) {
    if (typeof showAlertApp === 'function') await showAlertApp('Nu am putut elimina partenerul.');
  }
}

function openEditNameModal() {
  const nameInput = document.getElementById('editNameInput');
  const nicknameInput = document.getElementById('editNicknameInput');
  const status = document.getElementById('profileNicknameStatus');
  if (nameInput) nameInput.value = (currentUser && currentUser.name) || '';
  if (nicknameInput) nicknameInput.value = (currentUser && currentUser.nickname) || '';
  if (status) { status.textContent = ''; status.className = 'profile-nickname-status hidden'; }
  const modal = document.getElementById('editNameModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    setupModalBackdropClose(modal);
    nameInput && nameInput.focus();
  }
}

async function saveEditedName() {
  const name = document.getElementById('editNameInput')?.value || '';
  const nickname = document.getElementById('editNicknameInput')?.value || '';
  const status = document.getElementById('profileNicknameStatus');
  try {
    await savePublicProfile(name, nickname);
    if (status) {
      status.textContent = 'Profil salvat cu succes.';
      status.className = 'profile-nickname-status success';
    }
  } catch (error) {
    if (status) {
      status.textContent = error.message || 'Profilul nu a putut fi salvat.';
      status.className = 'profile-nickname-status error';
    }
  }
}
