class Claim {
  constructor({ id, itemName, type, status = 'pending', amount, date, imageUrl = null, quantity = 1 }) {
    this.id       = id;
    this.itemName = itemName;
    this.type     = type;
    this.status   = status;
    this.amount   = amount;
    this.date     = date;
    this.imageUrl = imageUrl;
    this.quantity = quantity;
  }

  updateStatus(newStatus) {
    const VALID = ['pending', 'approved', 'rejected'];
    if (!VALID.includes(newStatus)) {
      console.warn(
        `[Claim ${this.id}] Invalid status "${newStatus}". ` +
        `Must be one of: ${VALID.join(', ')}.`
      );
      return;
    }
    this.status = newStatus;
  }

  attachImage(url) {
    this.imageUrl = url;
  }
}
