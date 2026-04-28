class DashboardUI {
  constructor(manager) {
    this.manager       = manager;
    this.activeClaimId = null;

    this.els = {
      totalCount:    document.getElementById('total-count'),
      pendingCount:  document.getElementById('pending-count'),
      approvedCount: document.getElementById('approved-count'),
      rejectedCount: document.getElementById('rejected-count'),
      amountTotal:   document.getElementById('amount-total'),

      claimsContainer: document.getElementById('claims-container'),
      resultsCount:    document.getElementById('results-count'),

      searchInput:  document.getElementById('search-input'),
      filterType:   document.getElementById('filter-type'),
      filterStatus: document.getElementById('filter-status'),

      addClaimBtn:  document.getElementById('add-claim-btn'),
      insightsBtn:  document.getElementById('insights-btn'),

      insightPanel:    document.getElementById('insight-panel'),
      insightText:     document.getElementById('insight-text'),
      closeInsightBtn: document.getElementById('close-insight-btn'),

      claimModal:         document.getElementById('claim-modal'),
      claimModalBox:      document.getElementById('claim-modal-box'),
      closeModalBtn:      document.getElementById('close-modal-btn'),
      modalItemName:      document.getElementById('modal-item-name'),
      modalClaimId:       document.getElementById('modal-claim-id'),
      modalType:          document.getElementById('modal-type'),
      modalStatus:        document.getElementById('modal-status'),
      modalAmount:        document.getElementById('modal-amount'),
      modalDate:          document.getElementById('modal-date'),
      modalImageSection:  document.getElementById('modal-image-section'),
      modalImage:         document.getElementById('modal-image'),
      modalStatusButtons: document.getElementById('modal-status-buttons'),

      addModal:        document.getElementById('add-modal'),
      addModalBox:     document.getElementById('add-modal-box'),
      closeAddModal:   document.getElementById('close-add-modal-btn'),
      addClaimForm:    document.getElementById('add-claim-form'),
      formItemName:    document.getElementById('form-item-name'),
      formType:        document.getElementById('form-type'),
      formStatus:      document.getElementById('form-status'),
      formAmount:      document.getElementById('form-amount'),
      formDate:        document.getElementById('form-date'),
      formImageFile:   document.getElementById('form-image-file'),
      formImagePreview:document.getElementById('form-image-preview'),
      formPreviewImg:  document.getElementById('form-preview-img'),
      removeImageBtn:  document.getElementById('remove-image-btn'),
      cancelAddBtn:    document.getElementById('cancel-add-btn'),

      toast:        document.getElementById('toast'),
      toastMessage: document.getElementById('toast-message'),
    };
  }


  renderClaims(claims) {
    const container = this.els.claimsContainer;
    container.innerHTML = '';

    const count = claims.length;
    this.els.resultsCount.textContent =
      `Showing ${count} claim${count !== 1 ? 's' : ''}`;

    if (count === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📭</span>
          <div class="empty-title">No claims found</div>
          <p class="empty-body">Try adjusting your search or filters.</p>
        </div>`;
      return;
    }

    claims.forEach(claim => {
      container.appendChild(this._buildClaimCard(claim));
    });

    gsap.fromTo(
      '.claim-card',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.045, ease: 'power2.out' }
    );
  }

  renderSummary(summary) {
    this.els.totalCount.textContent    = summary.total;
    this.els.pendingCount.textContent  = summary.pending;
    this.els.approvedCount.textContent = summary.approved;
    this.els.rejectedCount.textContent = summary.rejected;
    this.els.amountTotal.textContent   = this._formatCurrency(summary.totalAmount, 0);
  }

  bindEvents() {
    this.els.searchInput.addEventListener('input',  () => this._applyFilters());
    this.els.filterType.addEventListener('change',  () => this._applyFilters());
    this.els.filterStatus.addEventListener('change', () => {
      document.querySelectorAll('.summary-card').forEach(c => c.classList.remove('card--active'));
      this._applyFilters();
    });

    const cardFilters = [
      { id: 'card-total',    status: 'all' },
      { id: 'card-pending',  status: 'pending' },
      { id: 'card-approved', status: 'approved' },
      { id: 'card-rejected', status: 'rejected' },
    ];
    cardFilters.forEach(({ id, status }) => {
      document.getElementById(id).addEventListener('click', () => {
        this.els.filterStatus.value = status;
        cardFilters.forEach(c => document.getElementById(c.id).classList.remove('card--active'));
        document.getElementById(id).classList.add('card--active');
        this._applyFilters();
      });
    });

    this.els.addClaimBtn.addEventListener('click', () => this._openAddModal());
    this.els.insightsBtn.addEventListener('click', () => this._handleInsights());

    this.els.closeModalBtn.addEventListener('click', () => this._closeClaimModal());
    this.els.claimModal.addEventListener('click', e => {
      if (e.target === this.els.claimModal) this._closeClaimModal();
    });
    this.els.modalStatusButtons.addEventListener('click', e => {
      const btn = e.target.closest('.status-btn');
      if (btn) this._handleStatusUpdate(btn.dataset.status);
    });
    this.els.closeAddModal.addEventListener('click',  () => this._closeAddModal());
    this.els.cancelAddBtn.addEventListener('click',   () => this._closeAddModal());
    this.els.addModal.addEventListener('click', e => {
      if (e.target === this.els.addModal) this._closeAddModal();
    });
    this.els.addClaimForm.addEventListener('submit', e => {
      e.preventDefault();
      this._handleAddClaim();
    });

    this.els.formImageFile.addEventListener('change', e => {
      this._handleImagePreview(e.target.files[0]);
    });
    this.els.removeImageBtn.addEventListener('click', () => {
      this.els.formImageFile.value = '';
      this.els.formPreviewImg.src  = '';
    });

    this.els.closeInsightBtn.addEventListener('click', () => {
      gsap.to(this.els.insightPanel, {
        opacity: 0,
        y: -8,
        duration: 0.22,
        onComplete: () => this.els.insightPanel.classList.add('hidden'),
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (!this.els.claimModal.classList.contains('hidden')) this._closeClaimModal();
      if (!this.els.addModal.classList.contains('hidden'))   this._closeAddModal();
    });
  }

  showClaimDetails(claim) {
    this.activeClaimId = claim.id;

    this.els.modalItemName.textContent = claim.itemName;
    this.els.modalClaimId.textContent  = claim.id;
    this.els.modalAmount.textContent   = this._formatCurrency(claim.amount);
    this.els.modalDate.textContent     = this._formatDate(claim.date, { full: true });

    this.els.modalType.innerHTML   = `<span class="badge badge--${claim.type}">${claim.type}</span>`;
    this.els.modalStatus.innerHTML = `<span class="badge badge--${claim.status}">${claim.status}</span>`;

    this.els.modalStatusButtons
      .querySelectorAll('.status-btn')
      .forEach(btn => btn.classList.toggle('active', btn.dataset.status === claim.status));

    if (claim.imageUrl) {
      this.els.modalImage.src = claim.imageUrl;
      this.els.modalImageSection.classList.remove('hidden');
    } else {
      this.els.modalImageSection.classList.add('hidden');
    }

    this.els.claimModal.classList.remove('hidden');
    gsap.fromTo(
      this.els.claimModalBox,
      { opacity: 0, scale: 0.91, y: 18 },
      { opacity: 1, scale: 1,    y: 0,  duration: 0.3, ease: 'power3.out' }
    );
  }

  showInsight(text) {
    this.els.insightText.textContent = text;
    gsap.fromTo(
      this.els.insightText,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
  }


  _buildClaimCard(claim) {
    const card = document.createElement('div');
    card.className  = 'claim-card';
    card.dataset.id = claim.id;

    card.innerHTML = `
      ${claim.imageUrl ? `<div class="card-image-indicator">📷 Image</div>` : ''}
      <div class="claim-card-header">
        <span class="claim-id">${claim.id}</span>
      </div>
      <div class="claim-item-name">${this._escapeHtml(claim.itemName)}</div>
      <div class="claim-meta">
        <span class="claim-amount">${this._formatCurrency(claim.amount)}</span>
        <span class="claim-date">${this._formatDate(claim.date)}</span>
      </div>
      <div class="claim-badges">
        <span class="badge badge--${claim.type}">${claim.type}</span>
        <span class="badge badge--${claim.status}">${claim.status}</span>
      </div>
    `;

    card.addEventListener('click', () => this.showClaimDetails(claim));
    return card;
  }

  _applyFilters() {
    const query  = this.els.searchInput.value;
    const type   = this.els.filterType.value;
    const status = this.els.filterStatus.value;

    let results = this.manager.searchClaims(query);
    results = results.filter(c => {
      const typeMatch   = type   === 'all' || c.type   === type;
      const statusMatch = status === 'all' || c.status === status;
      return typeMatch && statusMatch;
    });

    this.renderClaims(results);
  }

  _handleStatusUpdate(newStatus) {
    if (!this.activeClaimId) return;

    this.manager.updateClaimStatus(this.activeClaimId, newStatus);

    this.els.modalStatus.innerHTML =
      `<span class="badge badge--${newStatus}">${newStatus}</span>`;

    this.els.modalStatusButtons
      .querySelectorAll('.status-btn')
      .forEach(btn => btn.classList.toggle('active', btn.dataset.status === newStatus));

    const card = document.querySelector(`.claim-card[data-id="${this.activeClaimId}"]`);
    if (card) {
      gsap.fromTo(
        card,
        { boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.55)' },
        { boxShadow: '0 0 0 0px rgba(16, 185, 129, 0)', duration: 1.4, ease: 'power2.out' }
      );
    }

    this.renderSummary(this.manager.getSummary());
    this._applyFilters();

    this._showToast(`Status updated to "${newStatus}"`);
    this._closeClaimModal();
  }

  _openAddModal() {
    this.els.addClaimForm.reset();
    this.els.formImagePreview.classList.add('hidden');
    this.els.formPreviewImg.src = '';

    this.els.formDate.value = new Date().toISOString().split('T')[0];

    this.els.addModal.classList.remove('hidden');
    gsap.fromTo(
      this.els.addModalBox,
      { opacity: 0, scale: 0.91, y: 18 },
      { opacity: 1, scale: 1,    y: 0,  duration: 0.3, ease: 'power3.out' }
    );
  }

  _closeClaimModal() {
    gsap.to(this.els.claimModalBox, {
      opacity: 0,
      scale:   0.94,
      y:       10,
      duration: 0.2,
      ease:    'power2.in',
      onComplete: () => {
        this.els.claimModal.classList.add('hidden');
        this.activeClaimId = null;
      },
    });
  }

  _closeAddModal() {
    gsap.to(this.els.addModalBox, {
      opacity: 0,
      scale:   0.94,
      y:       10,
      duration: 0.2,
      ease:    'power2.in',
      onComplete: () => this.els.addModal.classList.add('hidden'),
    });
  }

  _handleAddClaim() {
    const itemName = this.els.formItemName.value.trim();
    const type     = this.els.formType.value;
    const status   = this.els.formStatus.value;
    const amount   = parseFloat(this.els.formAmount.value);
    const date     = this.els.formDate.value || new Date().toISOString().split('T')[0];

    if (!itemName || !type || isNaN(amount) || amount < 0) return;

    const hasImage  = !this.els.formImagePreview.classList.contains('hidden');
    const imageUrl  = hasImage ? this.els.formPreviewImg.src : null;

    const newClaim = this.manager.createClaim({ itemName, type, status, amount, date, imageUrl });

    this._closeAddModal();
    this.renderSummary(this.manager.getSummary());
    this._applyFilters();
    this._showToast(`Claim ${newClaim.id} added`);
  }

  _handleImagePreview(file) {
    if (!file) return;

    const reader    = new FileReader();
    reader.onload   = e => {
      this.els.formPreviewImg.src = e.target.result;
      this.els.formImagePreview.classList.remove('hidden');
      gsap.fromTo(
        this.els.formImagePreview,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.28 }
      );
    };
    reader.readAsDataURL(file);
  }

  async _handleInsights() {
    const btn          = this.els.insightsBtn;
    const originalHTML = btn.innerHTML;

    btn.disabled  = true;
    btn.innerHTML = '⏳ Generating…';

    this.els.insightPanel.classList.remove('hidden');
    this.els.insightText.innerHTML = `
      <span class="loading-dots">
        <span></span><span></span><span></span>
      </span>&nbsp; Analyzing claims data…`;

    gsap.fromTo(
      this.els.insightPanel,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }
    );

    const summary = this.manager.getSummary();

    try {
      const text = await generateInsight(summary);
      this.showInsight(text);
    } catch (err) {
      this.showInsight(
        'Could not reach the AI service. Check your API key in src/api/openai.js and try again.'
      );
    } finally {
      btn.disabled  = false;
      btn.innerHTML = originalHTML;
    }
  }

  _showToast(message) {
    this.els.toastMessage.textContent = message;
    this.els.toast.classList.remove('hidden');

    gsap.fromTo(
      this.els.toast,
      { opacity: 0, y: 60 },
      {
        opacity:  1,
        y:        0,
        duration: 0.32,
        ease:     'power3.out',
        onComplete: () => {
          gsap.to(this.els.toast, {
            opacity:  0,
            y:        20,
            delay:    2.3,
            duration: 0.3,
            onComplete: () => this.els.toast.classList.add('hidden'),
          });
        },
      }
    );
  }


  _formatCurrency(amount, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
      style:                 'currency',
      currency:              'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }

  _formatDate(isoDate, opts = {}) {
    const d = new Date(isoDate + 'T00:00:00');
    if (opts.full) {
      return d.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      });
    }
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  _escapeHtml(str) {
    const div      = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
