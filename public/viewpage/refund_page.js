import * as Util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Auth from '../controller/auth.js'
import * as Constant from '../model/constant.js'
import * as Element from './element.js'

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
}