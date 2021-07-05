import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Util from './util.js'
import * as Constant from '../model/constant.js'

export function addEventListeners() {

}


export async function review_page(productId) {

    let product
    try {
        product = await FirebaseController.customerGetProduct(productId)
        if (!product) {
            Util.info('Error', 'Product does not exist');
            return;
        }
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Error', JSON.stringify(e));
        return;
    }

    let html = `
    <div class="card" style="width: 18rem; display: inline-block;">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">
                ${Util.currency(product.price)} <br>
                ${product.summary}
            </p>
            </div>
        </div>
    </div>
    `;

    Element.root.innerHTML = html;

}