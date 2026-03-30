const sections = document.querySelectorAll('.page-header[id], .doc-section[id], .amp-entry[id]');
const sidebarItems = document.querySelectorAll('.sidebar-item[href^="#"]');
const tocLinks = document.querySelectorAll('.toc-link[href^="#"]');
const docsLayout = document.getElementById('docs-layout');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarToggleIcon = document.getElementById('sidebar-toggle-icon');
const sidebarSectionTitles = document.querySelectorAll('[data-sidebar-section-title]');
const sidebarLabels = document.querySelectorAll('[data-sidebar-label]');
const sidebarHashes = document.querySelectorAll('.sidebar-hash');
const sidebarAllItems = document.querySelectorAll('.sidebar-item');
const themeToggle = document.getElementById('theme-toggle');
const themeIconDark = document.getElementById('theme-icon-dark');
const themeIconLight = document.getElementById('theme-icon-light');
const copyButton = document.getElementById('copy-code-btn');
const searchTrigger = document.getElementById('search-trigger');
const searchTriggerMobile = document.getElementById('search-trigger-mobile');
const searchModal = document.getElementById('search-modal');
const searchBackdrop = document.getElementById('search-backdrop');
const searchInput = document.getElementById('search-input');
const searchClose = document.getElementById('search-close');
const searchResults = document.getElementById('search-results');
const searchEmpty = document.getElementById('search-empty');

const copyDefaultLabel = '<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/></svg> Copy';
const copySuccessLabel = '<svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/></svg> Copied!';
const themeStorageKey = 'trebla-theme';
const sidebarStorageKey = 'amplifiers.docs.sidebar.collapsed';
const sidebarExpandedWidth = '272px';
const sidebarCollapsedWidth = '88px';

const searchState = {
  index: [],
  results: [],
  activeResultIndex: -1,
  isOpen: false,
  lastFocusedElement: null,
};

const sidebarState = {
  collapsed: false,
};

function normalizeText(value) {
  return (value ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getSystemPreferredTheme() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function getStoredTheme() {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // Ignore storage errors.
  }
  return null;
}

function updateThemeToggleUi(theme) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  }

  if (themeIconDark) {
    themeIconDark.classList.toggle('hidden', !isDark);
  }

  if (themeIconLight) {
    themeIconLight.classList.toggle('hidden', isDark);
  }
}

function applyTheme(theme, { persist = false } = {}) {
  if (theme !== 'dark' && theme !== 'light') return;

  document.documentElement.setAttribute('data-theme', theme);
  updateThemeToggleUi(theme);

  if (!persist) return;

  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Ignore storage errors.
  }
}

function setupThemeToggle() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const resolvedInitialTheme =
    currentTheme === 'dark' || currentTheme === 'light'
      ? currentTheme
      : getStoredTheme() ?? getSystemPreferredTheme();

  applyTheme(resolvedInitialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, { persist: true });
    });
  }

  if (getStoredTheme() !== null) return;

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onThemeMediaChange = (event) => {
    applyTheme(event.matches ? 'dark' : 'light');
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onThemeMediaChange);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(onThemeMediaChange);
  }
}

function getActiveId() {
  const scrollY = window.scrollY + 80;
  let active = null;
  sections.forEach((el) => {
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
  sidebarItems.forEach((el) => {
    const href = el.getAttribute('href');
    setActiveState(el, href === `#${id}`);
  });
  tocLinks.forEach((el) => {
    const href = el.getAttribute('href');
    setActiveState(el, href === `#${id}`);
  });
}

function setSidebarCollapsed(collapsed) {
  sidebarState.collapsed = collapsed;

  if (docsLayout) {
    docsLayout.dataset.sidebarCollapsed = String(collapsed);
    docsLayout.style.setProperty(
      '--docs-sidebar-width',
      collapsed ? sidebarCollapsedWidth : sidebarExpandedWidth,
    );
  }

  if (sidebarToggle) {
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  }

  if (sidebarToggleIcon) {
    sidebarToggleIcon.style.transform = collapsed ? 'rotate(180deg)' : '';
  }

  sidebarSectionTitles.forEach((element) => {
    element.style.display = collapsed ? 'none' : '';
  });

  sidebarLabels.forEach((element) => {
    element.style.display = collapsed ? 'none' : '';
  });

  sidebarHashes.forEach((element) => {
    element.style.display = collapsed ? 'none' : '';
  });

  sidebarAllItems.forEach((item) => {
    const anchorTitle = item.getAttribute('data-sidebar-item-label');

    if (collapsed) {
      item.style.justifyContent = 'center';
      item.style.gap = '0';
      item.style.paddingLeft = '0.55rem';
      item.style.paddingRight = '0.55rem';
      if (anchorTitle) item.setAttribute('title', anchorTitle);
    } else {
      item.style.justifyContent = '';
      item.style.gap = '';
      item.style.paddingLeft = '';
      item.style.paddingRight = '';
      item.removeAttribute('title');
    }
  });
}

function setupSidebarCollapse() {
  if (!sidebarToggle) return;

  let storedCollapsed = false;
  try {
    storedCollapsed = window.localStorage.getItem(sidebarStorageKey) === 'true';
  } catch {
    storedCollapsed = false;
  }

  setSidebarCollapsed(storedCollapsed);

  sidebarToggle.addEventListener('click', () => {
    const nextCollapsed = !sidebarState.collapsed;
    setSidebarCollapsed(nextCollapsed);

    try {
      window.localStorage.setItem(sidebarStorageKey, String(nextCollapsed));
    } catch {
      // Ignore storage errors (private mode, blocked storage, etc).
    }
  });
}

async function copyCode() {
  const code = document.getElementById('example-code')?.innerText;
  if (!code || !navigator.clipboard || !copyButton) return;

  try {
    await navigator.clipboard.writeText(code);
    copyButton.innerHTML = copySuccessLabel;
  } catch {
    copyButton.textContent = 'Copy failed';
  }

  window.setTimeout(() => {
    copyButton.innerHTML = copyDefaultLabel;
  }, 2000);
}

function getSearchTitle(section) {
  if (section.classList.contains('amp-entry')) {
    return section.querySelector('.amp-title')?.textContent?.trim() ?? section.id;
  }

  const heading = section.querySelector('h1, h2, h3');
  if (heading?.textContent?.trim()) {
    return heading.textContent.trim();
  }

  return section.id;
}

function getSearchDescription(section) {
  if (section.classList.contains('amp-entry')) {
    return section.querySelector('.amp-desc')?.textContent?.trim() ?? '';
  }

  const description = section.querySelector('p');
  return description?.textContent?.trim() ?? '';
}

function buildSearchIndex() {
  const seenIds = new Set();
  return Array.from(sections)
    .map((section) => {
      const id = section.id?.trim();
      if (!id || seenIds.has(id)) return null;

      seenIds.add(id);

      const title = getSearchTitle(section);
      const slug = id.replace(/-/g, ' ');
      const description = getSearchDescription(section);
      const normalizedTitle = normalizeText(title);
      const normalizedSlug = normalizeText(slug);
      const normalizedDescription = normalizeText(description);
      const normalizedCombined = normalizeText(`${title} ${slug} ${description}`);

      return {
        id,
        title,
        slug,
        description,
        normalizedTitle,
        normalizedSlug,
        normalizedDescription,
        normalizedCombined,
      };
    })
    .filter(Boolean);
}

function getSearchScore(entry, normalizedQuery) {
  if (!normalizedQuery) return 0;

  if (entry.normalizedTitle === normalizedQuery || entry.normalizedSlug === normalizedQuery) {
    return 140;
  }

  let score = 0;

  if (entry.normalizedTitle.startsWith(normalizedQuery)) score = Math.max(score, 110);
  if (entry.normalizedSlug.startsWith(normalizedQuery)) score = Math.max(score, 100);
  if (entry.normalizedTitle.includes(normalizedQuery)) score = Math.max(score, 90);
  if (entry.normalizedSlug.includes(normalizedQuery)) score = Math.max(score, 80);
  if (entry.normalizedDescription.includes(normalizedQuery)) score = Math.max(score, 60);

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((token) => entry.normalizedCombined.includes(token))) {
    score = Math.max(score, 70 + Math.min(tokens.length, 4));
  }

  return score;
}

function findSearchResults(query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return searchState.index.slice(0, 8);
  }

  return searchState.index
    .map((entry) => ({
      entry,
      score: getSearchScore(entry, normalizedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.title.localeCompare(b.entry.title);
    })
    .slice(0, 10)
    .map((item) => item.entry);
}

function setSearchExpanded(isExpanded) {
  const expandedValue = String(isExpanded);
  if (searchTrigger) searchTrigger.setAttribute('aria-expanded', expandedValue);
  if (searchTriggerMobile) searchTriggerMobile.setAttribute('aria-expanded', expandedValue);
}

function setActiveSearchResult(index) {
  searchState.activeResultIndex = index;
  if (!searchResults) return;

  const options = searchResults.querySelectorAll('[data-search-option="true"]');
  options.forEach((option, optionIndex) => {
    const isActive = optionIndex === index;
    option.setAttribute('aria-selected', String(isActive));
    option.classList.toggle('border-brand-400/40', isActive);
    option.classList.toggle('bg-brand-500/15', isActive);
    option.classList.toggle('text-doc-text', isActive);
    option.classList.toggle('border-transparent', !isActive);
    option.classList.toggle('text-doc-text2', !isActive);
  });

  if (index >= 0 && options[index]) {
    options[index].scrollIntoView({ block: 'nearest' });
  }
}

function navigateToResult(id) {
  const target = document.getElementById(id);
  if (!target) return;

  closeSearchModal({ restoreFocus: false });

  const top = Math.max(target.getBoundingClientRect().top + window.scrollY - 72, 0);
  window.scrollTo({ top, behavior: 'smooth' });
  history.replaceState(null, '', `#${id}`);
  updateActive();
}

function renderSearchResults(results, query) {
  if (!searchResults || !searchEmpty) return;

  searchState.results = results;
  searchResults.innerHTML = '';

  if (results.length === 0) {
    searchEmpty.classList.remove('hidden');
    searchEmpty.textContent = query
      ? 'No results found. Try another keyword.'
      : 'Type to search sections and amplifiers.';
    setActiveSearchResult(-1);
    return;
  }

  searchEmpty.classList.add('hidden');

  results.forEach((entry, index) => {
    const item = document.createElement('li');

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', 'false');
    button.dataset.searchOption = 'true';
    button.className =
      'flex w-full flex-col items-start gap-1 rounded-lg border border-transparent px-3 py-2 text-left text-doc-text2 transition hover:border-brand-400/30 hover:bg-brand-500/10 hover:text-doc-text';

    const title = document.createElement('p');
    title.className = 'text-sm font-semibold tracking-tight';
    title.textContent = entry.title;

    const meta = document.createElement('p');
    meta.className = 'font-mono text-[11px] uppercase tracking-wide text-doc-muted';
    meta.textContent = `#${entry.id}`;

    button.append(title, meta);

    if (entry.description) {
      const description = document.createElement('p');
      description.className = 'line-clamp-2 text-xs text-doc-muted';
      description.textContent = entry.description;
      button.append(description);
    }

    button.addEventListener('click', () => navigateToResult(entry.id));
    button.addEventListener('mouseenter', () => setActiveSearchResult(index));

    item.append(button);
    searchResults.append(item);
  });

  setActiveSearchResult(0);
}

function openSearchModal(initialQuery = '') {
  if (!searchModal || !searchInput) return;

  searchState.isOpen = true;
  searchState.lastFocusedElement = document.activeElement;
  setSearchExpanded(true);
  searchModal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  if (typeof initialQuery === 'string') {
    searchInput.value = initialQuery;
  }

  const results = findSearchResults(searchInput.value);
  renderSearchResults(results, searchInput.value);

  window.requestAnimationFrame(() => {
    searchInput.focus();
    searchInput.select();
  });
}

function closeSearchModal({ restoreFocus = true } = {}) {
  if (!searchModal) return;

  searchState.isOpen = false;
  setSearchExpanded(false);
  searchModal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');

  if (restoreFocus && searchState.lastFocusedElement instanceof HTMLElement) {
    searchState.lastFocusedElement.focus();
  }

  searchState.lastFocusedElement = null;
}

function onSearchInput() {
  if (!searchInput) return;

  const results = findSearchResults(searchInput.value);
  renderSearchResults(results, searchInput.value);
}

function onSearchInputKeydown(event) {
  const { results, activeResultIndex } = searchState;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeSearchModal();
    return;
  }

  if (!results.length) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    const nextIndex = (activeResultIndex + 1) % results.length;
    setActiveSearchResult(nextIndex);
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    const previousIndex = (activeResultIndex - 1 + results.length) % results.length;
    setActiveSearchResult(previousIndex);
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    const safeIndex = activeResultIndex >= 0 ? activeResultIndex : 0;
    const chosen = results[safeIndex];
    if (chosen) navigateToResult(chosen.id);
  }
}

function setupSearch() {
  if (!searchModal || !searchInput || !searchResults || !searchEmpty) return;

  searchState.index = buildSearchIndex();

  if (searchTrigger) {
    searchTrigger.addEventListener('click', () => openSearchModal());
  }

  if (searchTriggerMobile) {
    searchTriggerMobile.addEventListener('click', () => openSearchModal());
  }

  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', () => closeSearchModal());
  }

  if (searchClose) {
    searchClose.addEventListener('click', () => closeSearchModal());
  }

  searchInput.addEventListener('input', onSearchInput);
  searchInput.addEventListener('keydown', onSearchInputKeydown);
}

if (copyButton) {
  copyButton.addEventListener('click', copyCode);
}

setupThemeToggle();
setupSidebarCollapse();
setupSearch();

window.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (searchState.isOpen) {
      closeSearchModal();
    } else {
      openSearchModal();
    }
    return;
  }

  if (event.key === 'Escape' && searchState.isOpen) {
    event.preventDefault();
    closeSearchModal();
  }
});

window.addEventListener('scroll', updateActive, { passive: true });
window.addEventListener('hashchange', updateActive);
updateActive();
