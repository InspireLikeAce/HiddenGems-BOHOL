// ===== AUTH =====
function getAuthUser() {
  try { return JSON.parse(localStorage.getItem('hg_user')); } catch(e) { return null; }
}
function saveAuthUser(user) {
  localStorage.setItem('hg_user', JSON.stringify(user));
}
function clearAuthUser() {
  localStorage.removeItem('hg_user');
}

function renderAuthBtn() {
  const user = getAuthUser();
  const el = document.getElementById('authBtn');
  if (!el) return;
  if (user) {
    el.innerHTML =
      '<div class="auth-avatar" onclick="toggleAuthDropdown()" title="'+user.name+'">'
      +'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'
      +'<span class="auth-name">'+user.name+'</span>'
      +'</div>'
      +'<div class="auth-dropdown" id="authDropdown">'
      +'<div class="auth-dropdown-header"><strong>'+user.name+'</strong><span>'+user.email+'</span></div>'
      +'<button class="auth-signout-btn" onclick="signOut()">Sign Out</button>'
      +'</div>';
  } else {
    el.innerHTML =
      '<button class="auth-login-btn" onclick="openAuthModal()">'
      +'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>'
      +'<span>Log In</span>'
      +'</button>';
  }
}

function toggleAuthDropdown() {
  document.getElementById('authDropdown').classList.toggle('open');
}

function openAuthModal() {
  document.getElementById('authModal').classList.add('open');
  showAuthTab('login');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  document.getElementById('authError').textContent = '';
}

function showAuthTab(tab) {
  document.getElementById('authError').textContent = '';
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
  document.getElementById('form-'+tab).classList.add('active');
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  const users = JSON.parse(localStorage.getItem('hg_users') || '[]');
  const found = users.find(u => u.email === email && u.password === pass);
  if (!found) { document.getElementById('authError').textContent = 'Invalid email or password.'; return; }
  saveAuthUser({ name: found.name, email: found.email });
  closeAuthModal();
  renderAuthBtn();
}

function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  if (!name || !email || !pass) { document.getElementById('authError').textContent = 'Please fill in all fields.'; return; }
  const users = JSON.parse(localStorage.getItem('hg_users') || '[]');
  if (users.find(u => u.email === email)) { document.getElementById('authError').textContent = 'Email already registered.'; return; }
  users.push({ name, email, password: pass });
  localStorage.setItem('hg_users', JSON.stringify(users));
  saveAuthUser({ name, email });
  closeAuthModal();
  renderAuthBtn();
}

function signOut() {
  clearAuthUser();
  renderAuthBtn();
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const btn = document.getElementById('authBtn');
  if (btn && !btn.contains(e.target)) {
    const dd = document.getElementById('authDropdown');
    if (dd) dd.classList.remove('open');
  }
});

// ===== NAVBAR =====
function getNavbar(activePage) {
  const links = [
    { href: "index.html", label: "HOME", id: "home" },
    { href: "destinations.html", label: "DESTINATIONS", id: "destinations" },
    { href: "why-it-matters.html", label: "WHY IT MATTERS", id: "why" },
    { href: "responsible-tourism.html", label: "RESPONSIBLE TOURISM", id: "responsible" },
    { href: "gallery.html", label: "GALLERY", id: "gallery" },
    { href: "about.html", label: "ABOUT", id: "about" }
  ];
  const navLinksHtml = links.map(l =>
    '<a href="'+l.href+'" class="'+(l.id===activePage?'active':'')+'">'+l.label+'</a>'
  ).join('');
  const mobileLinksHtml = links.map(l =>
    '<a href="'+l.href+'" class="'+(l.id===activePage?'active':'')+'">'+l.label+'</a>'
  ).join('');

  return '<nav class="navbar"><div class="container">'
    +'<a href="index.html" class="navbar-brand"><span class="name">HiddenGems</span><span class="sub">BOHOL</span></a>'
    +'<div class="nav-links">'+navLinksHtml+'</div>'
    +'<div class="nav-right">'
    +'<a href="destinations.html" class="nav-cta desktop-cta">EXPLORE NOW</a>'
    +'<div class="auth-wrap" id="authBtn"></div>'
    +'</div>'
    +'<button class="hamburger" onclick="toggleMenu()" aria-label="Menu"><span></span><span></span><span></span></button>'
    +'</div>'
    +'<div class="mobile-menu" id="mobileMenu">'+mobileLinksHtml
    +'<a href="destinations.html" class="nav-cta" style="display:inline-block;margin-top:0.75rem;">EXPLORE NOW</a>'
    +'</div></nav>'
    // Auth Modal
    +'<div class="auth-modal-overlay" id="authModal" onclick="handleModalClick(event)">'
    +'<div class="auth-modal">'
    +'<button class="auth-modal-close" onclick="closeAuthModal()">✕</button>'
    +'<div class="auth-modal-brand"><span class="name">HiddenGems</span><span class="sub">BOHOL</span></div>'
    +'<div class="auth-tabs">'
    +'<button class="auth-tab active" id="tab-login" onclick="showAuthTab(\'login\')">Log In</button>'
    +'<button class="auth-tab" id="tab-register" onclick="showAuthTab(\'register\')">Sign Up</button>'
    +'</div>'
    +'<div class="auth-form active" id="form-login">'
    +'<input class="auth-input" type="email" id="login-email" placeholder="Email address">'
    +'<input class="auth-input" type="password" id="login-pass" placeholder="Password">'
    +'<button class="auth-submit" onclick="doLogin()">Log In</button>'
    +'</div>'
    +'<div class="auth-form" id="form-register">'
    +'<input class="auth-input" type="text" id="reg-name" placeholder="Full name">'
    +'<input class="auth-input" type="email" id="reg-email" placeholder="Email address">'
    +'<input class="auth-input" type="password" id="reg-pass" placeholder="Password">'
    +'<button class="auth-submit" onclick="doRegister()">Create Account</button>'
    +'</div>'
    +'<p class="auth-error" id="authError"></p>'
    +'</div></div>';
}

function handleModalClick(e) {
  if (e.target.id === 'authModal') closeAuthModal();
}

function getFooter() {
  return '<footer class="footer"><div class="container"><div class="footer-grid">'
    +'<div><h3>HiddenGems</h3><span class="sub">BOHOL</span><p>Promoting lesser-known destinations in Bohol and encouraging sustainable tourism.</p></div>'
    +'<div><h4>Quick Links</h4><div class="footer-links">'
    +'<a href="destinations.html">Destinations</a><a href="why-it-matters.html">Why It Matters</a>'
    +'<a href="responsible-tourism.html">Responsible Tourism</a><a href="gallery.html">Gallery</a><a href="about.html">About</a>'
    +'</div></div>'
    +'<div><h4>Support SDGs</h4><p>This project supports UN Sustainable Development Goals for responsible consumption, life on land, and sustainable cities.</p></div>'
    +'</div><div class="footer-bottom">&copy; '+new Date().getFullYear()+' HiddenGems Bohol. All rights reserved.</div></div></footer>';
}

function getPageHeader(subtitle, title, description) {
  return '<section class="page-header"><div class="container">'
    +(subtitle?'<p class="section-tag">'+subtitle+'</p>':'')
    +'<h1>'+title+'</h1>'
    +(description?'<p>'+description+'</p>':'')
    +'</div></section>';
}

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Init auth on every page load
document.addEventListener('DOMContentLoaded', function() {
  renderAuthBtn();
});