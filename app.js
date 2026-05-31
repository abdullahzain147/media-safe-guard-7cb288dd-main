// Holy Quran Application - Main JavaScript Controller

// Admin Credentials
const ADMIN_USERNAME = 'abdullahzain';
const ADMIN_PASSWORD = 'abdullah3019126';

// Global App State
let currentUser = null;
let isAdminSession = false;
let activeRecitation = { type: 'surah', id: 1 };
let searchTimeout = null;
let playMode = 'video'; // 'video' = Urdu Tarjuma (YouTube), 'audio' = HD Recitation (MP3)
let currentInlineAudio = null;

// Initialization on load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthSession();
  
  // If user is logged in, initialize UI components
  if (currentUser) {
    initApp();
  }
});

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Slide out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ================= AUTH MODULE ================= */
function checkAuthSession() {
  // Check admin session
  if (sessionStorage.getItem('quran_admin_session') === 'true') {
    isAdminSession = true;
    document.getElementById('authWrapper').style.display = 'none';
    document.getElementById('appContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'flex';
    renderAdminPanel();
    return;
  }
  const sessionUser = sessionStorage.getItem('quran_current_user') || localStorage.getItem('quran_current_user');
  if (sessionUser) {
    currentUser = JSON.parse(sessionUser);
    document.getElementById('authWrapper').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    updateUserProfileWidget();
  } else {
    document.getElementById('authWrapper').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
  }
}

function toggleAuthCard(cardType) {
  const cards = ['loginCard','signupCard','adminCard','forgotEmailCard','forgotCodeCard'];
  cards.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const map = {
    signup: 'signupCard',
    admin: 'adminCard',
    forgot: 'forgotEmailCard',
    forgotCode: 'forgotCodeCard',
    login: 'loginCard'
  };
  const targetId = map[cardType] || 'loginCard';
  const target = document.getElementById(targetId);
  if (target) target.style.display = 'block';
}

/* ===== Forgot Password Flow (client-side demo) ===== */
let _forgotState = null; // { email, code, expires }

function handleForgotSendCode(event) {
  event.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
  const users = JSON.parse(localStorage.getItem('quran_users') || '[]');
  const user = users.find(u => u.email === email);
  if (!user) {
    showToast('Is email se koi account registered nahi hai', 'warning');
    return;
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  _forgotState = { email, code, expires: Date.now() + 10 * 60 * 1000 };

  // Try to open user's email client with code pre-filled (real "send" would need backend)
  const subject = encodeURIComponent('Holy Quran Portal - Password Reset Code');
  const body = encodeURIComponent(`Assalamu Alaikum,\n\nAap ka verification code hai: ${code}\n\nYeh code 10 minute ke liye valid hai.\n\nAgar aap ne reset request nahi ki to is email ko ignore karein.\n\n- Holy Quran Portal Team`);
  // Send email via mailto (opens mail client). Also show code on-screen as fallback.
  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

  showToast(`Verification code: ${code} (10 min valid)`, 'success');
  alert(`Demo Mode — Verification Code\n\nAap ka 6-digit code: ${code}\n\nReal email service ke liye backend lagana padta hai. Abhi yeh code direct dikha diya gaya hai aur mail app bhi open ho gayi hai.`);

  document.getElementById('forgotEmailForm').reset();
  toggleAuthCard('forgotCode');
}

function handleForgotReset(event) {
  event.preventDefault();
  if (!_forgotState) {
    showToast('Pehle code request karein', 'warning');
    toggleAuthCard('forgot');
    return;
  }
  if (Date.now() > _forgotState.expires) {
    showToast('Code expire ho gaya hai. Naya code request karein.', 'warning');
    _forgotState = null;
    toggleAuthCard('forgot');
    return;
  }
  const enteredCode = document.getElementById('forgotCode').value.trim();
  const newPassword = document.getElementById('forgotNewPassword').value;

  if (enteredCode !== _forgotState.code) {
    showToast('Galat verification code', 'warning');
    return;
  }
  const pwError = validatePasswordStrength(newPassword);
  if (pwError) {
    showToast(pwError, 'warning');
    return;
  }

  const users = JSON.parse(localStorage.getItem('quran_users') || '[]');
  const idx = users.findIndex(u => u.email === _forgotState.email);
  if (idx === -1) {
    showToast('User nahi mila', 'warning');
    return;
  }
  users[idx].password = newPassword;
  localStorage.setItem('quran_users', JSON.stringify(users));

  _forgotState = null;
  document.getElementById('forgotCodeForm').reset();
  showToast('Password reset ho gaya! Naye password se login karein.', 'success');
  toggleAuthCard('login');
}

/* ===== Help: AI Assistant + Contact Email ===== */
function appendAiMsg(text, who) {
  const box = document.getElementById('aiChatBox');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'ai-msg ' + (who === 'user' ? 'ai-user' : 'ai-bot');
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function aiReply(q) {
  const s = q.toLowerCase();
  if (/salam|hello|hi|assala/.test(s)) return 'Wa alaikum as-salam! Mein aap ki kaise madad karoun?';
  if (/password|forget|forgot|bhool/.test(s)) return 'Password bhool gaye? Logout karein, login page par "Forgot Password?" link click karein, apna email dein aur verification code se naya password set karein.';
  if (/register|sign ?up|account banana/.test(s)) return 'Account banane ke liye login page par "Sign Up" click karein. Naam, email aur 8+ character ka strong password dein (uppercase, lowercase, number, special character).';
  if (/download/.test(s)) return 'Koi bhi Surah play karein, phir player mein "Download Recitation MP3" button click karein. Aap ki downloads "Downloads" tab mein save ho jati hain.';
  if (/urdu|tarjuma|translation/.test(s)) return 'Header par "Urdu Tarjuma" button select karein — Surah play karte hi Urdu translation video aur ayaat ka Urdu tarjuma niche show ho jata hai.';
  if (/audio|recitation|hd|qari/.test(s)) return 'Header par "HD Recitations" mode select karein — phir koi bhi Surah click karne par high-quality MP3 audio play hoga.';
  if (/history/.test(s)) return 'Sidebar mein "Recitation History" tab par jayein — aap ne jo bhi Surah suni woh wahan save hoti hai.';
  if (/contact|email|gmail|support/.test(s)) return 'Aap az3374120@gmail.com par direct email kar sakte hain, ya is page par right side ka "Contact via Gmail" form bharein.';
  if (/surah|ayat|verse/.test(s)) return 'Quran mein 114 Surahs hain. "Surah List" tab mein sab dekhein. Player mein Surah ka Arabic text aur Urdu tarjuma bhi automatic load hota hai.';
  if (/para|juz|sipara/.test(s)) return 'Quran 30 Paras (Juz) mein divided hai. "Para / Juz List" tab par jakar koi bhi Para select karein.';
  if (/logout|sign out/.test(s)) return 'Sidebar mein neeche user profile ke saath logout button hai — wahan click karein.';
  if (/shukri|thank/.test(s)) return 'JazakAllah Khair! Koi aur sawal ho to zaroor poochain.';
  return 'Mujhe samajh nahi aaya. Aap "password", "download", "Surah", "history", ya "contact" ke baare mein pooch sakte hain. Detailed help ke liye az3374120@gmail.com par email karein.';
}

function handleAiAsk(event) {
  event.preventDefault();
  const input = document.getElementById('aiInput');
  const q = input.value.trim();
  if (!q) return;
  appendAiMsg(q, 'user');
  input.value = '';
  setTimeout(() => appendAiMsg(aiReply(q), 'bot'), 400);
}

async function handleContactSend(event) {
  event.preventDefault();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  if (!subject || !message) return;

  const fromName = currentUser ? currentUser.name : 'Guest';
  const fromEmail = currentUser ? currentUser.email : 'unknown@guest.com';
  const btn = event.target.querySelector('button[type="submit"]');
  const origText = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

  try {
    // FormSubmit.co — free email forwarding service (no backend needed)
    const res = await fetch('https://formsubmit.co/ajax/az3374120@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: fromName,
        email: fromEmail,
        _subject: '[Quran Portal] ' + subject,
        _template: 'table',
        _captcha: 'false',
        message: message,
      }),
    });
    const data = await res.json();
    if (data.success === 'true' || data.success === true) {
      showToast('Message admin ko bhej diya gaya hai!', 'success');
      document.getElementById('contactSubject').value = '';
      document.getElementById('contactMessage').value = '';
    } else {
      throw new Error(data.message || 'Send failed');
    }
  } catch (err) {
    console.error('Contact send failed:', err);
    // Fallback to mailto so message is never lost
    const body = `From: ${fromName} (${fromEmail})\n\n${message}`;
    const mailto = `mailto:az3374120@gmail.com?subject=${encodeURIComponent('[Quran Portal] ' + subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    showToast('Online send fail hua — mail app open ho rahi hai.', 'warning');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }
}

function validatePasswordStrength(pw) {
  if (pw.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(pw)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(pw)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(pw)) return 'Password must contain a number';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pw)) return 'Password must contain a special character';
  return null;
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) {
    showToast('Please fill all fields', 'warning');
    return;
  }

  const pwError = validatePasswordStrength(password);
  if (pwError) {
    showToast(pwError, 'warning');
    return;
  }

  const users = JSON.parse(localStorage.getItem('quran_users') || '[]');
  if (users.some(u => u.email === email)) {
    showToast('This email is already registered', 'warning');
    return;
  }
  if (users.some(u => u.name.trim().toLowerCase() === name.toLowerCase())) {
    showToast('This username is already taken', 'warning');
    return;
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name,
    email,
    password,
    history: [],
    downloads: []
  };

  users.push(newUser);
  localStorage.setItem('quran_users', JSON.stringify(users));

  showToast('Registration successful! Please login.', 'success');
  document.getElementById('signupForm').reset();
  toggleAuthCard('login');
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  
  const users = JSON.parse(localStorage.getItem('quran_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showToast('Invalid email or password', 'warning');
    return;
  }
  
  currentUser = user;
  sessionStorage.setItem('quran_current_user', JSON.stringify(currentUser));
  localStorage.setItem('quran_current_user', JSON.stringify(currentUser));
  
  document.getElementById('authWrapper').style.display = 'none';
  document.getElementById('appContainer').style.display = 'flex';
  
  document.getElementById('loginForm').reset();
  showToast(`Welcome back, ${currentUser.name}!`, 'success');
  initApp();
}

// Admin Login Handler
function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    isAdminSession = true;
    sessionStorage.setItem('quran_admin_session', 'true');
    document.getElementById('authWrapper').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'flex';
    document.getElementById('adminLoginForm').reset();
    renderAdminPanel();
    showToast('Admin Panel mein Khush Aamdeed!', 'success');
  } else {
    showToast('Galat username ya password!', 'warning');
  }
}

function handleAdminLogout() {
  isAdminSession = false;
  sessionStorage.removeItem('quran_admin_session');
  document.getElementById('adminContainer').style.display = 'none';
  document.getElementById('authWrapper').style.display = 'flex';
  showToast('Admin logout ho gaye', 'success');
}

function renderAdminPanel() {
  const users = JSON.parse(localStorage.getItem('quran_users') || '[]');
  const tbody = document.getElementById('adminUsersTable');
  const countEl = document.getElementById('adminUserCount');
  if (countEl) countEl.innerText = users.length;
  
  if (!tbody) return;
  tbody.innerHTML = '';
  
  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">Koi registered user nahi hai abhi tak.</td></tr>`;
    return;
  }
  
  users.forEach((u, idx) => {
    const regDate = u.id ? new Date(parseInt(u.id.replace('user_', ''))).toLocaleString() : 'N/A';
    const historyCount = (u.history || []).length;
    const dlCount = (u.downloads || []).length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td><span class="admin-pass-cell" data-visible="false" data-pass="${u.password}">
        <span class="pass-dots">••••••••</span>
        <button onclick="togglePassword(this.parentElement)" class="admin-eye-btn" title="Password dekhein">
          <i class="fa-solid fa-eye"></i>
        </button>
      </span></td>
      <td>${regDate}</td>
      <td><span class="admin-badge">${historyCount} Videos</span></td>
      <td><span class="admin-badge admin-badge-green">${dlCount} Files</span></td>
      <td>
        <button class="admin-del-btn" onclick="adminDeleteUser('${u.id}')" title="User delete karein">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function togglePassword(cell) {
  const isVisible = cell.getAttribute('data-visible') === 'true';
  const dots = cell.querySelector('.pass-dots');
  const btn = cell.querySelector('.admin-eye-btn i');
  if (isVisible) {
    dots.textContent = '••••••••';
    btn.className = 'fa-solid fa-eye';
    cell.setAttribute('data-visible', 'false');
  } else {
    dots.textContent = cell.getAttribute('data-pass');
    btn.className = 'fa-solid fa-eye-slash';
    cell.setAttribute('data-visible', 'true');
  }
}

function adminDeleteUser(userId) {
  if (!confirm('Kya aap is user ko delete karna chahte hain?')) return;
  let users = JSON.parse(localStorage.getItem('quran_users') || '[]');
  users = users.filter(u => u.id !== userId);
  localStorage.setItem('quran_users', JSON.stringify(users));
  renderAdminPanel();
  showToast('User delete kar diya gaya', 'success');
}

function adminSearchUsers(val) {
  const query = val.toLowerCase();
  const rows = document.querySelectorAll('#adminUsersTable tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
}

function handleLogout() {
  currentUser = null;
  sessionStorage.removeItem('quran_current_user');
  localStorage.removeItem('quran_current_user');
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('authWrapper').style.display = 'flex';
  showToast('Logged out successfully', 'success');
}

function updateUserProfileWidget() {
  if (!currentUser) return;

  const avatarEl = document.getElementById('userAvatar');
  const char = currentUser.name.trim().charAt(0).toUpperCase();

  if (currentUser.photo) {
    avatarEl.innerText = '';
    avatarEl.style.backgroundImage = `url('${currentUser.photo}')`;
  } else {
    avatarEl.innerText = char;
    avatarEl.style.backgroundImage = '';
  }

  // Set name
  document.getElementById('userName').innerText = currentUser.name;
  const welcomeEl = document.getElementById('welcomeUserName');
  if (welcomeEl) welcomeEl.innerText = currentUser.name;

  // Profile view fields
  const pPrev = document.getElementById('profilePhotoPreview');
  const pName = document.getElementById('profileNameDisplay');
  const pEmail = document.getElementById('profileEmailDisplay');
  if (pPrev) {
    if (currentUser.photo) {
      pPrev.innerText = '';
      pPrev.style.backgroundImage = `url('${currentUser.photo}')`;
    } else {
      pPrev.innerText = char;
      pPrev.style.backgroundImage = '';
    }
  }
  if (pName) pName.innerText = currentUser.name;
  if (pEmail) pEmail.innerText = currentUser.email;
}

/* ================= PROFILE: Photo & Password ================= */
function handleProfilePhotoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Sirf image file upload karein.', 'error');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('Image size 2 MB se kam honi chahiye.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    currentUser.photo = e.target.result;
    syncUserData();
    updateUserProfileWidget();
    showToast('Profile photo update ho gayi!', 'success');
  };
  reader.onerror = function() {
    showToast('Photo load nahi ho saki.', 'error');
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function handleRemoveProfilePhoto() {
  if (!currentUser) return;
  if (!currentUser.photo) {
    showToast('Koi photo set nahi hai.', 'warning');
    return;
  }
  if (!confirm('Profile photo remove karein?')) return;
  delete currentUser.photo;
  syncUserData();
  updateUserProfileWidget();
  showToast('Photo remove kar di gayi.', 'success');
}

function handleChangePassword(event) {
  event.preventDefault();
  if (!currentUser) return;
  const cur = document.getElementById('currentPassword').value;
  const np = document.getElementById('newPassword').value;
  const cnp = document.getElementById('confirmNewPassword').value;

  if (cur !== currentUser.password) {
    showToast('Current password galat hai.', 'error');
    return;
  }
  const strengthErr = validatePasswordStrength(np);
  if (strengthErr) {
    showToast(strengthErr, 'error');
    return;
  }
  if (np !== cnp) {
    showToast('Naya password aur confirm password match nahi karte.', 'error');
    return;
  }
  if (np === cur) {
    showToast('Naya password current se different hona chahiye.', 'error');
    return;
  }
  currentUser.password = np;
  syncUserData();
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';
  showToast('Password successfully update ho gaya!', 'success');
}

// Sync current user details back to master users array in localStorage
function syncUserData() {
  if (!currentUser) return;
  
  // Update current session
  localStorage.setItem('quran_current_user', JSON.stringify(currentUser));
  sessionStorage.setItem('quran_current_user', JSON.stringify(currentUser));
  
  // Update master list
  const users = JSON.parse(localStorage.getItem('quran_users') || '[]');
  const index = users.findIndex(u => u.id === currentUser.id);
  if (index !== -1) {
    users[index] = currentUser;
    localStorage.setItem('quran_users', JSON.stringify(users));
  }
}

/* ================= APP DASHBOARD ================= */
function initApp() {
  updateUserProfileWidget();
  renderPopularSurahs();
  renderSurahsList(SURAH_LIST);
  renderParasList(PARA_LIST);
  renderHistoryList();
  renderDownloadsList();
  stopVisualizer();

  // Set default player info (Surah Al-Fatiha)
  const defaultSurah = SURAH_LIST[0];
  if (defaultSurah) {
    document.getElementById('playerTitleEng').innerText = `Surah ${defaultSurah.transliteration} (${defaultSurah.translation})`;
    document.getElementById('playerTitleAr').innerText = defaultSurah.arabic;
    document.getElementById('playerMetaVerses').innerText = `${defaultSurah.verses} Verses`;
    document.getElementById('playerMetaType').innerText = defaultSurah.type;
  }
}


// Tab view routing
function switchTab(tabId) {
  // Update menu highlights
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  
  const targetMenuItem = document.getElementById(`tab-${tabId}`);
  if (targetMenuItem) {
    targetMenuItem.classList.add('active');
  }
  
  // Update view display
  const views = document.querySelectorAll('.view-section');
  views.forEach(view => view.classList.remove('active'));
  
  const targetView = document.getElementById(`view-${tabId}`);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  // Specific tab render triggers
  if (tabId === 'history') {
    renderHistoryList();
  } else if (tabId === 'downloads') {
    renderDownloadsList();
  }
  
  // Clear search bar when navigating to avoid confusion
  document.getElementById('searchInput').value = '';
  // reset lists to normal state
  if (tabId === 'surahs') renderSurahsList(SURAH_LIST);
  if (tabId === 'paras') renderParasList(PARA_LIST);
}

// Media Visualizer Simulator
function startVisualizer() {
  const bars = document.querySelectorAll('.visualizer-bar');
  bars.forEach(bar => {
    bar.style.animationPlayState = 'running';
  });
}

function stopVisualizer() {
  const bars = document.querySelectorAll('.visualizer-bar');
  bars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
  });
}

function cleanupCurrentMedia() {
  if (currentInlineAudio) {
    currentInlineAudio.pause();
    currentInlineAudio.src = '';
    currentInlineAudio.load();
    currentInlineAudio = null;
  }

  const oldAudio = document.getElementById('mainAudioPlayer');
  if (oldAudio) {
    oldAudio.pause();
    oldAudio.removeAttribute('src');
    oldAudio.load();
  }

  const oldFrame = document.getElementById('mainVideoPlayer');
  if (oldFrame) {
    oldFrame.src = 'about:blank';
  }
}

// Renders popular Surahs grid on Home Screen
function renderPopularSurahs() {
  const popularNumbers = [1, 36, 55, 56, 67, 18]; // Fatiha, Yaseen, Rahman, Waqiah, Mulk, Kahf
  const container = document.getElementById('popularSurahsGrid');
  container.innerHTML = '';
  
  popularNumbers.forEach(num => {
    const surah = SURAH_LIST.find(s => s.number === num);
    if (surah) {
      container.appendChild(createSurahCardElement(surah));
    }
  });
}

// Renders complete 114 Surahs
function renderSurahsList(list) {
  const container = document.getElementById('surahGrid');
  container.innerHTML = '';
  
  document.getElementById('surahCounter').innerText = `${list.length} Items`;
  
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-placeholder" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-magnifying-glass-chart"></i>
        <div class="empty-placeholder-title">No Surahs Found</div>
        <div class="empty-placeholder-desc">Try search using English name, Arabic, or Urdu translation.</div>
      </div>
    `;
    return;
  }
  
  list.forEach(surah => {
    container.appendChild(createSurahCardElement(surah));
  });
}

// Create a DOM Element card for a Surah
function createSurahCardElement(surah) {
  const card = document.createElement('div');
  card.className = 'quran-card';
  card.onclick = () => playRecitation('surah', surah.number);
  
  card.innerHTML = `
    <div class="card-top">
      <div class="surah-number-badge">${surah.number}</div>
      <span class="surah-type-badge">${surah.type}</span>
    </div>
    
    <div class="card-middle">
      <div class="surah-names-eng">
        <span class="surah-name-trans">${surah.transliteration}</span>
        <span class="surah-name-meaning">${surah.translation}</span>
      </div>
      <div class="surah-name-ar arabic-text">${surah.arabic}</div>
    </div>
    
    <div class="card-bottom">
      <span class="verses-count-info">
        <i class="fa-solid fa-book-open"></i>
        ${surah.verses} Verses
      </span>
      <span class="urdu-name-label urdu-text" style="font-size: 0.95rem; color: var(--text-gold); font-weight: 500;">
        ${surah.urduName}
      </span>
      <div class="card-play-btn">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
  `;
  return card;
}

// Renders the 30 Juz/Paras
function renderParasList(list) {
  const container = document.getElementById('paraGrid');
  container.innerHTML = '';
  
  document.getElementById('paraCounter').innerText = `${list.length} Items`;
  
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-placeholder" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-magnifying-glass-chart"></i>
        <div class="empty-placeholder-title">No Paras Found</div>
        <div class="empty-placeholder-desc">Try search using number (e.g. 30) or Arabic title.</div>
      </div>
    `;
    return;
  }
  
  list.forEach(para => {
    const card = document.createElement('div');
    card.className = 'quran-card';
    card.onclick = () => playRecitation('para', para.juz);
    
    card.innerHTML = `
      <div class="card-top">
        <div class="surah-number-badge">Para ${para.juz}</div>
      </div>
      
      <div class="card-middle">
        <div class="surah-names-eng">
          <span class="surah-name-trans">${para.transliteration}</span>
          <span class="surah-name-meaning" style="font-size: 0.75rem;">${para.description}</span>
        </div>
        <div class="surah-name-ar arabic-text">${para.arabic}</div>
      </div>
      
      <div class="card-bottom">
        <span class="urdu-name-label urdu-text" style="font-size: 0.95rem; color: var(--text-gold); font-weight: 500;">
          ${para.urdu}
        </span>
        <div class="card-play-btn">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ================= WATCH HISTORY LOGS ================= */
function renderHistoryList() {
  const container = document.getElementById('historyList');
  container.innerHTML = '';
  
  if (!currentUser || !currentUser.history || currentUser.history.length === 0) {
    container.innerHTML = `
      <div class="empty-placeholder">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <div class="empty-placeholder-title">No Playback History Yet</div>
        <div class="empty-placeholder-desc">Play some Surahs or Paras to track your listened recitations here.</div>
      </div>
    `;
    return;
  }
  
  // Show history in reverse chronological order (newest first)
  const sortedHistory = [...currentUser.history].reverse();
  
  sortedHistory.forEach(item => {
    const dateStr = new Date(item.timestamp).toLocaleString();
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const icon = item.type === 'surah' ? 'fa-book-quran' : 'fa-cubes';
    
    historyItem.innerHTML = `
      <div class="history-item-badge">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="history-item-details">
        <h4 class="history-item-title">
          ${item.titleEng} 
          <span class="arabic-text" style="font-size: 1.1rem; color: var(--text-gold); font-weight: 500;">(${item.titleAr})</span>
        </h4>
        <div class="history-item-time">
          <i class="fa-regular fa-clock"></i>
          Watched on: ${dateStr}
        </div>
      </div>
      
      <div class="history-item-actions">
        <button class="history-action-btn play-again" title="Replay Recitation" onclick="playRecitation('${item.type}', ${item.mediaId})">
          <i class="fa-solid fa-play"></i>
        </button>
        <button class="history-action-btn" title="Remove from history" onclick="removeFromHistory('${item.id}', event)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;
    container.appendChild(historyItem);
  });
}

function addToHistory(type, id, titleEng, titleAr) {
  if (!currentUser) return;
  
  // Generate a unique ID for the log
  const logEntry = {
    id: 'log_' + Date.now() + Math.random().toString(36).substring(2, 6),
    type,
    mediaId: id,
    titleEng,
    titleAr,
    timestamp: Date.now()
  };
  
  if (!currentUser.history) currentUser.history = [];
  
  // Prevent duplicate consecutive streams if user clicks same surah multiple times
  const lastItem = currentUser.history[currentUser.history.length - 1];
  if (lastItem && lastItem.type === type && lastItem.mediaId === id) {
    // Just update timestamp
    lastItem.timestamp = Date.now();
  } else {
    currentUser.history.push(logEntry);
  }
  
  // Cap history at 50 logs
  if (currentUser.history.length > 50) {
    currentUser.history.shift();
  }
  
  syncUserData();
  renderHistoryList();
}

function removeFromHistory(logId, event) {
  if (event) event.stopPropagation();
  
  if (!currentUser || !currentUser.history) return;
  
  currentUser.history = currentUser.history.filter(item => item.id !== logId);
  syncUserData();
  renderHistoryList();
  showToast('Removed from playback history', 'success');
}

function clearUserHistory() {
  if (!currentUser) return;
  
  if (confirm('Are you sure you want to clear your entire watch history?')) {
    currentUser.history = [];
    syncUserData();
    renderHistoryList();
    showToast('Playback history cleared', 'success');
  }
}

function setPlayMode(mode) {
  playMode = mode;
  const vBtn = document.getElementById('modeVideoBtn');
  const aBtn = document.getElementById('modeAudioBtn');
  if (vBtn && aBtn) {
    vBtn.classList.toggle('active', mode === 'video');
    aBtn.classList.toggle('active', mode === 'audio');
  }
  // Re-render current player with new mode
  if (activeRecitation && activeRecitation.id) {
    renderPlayerMedia();
  }
  showToast(mode === 'video' ? 'Urdu Tarjuma video mode' : 'HD Audio recitation mode', 'success');
}

function renderPlayerMedia() {
  const { type, id } = activeRecitation;
  const playerWrapper = document.querySelector('.video-player-wrapper');
  if (!playerWrapper) return;

  cleanupCurrentMedia();

  const embedUrl = getYouTubeEmbedUrl(type, id);
  const ytSearchQuery = getRecitationSearchQuery(type, id) || `Quran recitation ${type} ${id}`;

  if (playMode === 'video' && embedUrl) {
    playerWrapper.innerHTML = `<iframe id="mainVideoPlayer" src="${embedUrl}" title="Quran Urdu translation video" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:16px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    return;
  }

  if (playMode === 'audio' && type === 'surah') {
    const audioUrl = getAudioUrl(id);
    const surah = SURAH_LIST.find(s => s.number === id);
    playerWrapper.innerHTML = `
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%;position:absolute;background:linear-gradient(135deg,var(--bg-secondary),var(--bg-tertiary));border-radius:16px;gap:20px;padding:24px;text-align:center;">
        <i class="fa-solid fa-headphones" style="font-size:4rem;color:var(--accent-gold);"></i>
        <h3 style="color:var(--text-primary);">Surah ${surah ? surah.transliteration : ''}</h3>
        <div class="arabic-text" style="font-size:1.6rem;color:var(--text-gold);">${surah ? surah.arabic : ''}</div>
        <audio id="mainAudioPlayer" controls autoplay playsinline preload="none" crossorigin="anonymous" style="width:100%;max-width:560px;">
          <source src="${audioUrl}" type="audio/mpeg">
        </audio>
        <p style="color:var(--text-secondary);font-size:0.85rem;">Agar autoplay block ho jaye to play button dabayein.</p>
      </div>`;

    currentInlineAudio = document.getElementById('mainAudioPlayer');
    if (currentInlineAudio) {
      currentInlineAudio.addEventListener('ended', stopVisualizer, { once: true });
      currentInlineAudio.addEventListener('pause', stopVisualizer);
      currentInlineAudio.addEventListener('play', startVisualizer);
      currentInlineAudio.addEventListener('error', () => {
        showToast('Audio source load nahi ho saki', 'warning');
        stopVisualizer();
      }, { once: true });
      currentInlineAudio.play().catch(() => {
        showToast('Audio play karne ke liye player ka play button dabayein', 'warning');
      });
    }
    return;
  }

  // Fallback: no embed available
  playerWrapper.innerHTML = `
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;height:100%;position:absolute;background:linear-gradient(135deg,var(--bg-secondary),var(--bg-tertiary));border-radius:16px;gap:20px;padding:24px;text-align:center;">
      <i class="fa-solid fa-circle-exclamation" style="font-size:3rem;color:var(--accent-gold);"></i>
      <p style="color:var(--text-secondary);">This recitation is not available in the selected mode.</p>
      <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ytSearchQuery)}" target="_blank" rel="noopener" class="player-btn" style="text-decoration:none;">
        <i class="fa-brands fa-youtube"></i> Search on YouTube
      </a>
    </div>`;
}

/* ================= RECITATION VIDEO PLAYER ================= */
function playRecitation(type, id) {
  activeRecitation = { type, id };

  let titleEng = '', titleAr = '', versesText = '', typeText = '';

  if (type === 'surah') {
    const surah = SURAH_LIST.find(s => s.number === id);
    if (!surah) return;
    titleEng = `Surah ${surah.transliteration} (${surah.translation})`;
    titleAr = surah.arabic;
    versesText = `${surah.verses} Verses`;
    typeText = surah.type;
    showToast(`Surah ${surah.transliteration} shuru ho rahi hai...`, 'success');
  } else {
    const para = PARA_LIST.find(p => p.juz === id);
    if (!para) return;
    titleEng = `Para ${para.juz} - ${para.transliteration}`;
    titleAr = para.arabic;
    versesText = para.description;
    typeText = 'Para / Juz';
    showToast(`Para ${para.juz} (${para.transliteration}) shuru ho raha hai...`, 'success');
  }

  renderPlayerMedia();

  // Update Player Details
  document.getElementById('playerTitleEng').innerText = titleEng;
  document.getElementById('playerTitleAr').innerText = titleAr;
  document.getElementById('playerMetaVerses').innerText = versesText;
  document.getElementById('playerMetaType').innerText = typeText;

  addToHistory(type, id, titleEng, titleAr);
  startVisualizer();
  if (type === 'surah') loadAyaat(id);
  switchTab('home');
}

/* ================= QURAN AYAAT LOADER ================= */
async function loadAyaat(surahNumber) {
  const reader = document.getElementById('ayatReader');
  const counter = document.getElementById('ayatCounter');
  if (!reader) return;
  reader.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:var(--accent-gold);"></i><p style="margin-top:12px;">Ayaat load ho rahi hain...</p></div>`;
  if (counter) counter.innerText = 'Loading...';
  try {
    const [arRes, urRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`)
    ]);
    const arData = await arRes.json();
    const urData = await urRes.json();
    if (arData.code !== 200 || urData.code !== 200) throw new Error('API error');
    const arAyat = arData.data.ayahs;
    const urAyat = urData.data.ayahs;
    if (counter) counter.innerText = `${arAyat.length} Ayaat`;
    reader.innerHTML = arAyat.map((a, i) => `
      <div style="padding:18px 14px;border-bottom:1px solid var(--glass-border);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="background:var(--accent-gold);color:#000;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;">${a.numberInSurah}</span>
        </div>
        <div class="arabic-text" style="font-size:1.8rem;line-height:2.6;color:var(--text-gold);text-align:right;direction:rtl;margin-bottom:12px;">${a.text}</div>
        <div style="font-size:1.05rem;line-height:1.9;color:var(--text-primary);text-align:right;direction:rtl;font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;">${urAyat[i] ? urAyat[i].text : ''}</div>
      </div>
    `).join('');
  } catch (err) {
    reader.innerHTML = `<div class="empty-placeholder"><i class="fa-solid fa-triangle-exclamation"></i><div class="empty-placeholder-title">Ayaat load nahi ho saki</div><div class="empty-placeholder-desc">Internet check karein aur dobara try karein.</div></div>`;
    if (counter) counter.innerText = 'Error';
  }
}

/* ================= DOWNLOAD MANAGER ================= */
function renderDownloadsList() {
  const container = document.getElementById('downloadGrid');
  container.innerHTML = '';
  
  if (!currentUser || !currentUser.downloads || currentUser.downloads.length === 0) {
    container.innerHTML = `
      <div class="empty-placeholder" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-circle-down"></i>
        <div class="empty-placeholder-title">No Offline Downloads</div>
        <div class="empty-placeholder-desc">Click 'Download Recitation MP3' on the player or any Surah to save offline copies.</div>
      </div>
    `;
    document.getElementById('downloadsCounter').innerText = '0 Files';
    return;
  }
  
  document.getElementById('downloadsCounter').innerText = `${currentUser.downloads.length} Files`;
  
  currentUser.downloads.forEach(dl => {
    const card = document.createElement('div');
    card.className = 'download-card';
    
    const isCompleted = dl.status === 'completed';
    const percent = dl.progress || 0;
    
    card.innerHTML = `
      <div class="download-card-header">
        <div>
          <div class="download-card-title">${dl.title}</div>
          <div class="download-card-sub">${dl.type.toUpperCase()} • ${dl.fileSize || 'N/A'}</div>
        </div>
        <i class="fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-circle-arrow-down'}" style="color: ${isCompleted ? 'var(--accent-emerald)' : 'var(--accent-gold)'}; font-size: 1.2rem;"></i>
      </div>
      
      <div class="download-progress-container">
        <div class="download-progress-bar">
          <div class="download-progress-fill" style="width: ${percent}%"></div>
        </div>
        <div class="download-status-text">
          <span>${isCompleted ? 'Saved Offline' : 'Downloading...'}</span>
          <span>${percent}%</span>
        </div>
      </div>
      
      <div class="download-card-actions">
        ${isCompleted ? `
          <button class="player-btn" style="flex-grow: 1;" onclick="playOfflineAudio('${dl.audioUrl}', '${dl.title}')">
            <i class="fa-solid fa-volume-high"></i> Play Offline Audio
          </button>
        ` : `
          <button class="player-btn" style="flex-grow: 1; pointer-events: none; opacity: 0.6;">
            <i class="fa-solid fa-spinner fa-spin"></i> Processing...
          </button>
        `}
        <button class="history-action-btn" style="border-radius: 12px; width: 42px; height: 42px;" title="Delete File" onclick="deleteDownload('${dl.id}', event)">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function triggerDownloadFromPlayer() {
  if (activeRecitation.type !== 'surah') {
    showToast('Downloads are currently optimized for Surah audio recitations.', 'warning');
    return;
  }
  
  const surahNum = activeRecitation.id;
  const surah = SURAH_LIST.find(s => s.number === surahNum);
  if (!surah) return;
  
  initiateDownload(surah);
}

function initiateDownload(surah) {
  if (!currentUser) return;
  if (!currentUser.downloads) currentUser.downloads = [];
  
  // Check if already exists
  const exists = currentUser.downloads.some(d => d.surahNumber === surah.number);
  if (exists) {
    showToast(`Surah ${surah.transliteration} is already downloaded or in progress.`, 'warning');
    return;
  }
  
  const dlId = 'dl_' + Date.now();
  const audioUrl = getAudioUrl(surah.number);
  const pdfUrl = getPdfUrl(surah.number);
  
  const newDownload = {
    id: dlId,
    surahNumber: surah.number,
    title: `Surah ${surah.transliteration} Recitation`,
    type: 'mp3',
    audioUrl,
    progress: 0,
    status: 'downloading',
    fileSize: (Math.random() * (12 - 2) + 2).toFixed(1) + ' MB' // Simulating realistic file sizes
  };
  
  currentUser.downloads.push(newDownload);
  syncUserData();
  showToast(`Initiating download for Surah ${surah.transliteration}...`, 'success');
  
  // Switch to downloads tab to view progress
  switchTab('downloads');
  
  // Trigger real file download in background browser
  // This downloads the actual high-quality Mishary Rashid Alafasy recitation MP3 file
  const anchor = document.createElement('a');
  anchor.href = audioUrl;
  anchor.download = `Surah_${surah.transliteration}_Mishary_Alafasy.mp3`;
  anchor.target = '_blank'; // Fail-safe fallback if browser blocks download
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  
  // Animate web application download bar progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Update completion
      const dlItem = currentUser.downloads.find(d => d.id === dlId);
      if (dlItem) {
        dlItem.progress = 100;
        dlItem.status = 'completed';
        syncUserData();
        renderDownloadsList();
        showToast(`Offline Recitation for Surah ${surah.transliteration} Saved!`, 'success');
      }
    } else {
      const dlItem = currentUser.downloads.find(d => d.id === dlId);
      if (dlItem) {
        dlItem.progress = progress;
        syncUserData();
        renderDownloadsList();
      }
    }
  }, 400);
}

function playOfflineAudio(audioUrl, title) {
  // Renders a custom audio component overlay or direct link to play audio offline
  showToast(`Streaming Saved Audio: ${title}`, 'success');
  cleanupCurrentMedia();
  
  // Load and play the MP3 audio directly in the video panel by replacing iframe with audio tag, or opening raw URL
  const playerWrapper = document.querySelector('.video-player-wrapper');
  playerWrapper.innerHTML = `
    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; width:100%; height:100%; position:absolute; background: var(--bg-secondary); border-radius:16px;">
      <i class="fa-solid fa-volume-high" style="font-size: 4rem; color: var(--accent-gold); margin-bottom: 20px; animation: float 3s ease-in-out infinite;"></i>
      <h3 style="margin-bottom: 20px; font-weight:600; text-align:center;">${title}</h3>
      <audio id="mainAudioPlayer" controls autoplay playsinline preload="none" crossorigin="anonymous" style="width: 80%; outline: none; accent-color: var(--accent-gold);">
        <source src="${audioUrl}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <button class="player-btn" style="margin-top:20px; max-width:200px;" onclick="restoreVideoPlayer()">
        <i class="fa-solid fa-video"></i> Switch back to Video
      </button>
    </div>
  `;

  currentInlineAudio = document.getElementById('mainAudioPlayer');
  
  startVisualizer();
}

function restoreVideoPlayer() {
  cleanupCurrentMedia();
  const embedUrl = getYouTubeEmbedUrl(activeRecitation.type, activeRecitation.id);
  const playerWrapper = document.querySelector('.video-player-wrapper');
  if (embedUrl) {
    playerWrapper.innerHTML = `<iframe id="mainVideoPlayer" src="${embedUrl}" title="Quran Urdu translation video" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:16px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
}

function deleteDownload(dlId, event) {
  if (event) event.stopPropagation();
  
  if (!currentUser || !currentUser.downloads) return;
  
  currentUser.downloads = currentUser.downloads.filter(item => item.id !== dlId);
  syncUserData();
  renderDownloadsList();
  showToast('Offline media file deleted', 'success');
}

/* ================= LIVE SEARCH PARSER ================= */
function handleSearch(val) {
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    const query = val.trim().toLowerCase();
    
    // Identify current active section to filter
    const activeSection = document.querySelector('.view-section.active');
    const activeSectionId = activeSection ? activeSection.id : 'view-home';
    
    if (activeSectionId === 'view-surahs') {
      filterSurahs(query);
    } else if (activeSectionId === 'view-paras') {
      filterParas(query);
    } else {
      // If user searches from home tab, we search both and render a custom search results zone
      // Or we automatically switch to Surahs tab and apply the filter
      if (query.length > 0) {
        filterSurahs(query);
        filterParas(query);
        // Switch to appropriate list tab
        if (query.includes('para') || query.includes('juz') || (!isNaN(query) && parseInt(query) <= 30 && parseInt(query) > 0 && query.length < 3)) {
          switchTab('paras');
          document.getElementById('searchInput').value = val; // preserve text
          filterParas(query);
        } else {
          switchTab('surahs');
          document.getElementById('searchInput').value = val; // preserve text
          filterSurahs(query);
        }
      }
    }
  }, 300);
}

function filterSurahs(query) {
  if (!query) {
    renderSurahsList(SURAH_LIST);
    return;
  }
  
  const filtered = SURAH_LIST.filter(surah => {
    return (
      surah.number.toString() === query ||
      surah.transliteration.toLowerCase().includes(query) ||
      surah.translation.toLowerCase().includes(query) ||
      surah.arabic.includes(query) ||
      surah.urduName.includes(query) ||
      surah.type.toLowerCase() === query
    );
  });
  
  renderSurahsList(filtered);
}

function filterParas(query) {
  if (!query) {
    renderParasList(PARA_LIST);
    return;
  }
  
  // Clean query of phrases like "para" or "juz" to match numbers easily
  const cleanQuery = query.replace('para', '').replace('juz', '').trim();
  
  const filtered = PARA_LIST.filter(para => {
    return (
      para.juz.toString() === cleanQuery ||
      para.transliteration.toLowerCase().includes(query) ||
      para.arabic.includes(query) ||
      para.urdu.includes(query) ||
      para.description.toLowerCase().includes(query)
    );
  });
  
  renderParasList(filtered);
}
