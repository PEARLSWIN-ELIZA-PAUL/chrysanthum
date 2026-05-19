// cursor
const cur = document.getElementById('cur');
let mx = innerWidth/2, my = innerHeight/2;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function move(){ cur.style.left = mx+'px'; cur.style.top = my+'px'; requestAnimationFrame(move); })();

// nav
window.addEventListener('scroll', () => { document.getElementById('nav').classList.toggle('scrolled', scrollY > 50); });

// reveal observer
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.projects-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const sec = document.getElementById('tab-' + btn.dataset.tab);
    sec.classList.add('active');
    sec.querySelectorAll('.reveal').forEach(el => { el.classList.remove('visible'); setTimeout(() => obs.observe(el), 60); });
    window.scrollTo({ top: document.querySelector('.tab-nav-wrap').offsetTop - 70, behavior: 'smooth' });
  });
});

// PDF modal
function openPDF(title, category, url) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalSubtitle').textContent = category;
  const badge = document.getElementById('modalBadge');
  badge.textContent = 'PDF'; badge.className = 'modal-type-badge pdf';
  document.getElementById('modalBox').classList.remove('video-mode');
  document.getElementById('modalFooterNote').innerHTML = 'viewing in browser · <em>no download needed</em>';
  const body = document.getElementById('modalBody');
  const action = document.getElementById('modalAction');

  if (!url || url === 'YOUR_PDF_LINK_HERE') {
    body.innerHTML = `
      <div class="modal-placeholder">
        <div class="modal-placeholder-icon">📄</div>
        <div class="modal-placeholder-title">PDF not added yet</div>
        <div class="modal-placeholder-steps">
          <strong>How to add your PDF:</strong><br/>
          1. Upload your PDF to Google Drive<br/>
          2. Right click → Share → "Anyone with link can view"<br/>
          3. Copy the link<br/>
          4. Replace YOUR_PDF_LINK_HERE in the code
        </div>
      </div>`;
    action.href = '#';
  } else {
    let embedUrl = url;
    if (url.includes('drive.google.com/file/d/')) {
      const id = url.match(/\/d\/([^/]+)/)?.[1];
      if (id) embedUrl = `https://drive.google.com/file/d/${id}/preview`;
    }
    body.innerHTML = `<iframe class="modal-iframe" src="${embedUrl}" title="${title}"></iframe>`;
    action.href = url;
  }
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Close PDF modal
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalBody').innerHTML = '';
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeVideoModal(); } });

// Video modal
function openVideoModal(src) {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  video.src = src;
  modal.style.display = 'flex';
  video.play();
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  video.pause();
  video.src = '';
  modal.style.display = 'none';
}

document.getElementById('video-modal').addEventListener('click', function(e) {
  if (e.target === this) closeVideoModal();
});