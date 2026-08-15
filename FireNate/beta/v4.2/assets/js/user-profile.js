/* =========================================================================
   FireNate — shared user profile store.
   Exposes window.FNProfile = { get, set, clear, getAge }.
   Backed by localStorage so the same birthday, savings, retirement age,
   and expected return can pre-fill fields across every calculator page.
   ========================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "fn-profile";

  function readProfile() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      /* storage unavailable (private browsing, etc.) */
    }
  }

  function getProfile() {
    return readProfile();
  }

  function setProfile(patch) {
    var next = readProfile();
    Object.keys(patch).forEach(function (key) {
      var value = patch[key];
      if (value === null || value === undefined || value === "") {
        delete next[key];
      } else {
        next[key] = value;
      }
    });
    writeProfile(next);
    document.dispatchEvent(new CustomEvent("fn-profile-change", { detail: { profile: next } }));
    return next;
  }

  function clearProfile() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("fn-profile-change", { detail: { profile: {} } }));
  }

  function getAge(profile) {
    var p = profile || readProfile();
    if (!p.birthday) return null;
    var dob = new Date(p.birthday + "T00:00:00");
    if (isNaN(dob.getTime())) return null;
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 0 ? age : null;
  }

  window.FNProfile = {
    get: getProfile,
    set: setProfile,
    clear: clearProfile,
    getAge: getAge
  };
})();
