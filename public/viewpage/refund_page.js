import * as Util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Auth from '../controller/auth.js'
import * as Constant from '../model/constant.js'
import * as Element from './element.js'
import { Refund } from '../model/refund.js'


export function addRefundButtonListener() {
    const refundButtonForms = document.getElementsByClassName('request-refund-form');
    for (let i = 0; i < refundButtonForms.length; ++i) {
        addRefundButtonSubmitEvent(refundButtonForms[i])
    }
}

export function addRefundButtonSubmitEvent(form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disableButton(button);
        const shoppingCart = e.target.shoppingCart.value;
        await refund_page(shoppingCart);
        Util.enableButton(button, label);
    })
}

export async function refund_page(shoppingCart) {

    let carts
    let cart
    try {
        carts = await FirebaseController.getPurchaseHistory(Auth.currentUser.uid);
        cart = carts[shoppingCart];
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Error', JSON.stringify(e));
    }
    let html = '<h1>Pending refunds</h1>'

    html += `
    <table class="table table-striped">
    <thead>
    <tr>
      <th scope="col">Item</th>
      <th scope="col">Price</th>
      <th scope="col">Quantity</th>
    </tr>
    </thead>
    <tbody>
    `;

    for (let i = 0; i < cart.items.length; i++) {
        html += `
        <tr>
            ${buildRefundView(cart.items[i])}
        </tr>
        `
    }

    html += '</tbody></table>'

    html += '<br><h2>Approved refunds</h2>'


    Element.root.innerHTML = html;

}

function buildRefundView(item) {
    return `
    <td>${item.name}</td>
    <td>${Util.currency(item.price * item.qty)}</td>
    <td>${item.qty}</td>
    `
}