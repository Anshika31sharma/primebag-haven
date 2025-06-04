document.addEventListener('DOMContentLoaded', function() {
  function updateCartUI(productId, newQty, price, discount) {
    // Update quantity
    document.querySelectorAll('.cart-qty[data-product-id="' + productId + '"]').forEach(qtyDiv => {
      qtyDiv.textContent = newQty < 10 ? '0' + newQty : newQty;
    });
    // Update MRP
    document.querySelectorAll('.cart-mrp[data-product-id="' + productId + '"]').forEach(mrpDiv => {
      mrpDiv.textContent = '₹ ' + (price * newQty);
    });
    // Update Discount
    document.querySelectorAll('.cart-discount[data-product-id="' + productId + '"]').forEach(dDiv => {
      dDiv.textContent = '₹ ' + ((discount || 0) * newQty);
    });
    // Update Platform Fee
    document.querySelectorAll('.cart-fee[data-product-id="' + productId + '"]').forEach(feeDiv => {
      feeDiv.textContent = '₹ ' + (20 * newQty);
    });
    // Update Net Total
    document.querySelectorAll('.cart-nettotal[data-product-id="' + productId + '"]').forEach(netDiv => {
      netDiv.textContent = '₹ ' + ((price - (discount || 0) + 20) * newQty);
    });
    // Update Total Amount
    document.querySelectorAll('.cart-total[data-product-id="' + productId + '"]').forEach(totalDiv => {
      totalDiv.textContent = '₹  ' + ((price - (discount || 0) + 20) * newQty);
    });
  }

  function updateCartSummary() {
    let totalMRP = 0, totalDiscount = 0, totalFee = 0, totalAmount = 0;
    document.querySelectorAll('.cart-qty').forEach(qtyDiv => {
      const productId = qtyDiv.dataset.productId;
      const qty = parseInt(qtyDiv.textContent.trim()) || 0;
      const price = parseInt(document.querySelector('.cart-increment[data-product-id="' + productId + '"]').dataset.price);
      const discount = parseInt(document.querySelector('.cart-increment[data-product-id="' + productId + '"]').dataset.discount);
      totalMRP += price * qty;
      totalDiscount += (discount || 0) * qty;
      totalFee += 20 * qty;
      totalAmount += (price - (discount || 0) + 20) * qty;
    });
    document.querySelector('.cart-summary-mrp').textContent = '₹ ' + totalMRP;
    document.querySelector('.cart-summary-discount').textContent = '₹ ' + totalDiscount;
    document.querySelector('.cart-summary-fee').textContent = '₹ ' + totalFee;
    document.querySelector('.cart-summary-total').textContent = '₹ ' + totalAmount;
  }

  // Increment
  document.querySelectorAll('.cart-increment').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      const price = parseInt(this.dataset.price);
      const discount = parseInt(this.dataset.discount);
      let qtyDiv = document.querySelector('.cart-qty[data-product-id="' + productId + '"]');
      let qty = parseInt(qtyDiv.textContent.trim()) || 1;
      qty++;
      updateCartUI(productId, qty, price, discount);
      updateCartSummary();
      fetch(this.dataset.url, { method: 'POST' });
    });
  });
  // Decrement
  document.querySelectorAll('.cart-decrement').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const productId = this.dataset.productId;
      const price = parseInt(this.dataset.price);
      const discount = parseInt(this.dataset.discount);
      let qtyDiv = document.querySelector('.cart-qty[data-product-id="' + productId + '"]');
      let qty = parseInt(qtyDiv.textContent.trim()) || 1;
      if (qty > 1) {
        qty--;
        updateCartUI(productId, qty, price, discount);
        updateCartSummary();
        fetch(this.dataset.url, { method: 'POST' });
      } else if (qty === 1) {
        // Remove product card from DOM (more robust selector)
        let card = qtyDiv.closest('.cart-product-card') || qtyDiv.closest('[class*="md:w-1/4"], [class*="md:w-1/3"], [class*="md:w-1/2"], [class*="w-full"]');
        if (card) {
          card.remove();
        }
        fetch(this.dataset.url, { method: 'POST' }).then(() => {
          // If no more cart-qty elements, reload the page to ensure a clean empty state
          if (document.querySelectorAll('.cart-qty').length === 0) {
            window.location.reload();
            return;
          }
          updateCartSummary();
        });
      }
    });
  });
});
