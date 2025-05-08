import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import DayJs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../../data/deliveryOptions.Js";
import { renderPaymentSummary } from "./pymentSumary.js";


export function renderOrderSummary() {


    let cartSummaryHTML = "";
    const today = DayJs();
    cart.forEach((item) => {
        const productName = item.name
        const deliveryName = item.deliveryName;
        console.log('Delivery name:', deliveryName);
        let matchingProduct;
        products.forEach((product) => {
            if (product.name === productName) {
                matchingProduct = product;
            }
        })

        let deliveryOption;
        deliveryOptions.forEach((option) => {
            if (option.deliveryName === deliveryName) {
                deliveryOption = option;
            }
        })
        console.log('Item:', item); // Debug: Log the current cart item
        console.log('Delivery options:', deliveryOptions);
        const dateString = today.add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

        cartSummaryHTML += `
<div class="cart-item-container js-cart-item-container-${matchingProduct.name[0,1]}">
        <div class="delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                ${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label">${item.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-name="${matchingProduct.name}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, item)}
            </div>
        </div>
        </div>
`
    });

    function deliveryOptionsHTML(matchingProduct, item) {
        let html = ''; // Initialize html as an empty string
        deliveryOptions.forEach((deliveryOption) => {
            const dateString = today.add(deliveryOption.deliveryDays, 'days').format('dddd, MMMM D');

            const priceString = deliveryOption.price === 0 ?
                "FREE Shipping" :
                `${formatCurrency(deliveryOption.price)} - Shipping`; // Changed price to priceCents

            const isChecked = deliveryOption.deliveryName === item.deliveryName;

            html += `
        <div class="delivery-option js-delivery-option" data-delivery-name="${deliveryOption.deliveryName}"
        data-item-name="${matchingProduct.name}">
                <input type="radio" ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.name}">
                <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString}
                </div>
                </div>
            </div>
        `
        })
        return html;
    }

    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

    document.querySelectorAll(".js-delete-link").forEach((deleteLink) => {
        deleteLink.addEventListener("click", () => {
            const productName = deleteLink.dataset.productName;
            removeFromCart(productName);
            console.log(cart);

            const container = document.querySelector(`.js-cart-item-container-${productName[0,1]}`);
            container.remove();
            renderPaymentSummary();
        });
    });
    document.querySelectorAll(".js-delivery-option").forEach((element) => {
        element.addEventListener('click', () => {
            const { deliveryName, itemName } = element.dataset;
            updateDeliveryOption(itemName, deliveryName);
            renderOrderSummary();
            renderPaymentSummary();
        })
    })
}