import * as Element from './element.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Auth from '../controller/auth.js'

export function addEventListeners() {
    Element.menuRefunds.addEventListener('click', async () => {
        await refund_page();
    })
}

export async function refund_page() {
    if (!Auth.currentUser) return;

    let html = `
    <h1>Welcome to the refund management page</h1>
    `

    let refundList;
    try {
        refundList = await FirebaseController.getRefundRequests();
        if (refundList.length == 0) {
            html += '<h2>No refund requests pending!</h2>'
            Element.root.innerHTML = html;
            return;
        }
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Error retrieving users', JSON.stringify(e));
    }

    html += `
    <table class="table table-striped">
    <thead>
    <tr>
      <th scope="col">View</th>
      <th scope="col">Items</th>
      <th scope="col">Price</th>
      <th scope="col">Date</th>
    </tr>
    </thead>
    <tbody>`

    for (let i = 0; i < refundList.length; i++) {
        html += `
        <tr>
            <td>
                <form class="form-purchase-history" method="post">
                    <input type="hidden" name="index" value="${i}">
                    <button type="submit" class="btn btn-outline-primary">Details</button>
                </form>
            </td>
            <td>${refundList[i].getTotalQty()}</td>
            <td>${Util.currency(refundList[i].getTotalPrice())}</td>
            <td>${Date(refundList[i].timestamp).toString()}</td>
            <td>
                <form method="post" class="approve-refund-form">
                    <input type="hidden" name="docId" value="${refundList[i].docId}">
                    <button type="submit" class="btn btn-outline-primary">Approve</button>
                </form>
            </td>
            <td>
                <form method="post" class="deny-refund-form">
                    <input type="hidden" name="docId" value="${refundList[i].docId}">
                    <button type="submit" class="btn btn-outline-danger">Deny</button>
                </form>
            </td>
        </tr>
        `;
    }

    html += '</tbody></table>';

    Element.root.innerHTML = html;

    const historyForms = document.getElementsByClassName('form-purchase-history');
    for (let i = 0; i < historyForms.length; i++) {
        historyForms[i].addEventListener('submit', e => {
            e.preventDefault();
            const index = e.target.index.value;
            Element.modalTransactionTitle.innerHTML = `Purchased at ${new Date(refundList[index].timestamp).toString()}`;
            Element.modalTransactionBody.innerHTML = buildTransactionView(refundList[index]);
            Element.modalTransactionView.show();
        })
    }

    const approveRefundForms = document.getElementsByClassName('approve-refund-form');
    for (let i = 0; i < approveRefundForms.length; i++) {
        approveRefundForms[i].addEventListener('submit', async e => {
            e.preventDefault();
            await FirebaseController.approveRefundRequest(e.target.docId.value);
            Util.info('Refund approved', 'You have approved the refund request')
            window.history.back();
        })
    }

    const denyRefundForms = document.getElementsByClassName('deny-refund-form');
    for (let i = 0; i < denyRefundForms.length; i++) {
        denyRefundForms[i].addEventListener('submit', async e => {
            e.preventDefault();
            const status = 'ordered';
            await FirebaseController.requestRefund(e.target.docId.value, status);
            Util.info('Refund denied', 'You have denied the refund request')
            window.history.back();
        })
    }
}

function buildTransactionView(cart) {
    let html = `
    <table class="table">
    <thead>
    <tr>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Price</th>
      <th scope="col">Quantity</th>
      <th scope="col">Subtotal</th>
      <th scope="col" width="50%">Summary</th>
    </tr>
    </thead>
    <tbody>
    `

    cart.items.forEach(item => {
        html += `
        <tr>
            <td><img src="${item.imageURL}" width="150px"></td>
            <td>${item.name}</td>
            <td>${Util.currency(item.price)}</td>
            <td>${item.qty}</td>
            <td>${Util.currency(item.qty * item.price)}</td>
            <td>${item.summary}</td>
        </tr>
        `
    })
    html += '</tbody></table>';
    html += `<div style="font-size: 150%">Total: ${Util.currency(cart.getTotalPrice())}</div>`;

    return html;
}