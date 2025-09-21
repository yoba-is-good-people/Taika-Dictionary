



    // --- Database Setup ---
    const db = new Dexie('taikaDictionaryDB');
    db.version(3).stores({
        words: '++id, taika_word, part_of_speech, definition, word_class, *tags, date_created, date_modified',
        grammar: '++id, category, content, date_created, date_modified',
        language_info: '++id, key, value, date_modified',
        founder_info: '++id, key, value, date_modified',
        license_info: '++id, key, value, date_modified',
        audio_files: '++id, word_id, audio_data, file_type, date_created',
        app_settings: '++id, key, value, date_modified',
        word_relationships: '++id, source_word_id, target_word_id, relationship_type, date_created',
        morphology: '++id, word_id, root_words, prefixes, suffixes, morpheme_breakdown, date_created'
    }).upgrade(trans => {
        // Migration for existing data
        console.log('Database upgraded to version 3 - Added word relationships and morphology');
    });

    // --- DOM Elements ---
    const body = document.body;
    const wordsContainer = document.getElementById('wordsContainer');
    const emptyState = document.getElementById('emptyState');
    const wordModal = document.getElementById('wordModal');
    const modalTitle = document.getElementById('modalTitle');
    const wordForm = document.getElementById('wordForm');
    const addWordBtn = document.getElementById('addWordBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveWordBtn = document.getElementById('saveWordBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const typeFilter = document.getElementById('typeFilter');
    const sortSelect = document.getElementById('sortSelect');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    const pagination = document.getElementById('pagination');
    const themeSwitcher = document.getElementById('themeSwitcher');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    
    // Navigation elements
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksElements = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Export elements
    const exportMenuBtn = document.getElementById('exportMenuBtn');
    const exportDropdown = document.getElementById('exportDropdown');
    const exportCsv = document.getElementById('exportCsv');
    const exportExcel = document.getElementById('exportExcel');
    const exportJson = document.getElementById('exportJson');
    const exportPdf = document.getElementById('exportPdf');
    const exportAnki = document.getElementById('exportAnki');
    
    // Audio elements
    const audioInput = document.getElementById('audioInput');
    const recordAudioBtn = document.getElementById('recordAudioBtn');
    const playAudioBtn = document.getElementById('playAudioBtn');
    const audioPreview = document.getElementById('audioPreview');
    
    // Logo elements
    const uploadLogoBtn = document.getElementById('uploadLogoBtn');
    const logoInput = document.getElementById('logoInput');
    const customLogo = document.getElementById('customLogo');
    const defaultIcon = document.getElementById('defaultIcon');
    
    // Duplicate warning
    const duplicateWarning = document.getElementById('duplicateWarning');

    // Form fields
    const wordInput = document.getElementById('wordInput');
    const pronunciationInput = document.getElementById('pronunciationInput');
    const typeInput = document.getElementById('typeInput');
    const wordClassInput = document.getElementById('wordClassInput');
    const definitionInput = document.getElementById('definitionInput');
    const exampleInput = document.getElementById('exampleInput');
    const notesInput = document.getElementById('notesInput');
    const tagInput = document.getElementById('tagInput');
    
    // Morphology fields
    const rootWordsInput = document.getElementById('rootWordsInput');
    const prefixesInput = document.getElementById('prefixesInput');
    const suffixesInput = document.getElementById('suffixesInput');
    const morphemeBreakdownInput = document.getElementById('morphemeBreakdownInput');
    
    // Relationship fields
    const etymologyInput = document.getElementById('etymologyInput');
    const synonymsInput = document.getElementById('synonymsInput');
    const antonymsInput = document.getElementById('antonymsInput');
    const relatedWordsInput = document.getElementById('relatedWordsInput');
    
    // Stats
    const totalWordsEl = document.getElementById('totalWords');
    const totalNounsEl = document.getElementById('totalNouns');
    const totalVerbsEl = document.getElementById('totalVerbs');
    const totalAdjectivesEl = document.getElementById('totalAdjectives');
    
    // Toast
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Bulk editing elements
    const bulkEditBtn = document.getElementById('bulkEditBtn');
    const bulkEditToolbar = document.getElementById('bulkEditToolbar');
    const selectedCount = document.getElementById('selectedCount');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const bulkEditSelectedBtn = document.getElementById('bulkEditSelectedBtn');
    const bulkAddTagBtn = document.getElementById('bulkAddTagBtn');
    const bulkDeleteBtn = document.getElementById('bulkDeleteBtn');
    const exitBulkModeBtn = document.getElementById('exitBulkModeBtn');
    
    // Bulk edit modals
    const bulkEditModal = document.getElementById('bulkEditModal');
    const bulkTagModal = document.getElementById('bulkTagModal');
    const closeBulkModalBtn = document.getElementById('closeBulkModalBtn');
    const closeBulkTagModalBtn = document.getElementById('closeBulkTagModalBtn');
    const cancelBulkEditBtn = document.getElementById('cancelBulkEditBtn');
    const saveBulkEditBtn = document.getElementById('saveBulkEditBtn');
    const cancelBulkTagBtn = document.getElementById('cancelBulkTagBtn');
    const saveBulkTagBtn = document.getElementById('saveBulkTagBtn');
    const bulkEditCount = document.getElementById('bulkEditCount');
    const bulkTagCount = document.getElementById('bulkTagCount');
    
    // Import elements
    const importMenuBtn = document.getElementById('importMenuBtn');
    const importDropdown = document.getElementById('importDropdown');
    const importCsv = document.getElementById('importCsv');
    const importExcel = document.getElementById('importExcel');
    const importJson = document.getElementById('importJson');
    
    
    
    // Logo elements
    const logoContainer = document.getElementById('logoContainer');
    
    // Word search elements
    const etymologyDropdown = document.getElementById('etymologyDropdown');
    const synonymsDropdown = document.getElementById('synonymsDropdown');
    const antonymsDropdown = document.getElementById('antonymsDropdown');
    const relatedWordsDropdown = document.getElementById('relatedWordsDropdown');
    
    const etymologySelected = document.getElementById('etymologySelected');
    const synonymsSelected = document.getElementById('synonymsSelected');
    const antonymsSelected = document.getElementById('antonymsSelected');
    const relatedWordsSelected = document.getElementById('relatedWordsSelected');
    
    // Selected words for relationships
    let selectedEtymology = [];
    let selectedSynonyms = [];
    let selectedAntonyms = [];
    let selectedRelated = [];

    // --- State Management ---
    let currentEditId = null;
    let currentPage = 1;
    const wordsPerPage = 12;
    let currentView = 'cards';
    let currentTags = [];
    let currentSection = 'lexicon';
    let mediaRecorder = null;
    let recordedChunks = [];
    let currentAudioBlob = null;
    let bulkEditMode = false;
    let selectedWords = new Set();

    // --- App Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
        setupEventListeners();
        loadTheme();
        loadStoredData();
        renderApp();
    });

    function setupEventListeners() {
        // Existing lexicon functionality
        addWordBtn.addEventListener('click', openAddModal);
        closeModalBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        saveWordBtn.addEventListener('click', saveWord);
        searchBtn.addEventListener('click', () => { currentPage = 1; renderApp(); });
        searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') { currentPage = 1; renderApp(); } });
        typeFilter.addEventListener('change', () => { currentPage = 1; renderApp(); });
        sortSelect.addEventListener('change', () => { currentPage = 1; renderApp(); });
        clearFiltersBtn.addEventListener('click', clearFilters);
        themeSwitcher.addEventListener('click', toggleTheme);
        cardViewBtn.addEventListener('click', () => switchView('cards'));
        listViewBtn.addEventListener('click', () => switchView('list'));
        tagInput.addEventListener('keydown', handleTagInput);
        
        // Navigation functionality
        mobileNavToggle.addEventListener('click', toggleMobileNav);
        navLinksElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchSection(link.dataset.section);
            });
        });
        
        // Export functionality
        exportMenuBtn.addEventListener('click', toggleExportMenu);
        exportCsv.addEventListener('click', () => exportData('csv'));
        exportExcel.addEventListener('click', () => exportData('excel'));
        exportJson.addEventListener('click', () => exportData('json'));
        exportPdf.addEventListener('click', () => exportData('pdf'));
        exportAnki.addEventListener('click', () => exportData('anki'));
        
        // Import functionality
        importMenuBtn.addEventListener('click', toggleImportMenu);
       
       importCsv.addEventListener('change', (e) => importData(e, 'csv'));
     importExcel.addEventListener('change', (e) => importData(e, 'excel'));
      importJson.addEventListener('change', (e) => importData(e, 'json'));
        
       
        
        // Audio functionality
        audioInput.addEventListener('change', handleAudioUpload);
        recordAudioBtn.addEventListener('click', toggleRecording);
        playAudioBtn.addEventListener('click', playAudio);
        
        // Logo functionality - now clicking the logo container uploads
        logoContainer.addEventListener('click', () => logoInput.click());
        logoInput.addEventListener('change', handleLogoUpload);
        
       
        
        // Word search functionality
        setupWordSearchListeners();
        
        // Grammar section
        const saveGrammarBtn = document.getElementById('saveGrammarBtn');
        if (saveGrammarBtn) {
            saveGrammarBtn.addEventListener('click', saveGrammarData);
        }
        
        // Language info section
        const saveLanguageInfoBtn = document.getElementById('saveLanguageInfoBtn');
        if (saveLanguageInfoBtn) {
            saveLanguageInfoBtn.addEventListener('click', saveLanguageInfo);
        }
        
        // Founder info section
        const saveFounderInfoBtn = document.getElementById('saveFounderInfoBtn');
        if (saveFounderInfoBtn) {
            saveFounderInfoBtn.addEventListener('click', saveFounderInfo);
        }
        
        // License info section
        const saveLicenseInfoBtn = document.getElementById('saveLicenseInfoBtn');
        if (saveLicenseInfoBtn) {
            saveLicenseInfoBtn.addEventListener('click', saveLicenseInfo);
        }
        
        // Word input change for duplicate detection
        wordInput.addEventListener('input', checkForDuplicates);
        
        // Part of speech change for custom fields
        typeInput.addEventListener('change', updateCustomFields);
        
        // Bulk editing functionality
        bulkEditBtn.addEventListener('click', toggleBulkEditMode);
        exitBulkModeBtn.addEventListener('click', exitBulkEditMode);
        selectAllBtn.addEventListener('click', selectAllWords);
        deselectAllBtn.addEventListener('click', deselectAllWords);
        bulkEditSelectedBtn.addEventListener('click', openBulkEditModal);
        bulkAddTagBtn.addEventListener('click', openBulkTagModal);
        bulkDeleteBtn.addEventListener('click', bulkDeleteWords);
        
        // Bulk edit modal event listeners
        closeBulkModalBtn.addEventListener('click', closeBulkEditModal);
        cancelBulkEditBtn.addEventListener('click', closeBulkEditModal);
        saveBulkEditBtn.addEventListener('click', saveBulkEdit);
        
        // Bulk tag modal event listeners
        closeBulkTagModalBtn.addEventListener('click', closeBulkTagModal);
        cancelBulkTagBtn.addEventListener('click', closeBulkTagModal);
        saveBulkTagBtn.addEventListener('click', saveBulkTags);
        
        // Close dropdowns when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === wordModal) closeModal();
            if (e.target === bulkEditModal) closeBulkEditModal();
            if (e.target === bulkTagModal) closeBulkTagModal();
            if (!exportMenuBtn.contains(e.target) && !exportDropdown.contains(e.target)) {
                exportDropdown.classList.remove('show');
            }
            if (!importMenuBtn.contains(e.target) && !importDropdown.contains(e.target)) {
                importDropdown.classList.remove('show');
            }
            if (!settingsMenuBtn.contains(e.target) && !settingsDropdown.contains(e.target)) {
                settingsDropdown.classList.remove('show');
            }
        });
    }

    // --- Core Data & Rendering Functions ---

    async function renderApp() {
        await renderWords();
        await updateStats();
    }
    
    async function renderWords() {
        const allWords = await buildQuery();
        
        const totalWords = allWords.length;
        const totalPages = Math.ceil(totalWords / wordsPerPage);
        
        const startIndex = (currentPage - 1) * wordsPerPage;
        const paginatedWords = allWords.slice(startIndex, startIndex + wordsPerPage);
        
        wordsContainer.innerHTML = '';
        
        if (paginatedWords.length === 0) {
            emptyState.style.display = 'block';
            pagination.innerHTML = '';
            return;
        }
        
        emptyState.style.display = 'none';
        
        paginatedWords.forEach(async (word) => {
            const wordElement = currentView === 'cards' ? createWordCard(word) : createWordListItem(word);
            wordsContainer.appendChild(wordElement);
            
            // Check if word has audio and show audio button
            try {
                const audioFile = await db.audio_files.where('word_id').equals(word.id).first();
                if (audioFile) {
                    const audioBtn = document.getElementById(`audioBtn-${word.id}`);
                    if (audioBtn) {
                        audioBtn.style.display = 'inline-flex';
                    }
                }
            } catch (error) {
                console.error('Error checking audio for word:', word.id);
            }
        });
        
        renderPagination(totalPages);
    }

    async function buildQuery() {
        let query = db.words.toCollection();
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            query = query.filter(word => 
                word.taika_word.toLowerCase().includes(searchTerm) ||
                word.definition.toLowerCase().includes(searchTerm) ||
                (word.tags && word.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
            );
        }

        const filterType = typeFilter.value;
        if (filterType !== 'all') {
            query = query.and(word => word.part_of_speech === filterType);
        }

        // Get all results first, then sort in memory to avoid Promise/Collection mixing
        let results = await query.toArray();
        
        const sortValue = sortSelect.value;
        if (sortValue === 'alphabetical') {
            results.sort((a, b) => a.taika_word.localeCompare(b.taika_word));
        } else if (sortValue === 'newest') {
            results.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        } else {
            results.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
        }
        
        return results;
    }

    function createWordCard(word) {
        const card = document.createElement('div');
        card.className = 'word-card';
        const tagsHTML = word.tags && word.tags.length > 0
            ? `<div class="tags-container">${word.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
            : '';
        
        const checkboxHTML = bulkEditMode 
            ? `<div class="word-checkbox"><input type="checkbox" class="word-select-checkbox" data-word-id="${word.id}" ${selectedWords.has(word.id) ? 'checked' : ''}></div>`
            : '';

        const wordClassHTML = word.word_class ? `<span class="word-class">${word.word_class.replace('-', ' ')}</span>` : '';
        const customFieldsHTML = word.custom_fields && Object.keys(word.custom_fields).length > 0 
            ? `<div class="custom-fields">
                ${Object.entries(word.custom_fields).map(([key, value]) => 
                    `<span class="custom-field"><strong>${key.replace('_', ' ')}:</strong> ${value}</span>`
                ).join('')}
               </div>`
            : '';
            
        card.innerHTML = `
            ${checkboxHTML}
            <div class="card-header">
                <div class="word-header-info">
                    <div class="word-title-row">
                        <span class="word-title">${word.taika_word}</span>
                        ${word.pronunciation_ipa ? `<span class="word-pronunciation">[${word.pronunciation_ipa}]</span>` : ''}
                    </div>
                    <div class="word-meta-row">
                        <span class="word-type">${word.part_of_speech}</span>
                        ${wordClassHTML}
                    </div>
                </div>
                <div class="card-actions-top" style="${bulkEditMode ? 'display: none;' : ''}">
                    <button class="btn btn-secondary btn-sm" onclick="playWordAudio(${word.id})" id="audioBtn-${word.id}" style="display: none;" title="Play pronunciation">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="definition">${word.definition}</div>
                ${word.example_sentence ? `<div class="example"><i class="fas fa-quote-left"></i> <em>${word.example_sentence}</em></div>` : ''}
                ${word.notes ? `<div class="notes"><i class="fas fa-info-circle"></i> ${word.notes}</div>` : ''}
                ${customFieldsHTML}
                ${tagsHTML}
            </div>
            <div class="card-footer">
                <div class="word-meta">
                    <span class="word-date">Added: ${formatDate(word.date_created)}</span>
                    ${word.date_modified !== word.date_created ? `<span class="word-modified">Modified: ${formatDate(word.date_modified)}</span>` : ''}
                </div>
                <div class="card-actions" style="${bulkEditMode ? 'display: none;' : ''}">
                    <button class="btn btn-info btn-sm" onclick="openEditModal(${word.id})" title="Edit word">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteWord(${word.id})" title="Delete word">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener for checkbox if in bulk edit mode
        if (bulkEditMode) {
            const checkbox = card.querySelector('.word-select-checkbox');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedWords.add(parseInt(e.target.dataset.wordId));
                } else {
                    selectedWords.delete(parseInt(e.target.dataset.wordId));
                }
                updateBulkEditToolbar();
            });
        }
        
        return card;
    }
    
    function createWordListItem(word) {
        const item = document.createElement('div');
        item.className = 'word-list-item';
        item.innerHTML = `
            <div class="word-info">
                <span class="word-title">${word.taika_word}</span>
                <span class="word-type">${word.part_of_speech}</span>
            </div>
            <div class="card-actions">
                <button class="btn btn-info btn-sm" onclick="openEditModal(${word.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm" onclick="deleteWord(${word.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        return item;
    }
    
    async function updateStats() {
        totalWordsEl.textContent = await db.words.count();
        totalNounsEl.textContent = await db.words.where('part_of_speech').equals('noun').count();
        totalVerbsEl.textContent = await db.words.where('part_of_speech').equals('verb').count();
        totalAdjectivesEl.textContent = await db.words.where('part_of_speech').equals('adjective').count();
    }
    
    // --- Modal & Data Management ---

    async function openAddModal() {
        currentEditId = null;
        modalTitle.textContent = 'Add New Word';
        wordForm.reset();
        currentTags = [];
        currentAudioBlob = null;
        audioPreview.src = '';
        playAudioBtn.disabled = true;
        duplicateWarning.style.display = 'none';
        
        // Clear morphology fields
        rootWordsInput.value = '';
        prefixesInput.value = '';
        suffixesInput.value = '';
        morphemeBreakdownInput.value = '';
        
        // Clear relationship selections
        selectedEtymology.length = 0;
        selectedSynonyms.length = 0;
        selectedAntonyms.length = 0;
        selectedRelated.length = 0;
        
        // Clear selected word displays
        etymologySelected.innerHTML = '';
        synonymsSelected.innerHTML = '';
        antonymsSelected.innerHTML = '';
        relatedWordsSelected.innerHTML = '';
        
        renderTagsInModal();
        wordModal.style.display = 'flex';
    }

    async function openEditModal(id) {
        const word = await db.words.get(id);
        if (word) {
            currentEditId = id;
            modalTitle.textContent = 'Edit Word';
            wordForm.reset();
            wordInput.value = word.taika_word;
            pronunciationInput.value = word.pronunciation_ipa || '';
            typeInput.value = word.part_of_speech;
            wordClassInput.value = word.word_class || '';
            definitionInput.value = word.definition;
            exampleInput.value = word.example_sentence || '';
            notesInput.value = word.notes || '';
            currentTags = word.tags || [];
            
            // Update custom fields based on part of speech
            updateCustomFields();
            
            // Populate custom fields with existing data
            if (word.custom_fields) {
                populateCustomFields(word.custom_fields);
            }
            
            // Populate relationship dropdowns and load existing relationships
            await populateRelationshipDropdowns();
            await loadWordRelationships(id);
            await loadMorphologyData(id);
            
            // Load audio data if exists
            currentAudioBlob = null;
            audioPreview.src = '';
            playAudioBtn.disabled = true;
            
            try {
                const audioFile = await db.audio_files.where('word_id').equals(id).first();
                if (audioFile) {
                    audioPreview.src = audioFile.audio_data;
                    playAudioBtn.disabled = false;
                    // Note: We don't set currentAudioBlob here since it's the existing audio
                }
            } catch (error) {
                console.error('Error loading audio:', error);
            }
            
            duplicateWarning.style.display = 'none';
            renderTagsInModal();
            wordModal.style.display = 'flex';
        }
    }

    function closeModal() {
        wordModal.style.display = 'none';
    }

    async function saveWord() {
        if (!wordForm.checkValidity()) {
            wordForm.reportValidity();
            return;
        }

        const wordData = {
            taika_word: wordInput.value.trim(),
            pronunciation_ipa: pronunciationInput.value.trim(),
            part_of_speech: typeInput.value,
            word_class: wordClassInput.value,
            definition: definitionInput.value.trim(),
            example_sentence: exampleInput.value.trim(),
            notes: notesInput.value.trim(),
            tags: currentTags,
            custom_fields: getCustomFieldsData(),
            date_modified: new Date().toISOString()
        };
        
        try {
            let wordId;
            if (currentEditId) {
                await db.words.update(currentEditId, wordData);
                wordId = currentEditId;
                showToast('Word updated successfully!');
            } else {
                wordData.date_created = new Date().toISOString();
                wordId = await db.words.add(wordData);
                showToast('Word added successfully!');
            }
            
            // Save audio if present
            if (currentAudioBlob) {
                try {
                    // Convert audio blob to base64 for storage
                    const reader = new FileReader();
                    reader.onload = async () => {
                        await db.audio_files.put({
                            word_id: wordId,
                            audio_data: reader.result,
                            file_type: currentAudioBlob.type,
                            date_created: new Date().toISOString()
                        });
                    };
                    reader.readAsDataURL(currentAudioBlob);
                } catch (audioError) {
                    console.error('Error saving audio:', audioError);
                    // Don't fail the word save if audio save fails
                }
            }
            
            // Save word relationships and morphology
            await saveWordRelationships(wordId);
            await saveMorphologyData(wordId);
            
            closeModal();
            await renderApp();
        } catch (error) {
            console.error("Failed to save word:", error);
            showToast('Error saving word.', 'error');
        }
    }

    async function deleteWord(id) {
        if (confirm('Are you sure you want to delete this word?')) {
            await db.words.delete(id);
            showToast('Word deleted successfully!', 'warning');
            if (currentPage > 1) { // Check if we deleted the last item on a page
                const allWords = await buildQuery();
                if ((currentPage - 1) * wordsPerPage >= allWords.length) {
                    currentPage--;
                }
            }
            await renderApp();
        }
    }
    
    function clearFilters() {
        searchInput.value = '';
        typeFilter.value = 'all';
        sortSelect.value = 'alphabetical';
        currentPage = 1;
        renderApp();
    }
    
    // --- UI & Utility Functions ---

    function switchView(view) {
        currentView = view;
        wordsContainer.className = view === 'cards' ? 'cards-container' : 'list-container';
        cardViewBtn.classList.toggle('active', view === 'cards');
        listViewBtn.classList.toggle('active', view === 'list');
        renderApp();
    }
    
    function renderPagination(totalPages) {
        pagination.innerHTML = '';
        if (totalPages <= 1) return;
        
        const createBtn = (content, page, disabled = false) => {
            const btn = document.createElement('button');
            btn.className = 'page-btn';
            btn.innerHTML = content;
            btn.disabled = disabled;
            if (!disabled) {
                btn.addEventListener('click', () => { currentPage = page; renderApp(); });
            }
            return btn;
        };
        
        // Previous button
        pagination.appendChild(createBtn('<i class="fas fa-chevron-left"></i>', currentPage - 1, currentPage === 1));
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = createBtn(i, i);
            if (i === currentPage) pageBtn.classList.add('active');
            pagination.appendChild(pageBtn);
        }

        // Next button
        pagination.appendChild(createBtn('<i class="fas fa-chevron-right"></i>', currentPage + 1, currentPage === totalPages));
    }

    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        themeSwitcher.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Tag Input Logic
    function handleTagInput(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = tagInput.value.trim();
            if (tag && !currentTags.includes(tag)) {
                currentTags.push(tag);
                renderTagsInModal();
            }
            tagInput.value = '';
        }
    }

    function removeTag(tagToRemove) {
        currentTags = currentTags.filter(tag => tag !== tagToRemove);
        renderTagsInModal();
    }

    function renderTagsInModal() {
        const container = document.querySelector('.tag-input-container');
        // Remove existing tags, but not the input itself
        container.querySelectorAll('.tag').forEach(t => t.remove());
        
        currentTags.slice().reverse().forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.innerHTML = `${tag} <span class="remove-tag" onclick="removeTag('${tag}')">&times;</span>`;
            container.insertBefore(tagEl, tagInput);
        });
    }

    // --- Navigation Functions ---
    function toggleMobileNav() {
        navLinks.classList.toggle('active');
        const icon = mobileNavToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    function switchSection(sectionName) {
        currentSection = sectionName;
        
        // Update navigation active state
        navLinksElements.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionName) {
                link.classList.add('active');
            }
        });
        
        // Update content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionName + '-section') {
                section.classList.add('active');
            }
        });
        
        // Close mobile nav if open
        navLinks.classList.remove('active');
        const icon = mobileNavToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
        
        // Update page based on section
        if (sectionName === 'lexicon') {
            renderApp();
        }
    }

    // --- Duplicate Detection ---
    async function checkForDuplicates() {
        const inputValue = wordInput.value.trim().toLowerCase();
        if (inputValue.length < 2) {
            duplicateWarning.style.display = 'none';
            return;
        }
        
        const existingWords = await db.words
            .where('taika_word')
            .startsWithIgnoreCase(inputValue)
            .toArray();
        
        const similarWords = existingWords.filter(word => 
            word.taika_word.toLowerCase() !== inputValue || 
            (currentEditId && word.id !== currentEditId)
        );
        
        if (similarWords.length > 0) {
            duplicateWarning.style.display = 'block';
            duplicateWarning.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Similar words found:</strong> ${similarWords.slice(0, 3).map(w => w.taika_word).join(', ')}
                ${similarWords.length > 3 ? ' and ' + (similarWords.length - 3) + ' more...' : ''}
            `;
        } else {
            duplicateWarning.style.display = 'none';
        }
    }

// --- [UPDATED] Export Functions ---

function exportToCSV(words, filename) {
    const headers = ['Word', 'Pronunciation', 'Part of Speech', 'Definition', 'Example', 'Notes', 'Tags', 'Created', 'Modified'];
    const csvContent = [
        headers.join(','),
        ...words.map(word => [
            `"${word.taika_word}"`,
            `"${word.pronunciation_ipa || ''}"`,
            `"${word.part_of_speech}"`,
            `"${word.definition}"`,
            `"${word.example_sentence || ''}"`,
            `"${word.notes || ''}"`,
            `"${(word.tags || []).join('; ')}"`,
            `"${formatDate(word.date_created)}"`,
            `"${formatDate(word.date_modified)}"`
        ].join(','))
    ].join('\n');

    // For CSV, we pass the text content directly
    downloadFile(csvContent, `${filename}.csv`);
}

function exportToJSON(words, filename) {
    const data = {
        export_info: {
            language: 'Taika',
            export_date: new Date().toISOString(),
            total_words: words.length,
            version: '1.0'
        },
        words: words.map(word => ({
            taika_word: word.taika_word,
            pronunciation_ipa: word.pronunciation_ipa || null,
            part_of_speech: word.part_of_speech,
            definition: word.definition,
            example_sentence: word.example_sentence || null,
            notes: word.notes || null,
            tags: word.tags || [],
            date_created: word.date_created,
            date_modified: word.date_modified
        }))
    };

    // For JSON, we also pass the text content directly
    downloadFile(JSON.stringify(data, null, 2), `${filename}.json`);
}

// Helper function to convert binary data (like from SheetJS) to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function exportToExcel(words, filename) {
    const ws_data = [
        ['Word', 'Pronunciation', 'Part of Speech', 'Definition', 'Example', 'Notes', 'Tags', 'Created', 'Modified'],
        ...words.map(word => [
            word.taika_word,
            word.pronunciation_ipa || '',
            word.part_of_speech,
            word.definition,
            word.example_sentence || '',
            word.notes || '',
            (word.tags || []).join('; '),
            formatDate(word.date_created),
            formatDate(word.date_modified)
        ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Taika Dictionary');

    // Generate the Excel file as a binary ArrayBuffer
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Convert the ArrayBuffer to a Base64 string for Capacitor
    const base64Data = arrayBufferToBase64(wbout);

    // Pass the Base64 data and specify the encoding
    downloadFile(base64Data, `${filename}.xlsx`, Encoding.UTF8); // Note: Encoding is for the data itself, not the file type.
}

function exportToPDF(words, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // ... (rest of your PDF generation code is fine)
    doc.setFontSize(20);
    doc.text('Taika Dictionary', 20, 20);
    // ... all your doc.text calls ...

    // Generate the PDF output as a Base64 string
    const pdfOutput = doc.output('datauristring'); // This gives "data:application/pdf;base64,..."

    // We need to extract just the Base64 part
    const base64Data = pdfOutput.split(',')[1];

    // Pass the Base64 data to our new download function
    downloadFile(base64Data, `${filename}.pdf`);
}

// Get the plugins from the global Capacitor object
const { Filesystem, Directory, Encoding } = Capacitor.Plugins;
const { FilePicker } = Capacitor.Plugins; // Also get the File Picker for your import functions

// --- [REPLACED] Capacitor-compatible downloadFile function ---
async function downloadFile(content, filename, encoding = Encoding.UTF8) {
    try {
        const { Filesystem } = Capacitor.Plugins;

        const result = await Filesystem.writeFile({
            path: filename,
            data: content,
            directory: Directory.Documents, // Saves to the "Documents" folder
            encoding: encoding,
        });

        console.log('File saved:', result.uri);
        showToast(`Successfully exported to Documents/${filename}`, 'success');

    } catch (e) {
        console.error('Unable to save file', e);
        showToast('Error: Could not save the file.', 'error');
    }
}



    // --- Data Storage Functions ---
    async function saveGrammarData() {
        const grammarCards = document.querySelectorAll('#grammar-section .grammar-card textarea');
        const categories = ['word-order', 'morphology', 'syntax', 'phonology', 'tense-aspect', 'agreement'];
        
        try {
            for (let i = 0; i < grammarCards.length; i++) {
                const content = grammarCards[i].value.trim();
                if (content) {
                    await db.grammar.put({
                        category: categories[i],
                        content: content,
                        date_created: new Date().toISOString(),
                        date_modified: new Date().toISOString()
                    });
                }
            }
            showToast('Grammar notes saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving grammar:', error);
            showToast('Error saving grammar notes.', 'error');
        }
    }

    async function saveLanguageInfo() {
        const fields = {
            'language-name': document.getElementById('languageName').value,
            'language-family': document.getElementById('languageFamily').value,
            'language-description': document.getElementById('languageDescription').value,
            'creation-date': document.getElementById('creationDate').value,
            'development-history': document.getElementById('developmentHistory').value
        };
        
        try {
            for (const [key, value] of Object.entries(fields)) {
                if (value.trim()) {
                    await db.language_info.put({
                        key: key,
                        value: value,
                        date_modified: new Date().toISOString()
                    });
                }
            }
            showToast('Language information saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving language info:', error);
            showToast('Error saving language information.', 'error');
        }
    }

    async function saveFounderInfo() {
        const fields = {
            'creator-name': document.getElementById('creatorName').value,
            'creator-background': document.getElementById('creatorBackground').value,
            'creator-contact': document.getElementById('creatorContact').value
        };
        
        try {
            for (const [key, value] of Object.entries(fields)) {
                if (value.trim()) {
                    await db.founder_info.put({
                        key: key,
                        value: value,
                        date_modified: new Date().toISOString()
                    });
                }
            }
            showToast('Founder information saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving founder info:', error);
            showToast('Error saving founder information.', 'error');
        }
    }

    async function saveLicenseInfo() {
        const fields = {
            'language-license': document.getElementById('languageLicense').value,
            'custom-license': document.getElementById('customLicense').value
        };
        
        try {
            for (const [key, value] of Object.entries(fields)) {
                if (value.trim()) {
                    await db.license_info.put({
                        key: key,
                        value: value,
                        date_modified: new Date().toISOString()
                    });
                }
            }
            showToast('License information saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving license info:', error);
            showToast('Error saving license information.', 'error');
        }
    }

    async function loadStoredData() {
        try {
            // Load grammar data
            const grammarData = await db.grammar.toArray();
            const grammarCards = document.querySelectorAll('#grammar-section .grammar-card textarea');
            const categories = ['word-order', 'morphology', 'syntax', 'phonology', 'tense-aspect', 'agreement'];
            
            grammarData.forEach(item => {
                const index = categories.indexOf(item.category);
                if (index !== -1 && grammarCards[index]) {
                    grammarCards[index].value = item.content;
                }
            });
            
            // Load language info
            const languageInfo = await db.language_info.toArray();
            languageInfo.forEach(item => {
                const element = document.getElementById(item.key.replace('-', '').replace('-', ''));
                if (element) {
                    element.value = item.value;
                }
            });
            
            // Load founder info
            const founderInfo = await db.founder_info.toArray();
            founderInfo.forEach(item => {
                const element = document.getElementById(item.key.replace('-', '').replace('-', ''));
                if (element) {
                    element.value = item.value;
                }
            });
            
            // Load license info
            const licenseInfo = await db.license_info.toArray();
            licenseInfo.forEach(item => {
                const element = document.getElementById(item.key.replace('-', '').replace('-', ''));
                if (element) {
                    element.value = item.value;
                }
            });
            
            // Load logo
            const logoSetting = await db.app_settings.where('key').equals('custom-logo').first();
            if (logoSetting && logoSetting.value) {
                customLogo.src = logoSetting.value;
                customLogo.style.display = 'block';
                defaultIcon.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    // --- Audio Functions ---
    async function handleAudioUpload(event) {
        const file = event.target.files[0];
        if (file) {
            currentAudioBlob = file;
            audioPreview.src = URL.createObjectURL(file);
            playAudioBtn.disabled = false;
            showToast('Audio file uploaded successfully!', 'success');
        }
    }

    async function toggleRecording() {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                recordedChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    currentAudioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                    audioPreview.src = URL.createObjectURL(currentAudioBlob);
                    playAudioBtn.disabled = false;
                    recordAudioBtn.innerHTML = '<i class="fas fa-microphone"></i> Record';
                    recordAudioBtn.classList.remove('btn-danger');
                    recordAudioBtn.classList.add('btn-secondary');
                    showToast('Audio recorded successfully!', 'success');
                };

                mediaRecorder.start();
                recordAudioBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
                recordAudioBtn.classList.remove('btn-secondary');
                recordAudioBtn.classList.add('btn-danger');
            } catch (error) {
                console.error('Error accessing microphone:', error);
                showToast('Could not access microphone. Please check permissions.', 'error');
            }
        } else {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }

    function playAudio() {
        if (audioPreview.src) {
            audioPreview.play();
        }
    }

    // Global function to play word audio from cards
    async function playWordAudio(wordId) {
        try {
            const audioFile = await db.audio_files.where('word_id').equals(wordId).first();
            if (audioFile) {
                const audio = new Audio(audioFile.audio_data);
                audio.play();
            }
        } catch (error) {
            console.error('Error playing word audio:', error);
            showToast('Error playing audio.', 'error');
        }
    }

    // --- Logo Functions ---
    async function handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const dataUrl = e.target.result;
                customLogo.src = dataUrl;
                customLogo.style.display = 'block';
                defaultIcon.style.display = 'none';
                
                // Save to database
                try {
                    await db.app_settings.put({
                        key: 'custom-logo',
                        value: dataUrl,
                        date_modified: new Date().toISOString()
                    });
                    showToast('Logo uploaded successfully!', 'success');
                } catch (error) {
                    console.error('Error saving logo:', error);
                    showToast('Error saving logo.', 'error');
                }
            };
            reader.readAsDataURL(file);
        }
    }

    // --- Anki Export Function ---
    async function exportToAnki(words, filename) {
        // Create Anki-compatible data
        const ankiData = {
            __type__: 'Deck',
            children: [],
            collapsed: false,
            conf: 1,
            desc: 'Taika Dictionary - Exported from Taika Dictionary App',
            dyn: 0,
            extendNew: 10,
            extendRev: 50,
            id: Date.now(),
            lrnToday: [0, 0],
            mod: Math.floor(Date.now() / 1000),
            name: 'Taika Dictionary',
            newToday: [0, 0],
            revToday: [0, 0],
            timeToday: [0, 0],
            usn: -1
        };

        // Create cards data
        const cards = words.map((word, index) => {
            const front = `<div style="font-size: 18px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #2c4c7c;">${word.taika_word}</div>
                ${word.pronunciation_ipa ? `<div style="color: #666; margin-top: 5px;">[${word.pronunciation_ipa}]</div>` : ''}
                <div style="color: #888; font-size: 14px; margin-top: 8px;">${word.part_of_speech}</div>
            </div>`;
            
            const back = `<div style="font-size: 16px; line-height: 1.6;">
                <div style="font-size: 18px; margin-bottom: 15px;">${word.definition}</div>
                ${word.example_sentence ? `<div style="font-style: italic; color: #555; margin-bottom: 10px;">\"${word.example_sentence}\"</div>` : ''}
                ${word.notes ? `<div style="font-size: 14px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">${word.notes}</div>` : ''}
                ${word.tags && word.tags.length > 0 ? `<div style="margin-top: 10px;">${word.tags.map(tag => `<span style="background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-right: 5px;">${tag}</span>`).join('')}</div>` : ''}
            </div>`;

            return {
                id: index + 1,
                front: front,
                back: back,
                tags: word.tags || []
            };
        });

        // Create a simple text export for now (Anki .apkg format requires complex binary encoding)
        // This creates an importable text file for Anki
        const ankiText = cards.map(card => {
            const cleanFront = card.front.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            const cleanBack = card.back.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
            const tags = card.tags.length > 0 ? ` ${card.tags.join(' ')}` : '';
            return `"${cleanFront}"\t"${cleanBack}"${tags}`;
        }).join('\n');

        // Add header with instructions
        const header = `# Taika Dictionary - Anki Import File\n# Instructions:\n# 1. In Anki, go to File > Import\n# 2. Select this file\n# 3. Set field separator to Tab\n# 4. Map Field 1 to Front, Field 2 to Back\n# 5. Set deck name to 'Taika Dictionary'\n\n`;
        
        downloadFile(header + ankiText, `${filename}.txt`, 'text/plain');
        showToast('Anki import file created! Check the file for import instructions.', 'success');
    }

    // Update the main exportData function to include Anki
    async function exportData(format) {
        exportDropdown.classList.remove('show');
        
        try {
            const words = await db.words.orderBy('taika_word').toArray();
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `taika-dictionary-${timestamp}`;
            
            switch (format) {
                case 'csv':
                    exportToCSV(words, filename);
                    break;
                case 'excel':
                    exportToExcel(words, filename);
                    break;
                case 'json':
                    exportToJSON(words, filename);
                    break;
                case 'pdf':
                    exportToPDF(words, filename);
                    break;
                case 'anki':
                    exportToAnki(words, filename);
                    break;
            }
            
            if (format !== 'anki') {
                showToast(`Successfully exported ${words.length} words to ${format.toUpperCase()}!`, 'success');
            }
        } catch (error) {
            console.error('Export error:', error);
            showToast('Export failed. Please try again.', 'error');
        }
    }
    
    // --- Custom Fields Functions ---
    
    const customFieldsConfig = {
        'noun': [
            { name: 'gender', label: 'Gender', type: 'select', options: ['masculine', 'feminine', 'neuter', 'animate', 'inanimate'] },
            { name: 'plural_form', label: 'Plural Form', type: 'text', placeholder: 'e.g., benas (for bena)' },
            { name: 'declension_class', label: 'Declension Class', type: 'select', options: ['Class I', 'Class II', 'Class III', 'Irregular'] }
        ],
        'verb': [
            { name: 'conjugation_class', label: 'Conjugation Class', type: 'select', options: ['Regular', 'Irregular', 'Class I', 'Class II'] },
            { name: 'transitivity', label: 'Transitivity', type: 'select', options: ['transitive', 'intransitive', 'ambitransitive'] },
            { name: 'past_tense', label: 'Past Tense Form', type: 'text', placeholder: 'e.g., benaed' },
            { name: 'present_tense', label: 'Present Tense Form', type: 'text', placeholder: 'e.g., benaes' }
        ],
        'adjective': [
            { name: 'comparative_form', label: 'Comparative Form', type: 'text', placeholder: 'e.g., more beautiful' },
            { name: 'superlative_form', label: 'Superlative Form', type: 'text', placeholder: 'e.g., most beautiful' },
            { name: 'gradable', label: 'Gradable', type: 'checkbox' }
        ],
        'particle': [
            { name: 'particle_function', label: 'Grammatical Function', type: 'select', options: ['topic marker', 'subject marker', 'object marker', 'tense marker', 'aspect marker', 'modal', 'question particle'] },
            { name: 'position', label: 'Position in Sentence', type: 'select', options: ['pre-verbal', 'post-verbal', 'sentence-final', 'sentence-initial', 'variable'] }
        ],
        'affix': [
            { name: 'affix_type', label: 'Affix Type', type: 'select', options: ['prefix', 'suffix', 'infix', 'circumfix'] },
            { name: 'productivity', label: 'Productivity', type: 'select', options: ['highly productive', 'moderately productive', 'limited', 'fossilized'] },
            { name: 'semantic_category', label: 'Semantic Category', type: 'select', options: ['derivational', 'inflectional', 'aspectual', 'temporal', 'modal'] }
        ]
    };
    
    function updateCustomFields() {
        const selectedType = typeInput.value;
        const customFieldsSection = document.getElementById('customFieldsSection');
        const customFieldsContainer = document.getElementById('customFieldsContainer');
        
        // Clear previous custom fields
        customFieldsContainer.innerHTML = '';
        
        if (selectedType && customFieldsConfig[selectedType]) {
            customFieldsSection.style.display = 'block';
            
            customFieldsConfig[selectedType].forEach(field => {
                const fieldDiv = document.createElement('div');
                fieldDiv.className = 'form-group';
                
                const label = document.createElement('label');
                label.className = 'form-label';
                label.textContent = field.label;
                label.setAttribute('for', `custom_${field.name}`);
                
                let input;
                if (field.type === 'select') {
                    input = document.createElement('select');
                    input.className = 'form-control';
                    
                    // Add default option
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Select...';
                    input.appendChild(defaultOption);
                    
                    // Add options
                    field.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.textContent = option;
                        input.appendChild(optionElement);
                    });
                } else if (field.type === 'checkbox') {
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.className = 'form-check-input';
                    input.style.marginLeft = '0';
                    input.style.marginRight = '10px';
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'form-control';
                    if (field.placeholder) {
                        input.placeholder = field.placeholder;
                    }
                }
                
                input.id = `custom_${field.name}`;
                input.dataset.customField = field.name;
                
                fieldDiv.appendChild(label);
                fieldDiv.appendChild(input);
                customFieldsContainer.appendChild(fieldDiv);
            });
        } else {
            customFieldsSection.style.display = 'none';
        }
    }
    
    function getCustomFieldsData() {
        const customFields = {};
        const customInputs = document.querySelectorAll('[data-custom-field]');
        
        customInputs.forEach(input => {
            const fieldName = input.dataset.customField;
            if (input.type === 'checkbox') {
                customFields[fieldName] = input.checked;
            } else if (input.value.trim()) {
                customFields[fieldName] = input.value.trim();
            }
        });
        
        return customFields;
    }
    
    function populateCustomFields(customFieldsData) {
        if (!customFieldsData) return;
        
        Object.entries(customFieldsData).forEach(([fieldName, value]) => {
            const input = document.getElementById(`custom_${fieldName}`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value === true;
                } else {
                    input.value = value;
                }
            }
        });
    }
    
    // --- Bulk Editing Functions ---
    
    function toggleBulkEditMode() {
        bulkEditMode = !bulkEditMode;
        selectedWords.clear();
        
        if (bulkEditMode) {
            bulkEditBtn.innerHTML = '<i class="fas fa-check-square"></i> Exit Select';
            bulkEditBtn.classList.remove('btn-warning');
            bulkEditBtn.classList.add('btn-danger');
            bulkEditToolbar.style.display = 'block';
        } else {
            bulkEditBtn.innerHTML = '<i class="fas fa-check-square"></i> Select';
            bulkEditBtn.classList.remove('btn-danger');
            bulkEditBtn.classList.add('btn-warning');
            bulkEditToolbar.style.display = 'none';
        }
        
        renderApp(); // Re-render to show/hide checkboxes
    }
    
    function exitBulkEditMode() {
        bulkEditMode = false;
        selectedWords.clear();
        bulkEditBtn.innerHTML = '<i class="fas fa-check-square"></i> Select';
        bulkEditBtn.classList.remove('btn-danger');
        bulkEditBtn.classList.add('btn-warning');
        bulkEditToolbar.style.display = 'none';
        renderApp();
    }
    
    async function selectAllWords() {
        const allWords = await buildQuery();
        allWords.forEach(word => selectedWords.add(word.id));
        updateBulkEditToolbar();
        renderApp(); // Re-render to update checkboxes
    }
    
    function deselectAllWords() {
        selectedWords.clear();
        updateBulkEditToolbar();
        renderApp(); // Re-render to update checkboxes
    }
    
    function updateBulkEditToolbar() {
        const count = selectedWords.size;
        selectedCount.textContent = `${count} selected`;
        
        const hasSelection = count > 0;
        bulkEditSelectedBtn.disabled = !hasSelection;
        bulkAddTagBtn.disabled = !hasSelection;
        bulkDeleteBtn.disabled = !hasSelection;
    }
    
    function openBulkEditModal() {
        if (selectedWords.size === 0) return;
        
        bulkEditCount.textContent = selectedWords.size;
        bulkEditModal.style.display = 'flex';
        
        // Reset form
        document.getElementById('bulkEditForm').reset();
    }
    
    function closeBulkEditModal() {
        bulkEditModal.style.display = 'none';
    }
    
    function openBulkTagModal() {
        if (selectedWords.size === 0) return;
        
        bulkTagCount.textContent = selectedWords.size;
        bulkTagModal.style.display = 'flex';
        document.getElementById('bulkOnlyTagsInput').value = '';
    }
    
    function closeBulkTagModal() {
        bulkTagModal.style.display = 'none';
    }
    
    async function saveBulkEdit() {
        const selectedIds = Array.from(selectedWords);
        if (selectedIds.length === 0) return;
        
        const bulkTypeInput = document.getElementById('bulkTypeInput');
        const bulkWordClassInput = document.getElementById('bulkWordClassInput');
        const bulkTagsInput = document.getElementById('bulkTagsInput');
        const bulkNotesAppendInput = document.getElementById('bulkNotesAppendInput');
        
        try {
            for (const wordId of selectedIds) {
                const word = await db.words.get(wordId);
                if (!word) continue;
                
                const updates = {};
                
                // Update part of speech if specified
                if (bulkTypeInput.value) {
                    updates.part_of_speech = bulkTypeInput.value;
                }
                
                // Update word class if specified
                if (bulkWordClassInput.value) {
                    updates.word_class = bulkWordClassInput.value;
                }
                
                // Add tags if specified
                if (bulkTagsInput.value.trim()) {
                    const newTags = bulkTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                    const existingTags = word.tags || [];
                    const combinedTags = [...new Set([...existingTags, ...newTags])];
                    updates.tags = combinedTags;
                }
                
                // Append to notes if specified
                if (bulkNotesAppendInput.value.trim()) {
                    const existingNotes = word.notes || '';
                    const separator = existingNotes ? '\n\n' : '';
                    updates.notes = existingNotes + separator + bulkNotesAppendInput.value.trim();
                }
                
                if (Object.keys(updates).length > 0) {
                    updates.date_modified = new Date().toISOString();
                    await db.words.update(wordId, updates);
                }
            }
            
            showToast(`Successfully updated ${selectedIds.length} words!`, 'success');
            closeBulkEditModal();
            exitBulkEditMode();
            renderApp();
            
        } catch (error) {
            console.error('Error in bulk edit:', error);
            showToast('Error updating words. Please try again.', 'error');
        }
    }
    
    async function saveBulkTags() {
        const selectedIds = Array.from(selectedWords);
        const tagsInput = document.getElementById('bulkOnlyTagsInput').value.trim();
        
        if (selectedIds.length === 0 || !tagsInput) return;
        
        const newTags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        try {
            for (const wordId of selectedIds) {
                const word = await db.words.get(wordId);
                if (!word) continue;
                
                const existingTags = word.tags || [];
                const combinedTags = [...new Set([...existingTags, ...newTags])];
                
                await db.words.update(wordId, {
                    tags: combinedTags,
                    date_modified: new Date().toISOString()
                });
            }
            
            showToast(`Successfully added tags to ${selectedIds.length} words!`, 'success');
            closeBulkTagModal();
            exitBulkEditMode();
            renderApp();
            
        } catch (error) {
            console.error('Error adding tags:', error);
            showToast('Error adding tags. Please try again.', 'error');
        }
    }
    
    async function bulkDeleteWords() {
        const selectedIds = Array.from(selectedWords);
        if (selectedIds.length === 0) return;
        
        const confirmMessage = `Are you sure you want to delete ${selectedIds.length} selected words? This action cannot be undone.`;
        
        if (confirm(confirmMessage)) {
            try {
                for (const wordId of selectedIds) {
                    await db.words.delete(wordId);
                    // Also delete related audio files
                    await db.audio_files.where('word_id').equals(wordId).delete();
                    // Delete related morphology data
                    await db.morphology.where('word_id').equals(wordId).delete();
                    // Delete related relationships
                    await db.word_relationships.where('source_word_id').equals(wordId).delete();
                    await db.word_relationships.where('target_word_id').equals(wordId).delete();
                }
                
                showToast(`Successfully deleted ${selectedIds.length} words!`, 'success');
                exitBulkEditMode();
                renderApp();
                
            } catch (error) {
                console.error('Error deleting words:', error);
                showToast('Error deleting words. Please try again.', 'error');
            }
        }
    }
    
    // --- Import & Settings Functions ---
    
    function toggleImportMenu() {
        importDropdown.classList.toggle('show');
    }
    
  
    
    function toggleExportMenu() {
        exportDropdown.classList.toggle('show');
    }
    
    async function importData(event, format) {
        const file = event.target.files[0];
        if (!file) return;
        
        importDropdown.classList.remove('show');
        
        try {
            let data;
            const text = await file.text();
            
            switch (format) {
                case 'csv':
                    data = parseCSV(text);
                    break;
                case 'json':
                    data = JSON.parse(text);
                    break;
                case 'excel':
                    // For Excel files, we'll handle it differently
                    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    data = XLSX.utils.sheet_to_json(sheet);
                    break;
            }
            
            await importWords(data, format);
            
        } catch (error) {
            console.error('Import error:', error);
            showToast('Import failed. Please check the file format.', 'error');
        }
        
        // Clear the input
        event.target.value = '';
    }
    
    function parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            data.push(obj);
        }
        
        return data;
    }
    
    async function importWords(data, format) {
        let importedCount = 0;
        let errorCount = 0;
        
        for (const item of data) {
            try {
                // Map different field names to our schema
                const wordData = {
                    taika_word: item.taika_word || item.word || item.Word || '',
                    pronunciation_ipa: item.pronunciation_ipa || item.pronunciation || item.Pronunciation || '',
                    part_of_speech: item.part_of_speech || item.type || item.Type || item.pos || '',
                    word_class: item.word_class || item.class || item.Class || '',
                    definition: item.definition || item.Definition || item.meaning || item.Meaning || '',
                    example_sentence: item.example_sentence || item.example || item.Example || '',
                    notes: item.notes || item.Notes || item.etymology || item.Etymology || '',
                    tags: typeof item.tags === 'string' ? item.tags.split(',').map(t => t.trim()) : (item.tags || []),
                    date_created: new Date().toISOString(),
                    date_modified: new Date().toISOString()
                };
                
                // Skip if no word is provided
                if (!wordData.taika_word || !wordData.definition) {
                    errorCount++;
                    continue;
                }
                
                await db.words.add(wordData);
                importedCount++;
                
            } catch (error) {
                console.error('Error importing word:', item, error);
                errorCount++;
            }
        }
        
        const message = `Import completed: ${importedCount} words imported${errorCount > 0 ? `, ${errorCount} errors` : ''}.`;
        showToast(message, errorCount > 0 ? 'warning' : 'success');
        renderApp();
    }
    
    // --- Related Words Functions ---
    
    async function populateRelationshipDropdowns() {
        const allWords = await db.words.orderBy('taika_word').toArray();
        const dropdowns = [etymologyInput, synonymsInput, antonymsInput, relatedWordsInput];
        
        dropdowns.forEach(dropdown => {
            if (!dropdown) return;
            
            // Clear existing options except the first one
            while (dropdown.children.length > 1) {
                dropdown.removeChild(dropdown.lastChild);
            }
            
            // Add words as options
            allWords.forEach(word => {
                if (currentEditId && word.id === currentEditId) return; // Don't include the current word
                
                const option = document.createElement('option');
                option.value = word.id;
                option.textContent = `${word.taika_word} - ${word.definition.substring(0, 50)}${word.definition.length > 50 ? '...' : ''}`;
                dropdown.appendChild(option);
            });
        });
    }
    
    async function saveWordRelationships(wordId) {
        if (!wordId) return;
        
        const relationships = [
            { source: wordId, targets: selectedEtymology.map(item => item.id), type: 'derived_from' },
            { source: wordId, targets: selectedSynonyms.map(item => item.id), type: 'synonym' },
            { source: wordId, targets: selectedAntonyms.map(item => item.id), type: 'antonym' },
            { source: wordId, targets: selectedRelated.map(item => item.id), type: 'related' }
        ];
        
        // Delete existing relationships for this word
        await db.word_relationships.where('source_word_id').equals(wordId).delete();
        
        // Add new relationships
        for (const rel of relationships) {
            for (const targetId of rel.targets) {
                await db.word_relationships.add({
                    source_word_id: rel.source,
                    target_word_id: parseInt(targetId),
                    relationship_type: rel.type,
                    date_created: new Date().toISOString()
                });
            }
        }
    }
    
    async function saveMorphologyData(wordId) {
        if (!wordId) return;
        
        const morphologyData = {
            word_id: wordId,
            root_words: rootWordsInput.value.trim(),
            prefixes: prefixesInput.value.trim(),
            suffixes: suffixesInput.value.trim(),
            morpheme_breakdown: morphemeBreakdownInput.value.trim(),
            date_created: new Date().toISOString()
        };
        
        // Delete existing morphology data for this word
        await db.morphology.where('word_id').equals(wordId).delete();
        
        // Add new morphology data if any fields have content
        if (Object.values(morphologyData).some(value => typeof value === 'string' && value.trim())) {
            await db.morphology.add(morphologyData);
        }
    }
    
    function getSelectedOptions(selectElement) {
        if (!selectElement) return [];
        return Array.from(selectElement.selectedOptions).map(option => option.value).filter(value => value);
    }
    
    async function loadWordRelationships(wordId) {
        if (!wordId) return;
        
        const relationships = await db.word_relationships.where('source_word_id').equals(wordId).toArray();
        
        // Clear current selections
        selectedEtymology.length = 0;
        selectedSynonyms.length = 0;
        selectedAntonyms.length = 0;
        selectedRelated.length = 0;
        
        // Load related words data
        for (const rel of relationships) {
            const relatedWord = await db.words.get(rel.target_word_id);
            if (relatedWord) {
                const wordData = {
                    id: relatedWord.id,
                    word: relatedWord.taika_word,
                    definition: relatedWord.definition
                };
                
                switch (rel.relationship_type) {
                    case 'derived_from':
                        selectedEtymology.push(wordData);
                        break;
                    case 'synonym':
                        selectedSynonyms.push(wordData);
                        break;
                    case 'antonym':
                        selectedAntonyms.push(wordData);
                        break;
                    case 'related':
                        selectedRelated.push(wordData);
                        break;
                }
            }
        }
        
        // Render selected words
        renderSelectedWords(etymologySelected, selectedEtymology);
        renderSelectedWords(synonymsSelected, selectedSynonyms);
        renderSelectedWords(antonymsSelected, selectedAntonyms);
        renderSelectedWords(relatedWordsSelected, selectedRelated);
    }
    
    async function loadMorphologyData(wordId) {
        if (!wordId) return;
        
        const morphology = await db.morphology.where('word_id').equals(wordId).first();
        if (morphology) {
            rootWordsInput.value = morphology.root_words || '';
            prefixesInput.value = morphology.prefixes || '';
            suffixesInput.value = morphology.suffixes || '';
            morphemeBreakdownInput.value = morphology.morpheme_breakdown || '';
        }
    }
    
    // --- Missing Export Functions ---
    
    function exportToCSV(words, filename) {
        const headers = ['taika_word', 'pronunciation_ipa', 'part_of_speech', 'word_class', 'definition', 'example_sentence', 'notes', 'tags'];
        const csvContent = [headers.join(',')];
        
        words.forEach(word => {
            const row = headers.map(header => {
                let value = word[header] || '';
                if (header === 'tags' && Array.isArray(value)) {
                    value = value.join(';');
                }
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvContent.push(row.join(','));
        });
        
        downloadFile(csvContent.join('\n'), `${filename}.csv`, 'text/csv');
    }
    
    function exportToJSON(words, filename) {
        const jsonContent = JSON.stringify(words, null, 2);
        downloadFile(jsonContent, `${filename}.json`, 'application/json');
    }
    
    function exportToExcel(words, filename) {
        const worksheet = XLSX.utils.json_to_sheet(words);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Taika Dictionary');
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    }
    
    function exportToPDF(words, filename) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Taika Dictionary', 20, 20);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
        
        let yPosition = 45;
        const pageHeight = doc.internal.pageSize.height;
        
        words.forEach((word, index) => {
            if (yPosition > pageHeight - 30) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(12);
            doc.text(`${word.taika_word} (${word.part_of_speech})`, 20, yPosition);
            yPosition += 6;
            
            doc.setFontSize(10);
            doc.text(word.definition, 20, yPosition);
            yPosition += 6;
            
            if (word.example_sentence) {
                doc.text(`Example: ${word.example_sentence}`, 20, yPosition);
                yPosition += 6;
            }
            
            yPosition += 4; // Space between entries
        });
        
        doc.save(`${filename}.pdf`);
    }
    


    // --- Missing Utility Functions ---
    
    async function checkForDuplicates() {
        const query = wordInput.value.trim().toLowerCase();
        if (!query) {
            duplicateWarning.style.display = 'none';
            return;
        }
        
        try {
            const existingWord = await db.words
                .where('taika_word')
                .startsWithIgnoreCase(query)
                .first();
                
            if (existingWord && existingWord.id !== currentEditId) {
                duplicateWarning.style.display = 'block';
            } else {
                duplicateWarning.style.display = 'none';
            }
        } catch (error) {
            console.error('Error checking duplicates:', error);
            duplicateWarning.style.display = 'none';
        }
    }
    
    // --- Word Search Functions ---
    
    function setupWordSearchListeners() {
        const searchInputs = [
            { input: etymologyInput, dropdown: etymologyDropdown, selected: selectedEtymology, container: etymologySelected },
            { input: synonymsInput, dropdown: synonymsDropdown, selected: selectedSynonyms, container: synonymsSelected },
            { input: antonymsInput, dropdown: antonymsDropdown, selected: selectedAntonyms, container: antonymsSelected },
            { input: relatedWordsInput, dropdown: relatedWordsDropdown, selected: selectedRelated, container: relatedWordsSelected }
        ];
        
        searchInputs.forEach(({ input, dropdown, selected, container }) => {
            input.addEventListener('input', (e) => {
                handleWordSearch(e.target.value, dropdown, selected, container);
            });
            
            input.addEventListener('focus', () => {
                if (input.value.trim()) {
                    handleWordSearch(input.value, dropdown, selected, container);
                }
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => dropdown.classList.remove('show'), 200);
            });
        });
    }
    
    async function handleWordSearch(query, dropdown, selectedArray, container) {
        if (query.trim().length < 1) {
            dropdown.classList.remove('show');
            return;
        }
        
        const allWords = await db.words.orderBy('taika_word').toArray();
        const filteredWords = allWords.filter(word => 
            word.taika_word.toLowerCase().includes(query.toLowerCase()) &&
            !selectedArray.find(selected => selected.id === word.id) &&
            word.id !== currentEditId
        ).slice(0, 10);
        
        if (filteredWords.length > 0) {
            dropdown.innerHTML = filteredWords.map(word => 
                `<div class="word-search-item" onclick="selectSearchWord(${word.id}, '${word.taika_word}', '${word.definition.replace(/'/g, "")}')"
                      data-word-id="${word.id}">
                    <div class="word-search-word">${word.taika_word}</div>
                    <div class="word-search-definition">${word.definition.substring(0, 60)}${word.definition.length > 60 ? '...' : ''}</div>
                </div>`
            ).join('');
            dropdown.classList.add('show');
        } else {
            dropdown.classList.remove('show');
        }
    }
    
    function selectSearchWord(wordId, word, definition) {
        // Determine which array to add to based on the active input
        const activeElement = document.activeElement;
        let targetArray, targetContainer;
        
        if (activeElement === etymologyInput) {
            targetArray = selectedEtymology;
            targetContainer = etymologySelected;
        } else if (activeElement === synonymsInput) {
            targetArray = selectedSynonyms;
            targetContainer = synonymsSelected;
        } else if (activeElement === antonymsInput) {
            targetArray = selectedAntonyms;
            targetContainer = antonymsSelected;
        } else if (activeElement === relatedWordsInput) {
            targetArray = selectedRelated;
            targetContainer = relatedWordsSelected;
        }
        
        if (targetArray && !targetArray.find(item => item.id === wordId)) {
            targetArray.push({ id: wordId, word, definition });
            renderSelectedWords(targetContainer, targetArray);
            activeElement.value = '';
            document.querySelector('.word-search-dropdown.show').classList.remove('show');
        }
    }
    
    function renderSelectedWords(container, selectedArray) {
        container.innerHTML = selectedArray.map(item => 
            `<span class="selected-word-tag">
                ${item.word}
                <span class="selected-word-remove" onclick="removeSelectedWord(${item.id}, '${container.id}')">&times;</span>
            </span>`
        ).join('');
    }
    
    function removeSelectedWord(wordId, containerId) {
        let targetArray;
        
        switch (containerId) {
            case 'etymologySelected': targetArray = selectedEtymology; break;
            case 'synonymsSelected': targetArray = selectedSynonyms; break;
            case 'antonymsSelected': targetArray = selectedAntonyms; break;
            case 'relatedWordsSelected': targetArray = selectedRelated; break;
        }
        
        if (targetArray) {
            const index = targetArray.findIndex(item => item.id === wordId);
            if (index > -1) {
                targetArray.splice(index, 1);
                const container = document.getElementById(containerId);
                renderSelectedWords(container, targetArray);
            }
        }
    }
    


    
    // --- Audio Recording Fix ---
    
    async function handleAudioUpload(event) {
        const file = event.target.files[0];
        if (file) {
            currentAudioBlob = file;
            const url = URL.createObjectURL(file);
            audioPreview.src = url;
            playAudioBtn.disabled = false;
            showToast('Audio file uploaded successfully!', 'success');
        }
    }
    
    async function toggleRecording() {
        if (!mediaRecorder || mediaRecorder.state === 'inactive') {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                recordedChunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    currentAudioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(currentAudioBlob);
                    audioPreview.src = url;
                    playAudioBtn.disabled = false;
                    recordAudioBtn.innerHTML = '<i class="fas fa-microphone"></i> Record';
                    recordAudioBtn.classList.remove('btn-danger');
                    recordAudioBtn.classList.add('btn-secondary');
                    showToast('Audio recorded successfully!', 'success');
                    
                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                recordAudioBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
                recordAudioBtn.classList.remove('btn-secondary');
                recordAudioBtn.classList.add('btn-danger');
            } catch (error) {
                console.error('Error accessing microphone:', error);
                showToast('Could not access microphone. Please check permissions.', 'error');
            }
        } else {
            mediaRecorder.stop();
        }
    }
    
    function playAudio() {
        if (audioPreview.src) {
            audioPreview.play().catch(error => {
                console.error('Error playing audio:', error);
                showToast('Error playing audio.', 'error');
            });
        }
    }

    
    // Helper function to convert a Blob to a Base64 string
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });
};


// --- [CORRECTED] Capacitor File Picker Functions for Import ---

async function openCsvFilePicker() {
    try {
        // Get the plugin from the Capacitor global object
        const { FilePicker } = Capacitor.Plugins;

        // Open the native file picker
        const result = await FilePicker.pickFiles({
            types: ['text/csv'], // Use the correct MIME type for CSV
            readData: true       // Ask the plugin to read the file content
        });

        const file = result.files[0];
        if (file) {
            // The data is Base64 encoded. 'atob' decodes it to a string.
            const fileContent = atob(file.data);
            const data = parseCSV(fileContent);
            await importWords(data, 'csv');
        }
    } catch (e) {
        console.error('Error picking CSV file', e);
        showToast(`File picker cancelled or failed`, 'warning');
    }
}

async function openExcelFilePicker() {
    try {
        const { FilePicker } = Capacitor.Plugins;
        const result = await FilePicker.pickFiles({
            types: [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel' // .xls
            ],
            readData: true
        });

        const file = result.files[0];
        if (file) {
            // SheetJS can read the Base64 data directly
            const workbook = XLSX.read(file.data, { type: 'base64' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            await importWords(data, 'excel');
        }
    } catch (e) {
        console.error('Error picking Excel file', e);
        showToast(`File picker cancelled or failed`, 'warning');
    }
}

async function openJsonFilePicker() {
    try {
        const { FilePicker } = Capacitor.Plugins;
        const result = await FilePicker.pickFiles({
            types: ['application/json'],
            readData: true
        });

        const file = result.files[0];
        if (file) {
            const fileContent = atob(file.data); // Decode from Base64
            // Check if the parsed JSON has a "words" property, otherwise use the whole object
            const parsedJson = JSON.parse(fileContent);
            const data = parsedJson.words ? parsedJson.words : parsedJson;
            await importWords(data, 'json');
        }
    } catch (e) {
        console.error('Error picking JSON file', e);
        showToast(`File picker cancelled or failed`, 'warning');
    }
}
    
    // Make functions globally available for onclick handlers
    window.openEditModal = openEditModal;
    window.deleteWord = deleteWord;
    window.playWordAudio = playWordAudio;
    window.removeTag = removeTag;
    window.selectSearchWord = selectSearchWord;
    window.removeSelectedWord = removeSelectedWord;