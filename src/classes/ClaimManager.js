class ClaimManager {
  constructor() {
    this.claims = [];
    this._nextId = 1;
  }


  _generateId() {
    const padded = String(this._nextId).padStart(3, '0');
    this._nextId++;
    return `CLM-${padded}`;
  }


  addClaim(claim) {
    this.claims.push(claim);
  }

  createClaim(data) {
    const id    = this._generateId();
    const claim = new Claim({ ...data, id });
    this.addClaim(claim);
    return claim;
  }

  getClaimById(id) {
    return this.claims.find(c => c.id === id) ?? null;
  }

  filterClaims(type = 'all', status = 'all') {
    return this.claims.filter(claim => {
      const typeMatch   = type   === 'all' || claim.type   === type;
      const statusMatch = status === 'all' || claim.status === status;
      return typeMatch && statusMatch;
    });
  }

  searchClaims(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [...this.claims];

    return this.claims.filter(claim =>
      claim.itemName.toLowerCase().includes(q) ||
      claim.type.toLowerCase().includes(q)     ||
      claim.status.toLowerCase().includes(q)   ||
      claim.id.toLowerCase().includes(q)
    );
  }

  updateClaimStatus(id, status) {
    const claim = this.getClaimById(id);
    if (claim) {
      claim.updateStatus(status);
    } else {
      console.warn(`[ClaimManager] No claim found with id "${id}"`);
    }
  }

  getSummary() {
    const total       = this.claims.length;
    const pending     = this.claims.filter(c => c.status === 'pending').length;
    const approved    = this.claims.filter(c => c.status === 'approved').length;
    const rejected    = this.claims.filter(c => c.status === 'rejected').length;
    const damaged     = this.claims.filter(c => c.type   === 'damaged').length;
    const missing     = this.claims.filter(c => c.type   === 'missing').length;
    const totalAmount = this.claims.reduce((sum, c) => sum + c.amount, 0);

    return { total, pending, approved, rejected, damaged, missing, totalAmount };
  }
}
