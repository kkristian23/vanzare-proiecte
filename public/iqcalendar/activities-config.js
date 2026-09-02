// Activities Lock Configuration
// Editați rapid doar aici, folosind id-urile activităților.
// Exemplu: ['walk', 'cinema', 'hiking'] = blochează Plimbare, Cinema, Drumeție.

const lockedActivitiesConfig = [
  'shopping',
  'cinema',
  'travel',
  'music',
  'dance',
  'karting'
];

function isActivityLocked(activityId) {
  return lockedActivitiesConfig.includes(activityId);
}

function unlockActivity(activityId) {
  if (isActivityLocked(activityId)) {
    const index = lockedActivitiesConfig.indexOf(activityId);
    lockedActivitiesConfig.splice(index, 1);
    console.log(`✅ Activitate deblocată: ${activityId}`);
    if (typeof renderActivities === 'function') {
      renderActivities();
    }
  }
}

function lockActivity(activityId) {
  if (!isActivityLocked(activityId)) {
    lockedActivitiesConfig.push(activityId);
    console.log(`🔒 Activitate blocată: ${activityId}`);
    if (typeof renderActivities === 'function') {
      renderActivities();
    }
  }
}

function unlockAllActivities() {
  lockedActivitiesConfig.length = 0;
  console.log('✅ Toate activitățile sunt deblocate!');
  if (typeof renderActivities === 'function') {
    renderActivities();
  }
}

function setLockedActivities(activityIds) {
  lockedActivitiesConfig.length = 0;
  lockedActivitiesConfig.push(...activityIds);
  console.log('Activități blocate actualizate:', activityIds);
  if (typeof renderActivities === 'function') {
    renderActivities();
  }
}

function getLockedActivities() {
  return [...lockedActivitiesConfig];
}

window.activityConfigLoaded = Promise.resolve();
