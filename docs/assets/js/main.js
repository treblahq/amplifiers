const sections = document.querySelectorAll('.page-header[id], .doc-section[id], .amp-entry[id]');
const sidebarItems = document.querySelectorAll('.sidebar-item[href^="#"]');
const tocLinks = document.querySelectorAll('.toc-link[href^="#"]');
const copyButton = document.getElementById('copy-code-btn');
const searchTrigger = document.getElementById('search-trigger');
const searchableEntries = document.querySelectorAll('.amp-entry');

const copyDefaultLabel = '<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/></svg> Copy';
const copySuccessLabel = '<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg> Copied!';

function getActiveId() {
  const scrollY = window.scrollY + 80;
  let active = null;
  sections.forEach(el => {
    if (el.offsetTop <= scrollY) active = el.id;
  });
  return active;
}

function setActiveState(element, isActive) {
  element.classList.toggle('active', isActive);
  if (isActive) {
    element.setAttribute('aria-current', 'location');
  } else {
    element.removeAttribute('aria-current');
  }
}

function updateActive() {
  const id = getActiveId();
  sidebarItems.forEach(el => {
    const href = el.getAttribute('href');
    setActiveState(el, href === '#' + id);
  });
  tocLinks.forEach(el => {
    const href = el.getAttribute('href');
    setActiveState(el, href === '#' + id);
  });
}

async function copyCode() {
  const code = document.getElementById('example-code').innerText;
  if (!navigator.clipboard || !copyButton) return;

  try {
    await navigator.clipboard.writeText(code);
    copyButton.innerHTML = copySuccessLabel;
  } catch {
    copyButton.textContent = 'Copy failed';
  }

  setTimeout(() => {
    copyButton.innerHTML = copyDefaultLabel;
  }, 2000);
}

function runSearch() {
  const query = window.prompt('Search amplifiers by name or slug:');
  if (query === null) return;

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return;

  const match = Array.from(searchableEntries).find(entry => {
    const title = entry.querySelector('.amp-title')?.textContent?.toLowerCase() ?? '';
    const slug = entry.querySelector('.amp-slug')?.textContent?.toLowerCase() ?? '';
    return title.includes(normalizedQuery) || slug.includes(normalizedQuery);
  });

  if (!match) {
    window.alert('No matching amplifier found.');
    return;
  }

  match.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${match.id}`);
  updateActive();
}

if (copyButton) {
  copyButton.addEventListener('click', copyCode);
}

if (searchTrigger) {
  searchTrigger.addEventListener('click', runSearch);
}

window.addEventListener('keydown', (event) => {
  if (!(event.metaKey || event.ctrlKey)) return;
  if (event.key.toLowerCase() !== 'k') return;

  event.preventDefault();
  runSearch();
});

window.addEventListener('scroll', updateActive, { passive: true });
window.addEventListener('hashchange', updateActive);
updateActive();
