import { cart } from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js";
import { products } from "../../data/products.js";
export function renderPaymentSummary() {
    let ProductPriceCents = 0;
    let ShippingPriceCents = 0;
    let totalItemsQuantity = 0;
    cart.forEach((item) => {
        products.forEach((product) => {
            if (product.name === item.name) {
                ProductPriceCents += (product.priceCents * item.quantity);
                totalItemsQuantity += item.quantity;
            }
            if (item.deliveryName === 'Same Day') {
                ShippingPriceCents += 1000;
            } else if (item.deliveryName === 'Priority') {
                ShippingPriceCents += 499;
            }
        });
    });
    const totalBeforeTax = ProductPriceCents + ShippingPriceCents;
    const totalAfterTax = totalBeforeTax * 1.1;

    const paymentSummaryHTML = `
        <div class="payment-summary-title">
        Order Summary
    </div>

    <div class="payment-summary-row">
        <div>Items (${totalItemsQuantity}):</div>
        <div class="payment-summary-money">${formatCurrency(ProductPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">${formatCurrency(ShippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">${formatCurrency(totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">${formatCurrency(totalAfterTax - totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">${formatCurrency(totalAfterTax)}</div>
    </div>

    <button class="place-order-button button-primary">
    Place your order
    </button>
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;


}