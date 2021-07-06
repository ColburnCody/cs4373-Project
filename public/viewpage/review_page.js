import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Util from './util.js'
import * as Constant from '../model/constant.js'
import * as Auth from '../controller/auth.js'
import { Review } from '../model/review.js'
import * as EditReview from '../controller/edit_review.js'

export function addEventListeners() {

}


export async function review_page(productId) {

    let product
    let reviews
    try {
        product = await FirebaseController.customerGetProduct(productId)
        if (!product) {
            Util.info('Error', 'Product does not exist');
            return;
        }
        reviews = await FirebaseController.getReviewList(productId);
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

    html += `
        <div id="review-body">`
    if (reviews && reviews.length > 0) {
        reviews.forEach(r => {
            html += buildReview(r);
        })
    }
    html += `</div>`

    html += `
    <div>
        <textarea id="textarea-add-new-review" placeholder="Leave a review"></textarea>
        <br>
        <button id="button-add-new-review" class="btn btn-outline-info">Leave a review</button>
    </div>
    `

    Element.root.innerHTML = html;

    document.getElementById('button-add-new-review').addEventListener('click', async () => {
        const content = document.getElementById('textarea-add-new-review').value;
        const uid = Auth.currentUser.uid;
        const email = Auth.currentUser.email;
        const timestamp = Date.now();
        const review = new Review({
            uid, email, timestamp, content, productId,
        });

        const button = document.getElementById('button-add-new-review');
        const label = Util.disableButton(button);
        try {
            const docId = await FirebaseController.addReview(review);
            review.docId = docId;
        } catch (e) {
            if (Constant.DEV) console.log(e);
            Util.info('Error', JSON.stringify(e));
        }

        const reviewTag = document.createElement('div')
        reviewTag.innerHTML = buildReview(review)
        document.getElementById('review-body').appendChild(reviewTag)
        document.getElementById('textarea-add-new-review').value = ''

        Util.enableButton(button, label);
    })

    const editReviews = document.getElementsByClassName('edit-review-form');
    for (let i = 0; i < editReviews.length; i++) {
        editReviews[i].addEventListener('submit', async e => {
            e.preventDefault();
            const button = e.target.getElementsByTagName('button')[0];
            const label = Util.disableButton(button);
            await EditReview.edit_review(e.target.docId.value)
            Util.enableButton(button, label);
        })
    }

    const deleteReviews = document.getElementsByClassName('delete-review-form');
    for (let i = 0; i < deleteReviews.length; i++) {
        deleteReviews[i].addEventListener('submit', async e => {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete your review?")) return;
            const button = e.target.getElementsByTagName('button')[0];
            const label = Util.disableButton(button);
            await EditReview.delete_review(e.target.docId.value)
            Util.enableButton(button, label);
        })
    }

}

export function buildReview(review) {
    return Auth.currentUser.uid == review.uid ? `
    <div class="border border-primary">
    <div class="bg-info text white">
        Reviewed by ${review.email} At ${new Date(review.timestamp).toString()}
    </div>
        ${review.content}
    </div>
    <div>
        <form method="post" class="edit-review-form d-inline">
            <input type="hidden" name="docId" value="${review.docId}">
            <button class="btn btn-outline-info">Edit</button>
        </form>
        <form method="post" class="delete-review-form d-inline">
            <input type="hidden" name="docId" value="${review.docId}">
            <button class="btn btn-outline-danger">Delete</button>
        </form>
    </div>
    <hr>
    ` : `
        <div class="border border-primary">
            <div class="bg-info text white">
                Reviewed by ${review.email} At ${new Date(review.timestamp).toString()}
            </div>
            ${review.content}
        </div>
        <hr>
    `
}