import * as FirebaseController from './firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import { Review } from '../model/review.js'
import * as Auth from '../controller/auth.js'

export function addEventListeners() {
    Element.formEditReview.addEventListener('submit', async e => {
        e.preventDefault();
        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disableButton(button)
        const content = e.target.content.value.trim();
        let ratingButtons = e.target.getElementsByClassName('radio-btn')
        let rating
        if (Auth.currentUser.email == Constant.adminEmail) {
            rating = e.target.rating.value;
        } else {
            for (let i = 0; i < ratingButtons.length; i++) {
                if (ratingButtons[i].checked) {
                    rating = ratingButtons[i].value;
                    break;
                } else {
                    rating = 1;
                }
            }
        }
        const r = new Review({
            content: content, rating: rating,
        })
        r.docId = e.target.docId.value;
        let stars = '';
        for (let i = 0; i < r.rating; i++) {
            stars += '☆';
        }

        try {
            await FirebaseController.updateReview(r.docId, content, rating);
            const reviewTag = document.getElementById('review-' + r.docId);
            reviewTag.getElementsByClassName('review-text')[0].innerHTML = r.content;
            reviewTag.getElementsByClassName('review-rating')[0].innerHTML = stars;
            for (let i = 0; i < ratingButtons.length; i++) {
                ratingButtons[i].checked = false;
            }
            Util.info('Review has been updated', 'Your review has been updated successfully', Element.modalEditReview);
        } catch (e) {
            if (Constant.DEV) console.log(e);
            Util.info('Review update error', JSON.stringify(e), Element.modalEditReview)
        }
        Util.enableButton(button, label);
    })
}

export async function edit_review(docId) {
    let review;
    try {
        review = await FirebaseController.getOneReview(docId);
        if (!review) {
            Util.info('getReview error', 'No review found')
            return;
        }
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('getReview error', JSON.stringify(e));
        return;
    }

    Element.formEditReview.docId.value = review.docId;
    Element.formEditReview.content.value = review.content;

    Element.modalEditReview.show();
}

export async function delete_review(docId) {
    try {
        await FirebaseController.deleteReview(docId);
        Util.info('Review deleted', 'Your review has been deleted')
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Delete review error', JSON.stringify(e))
    }
    window.history.back();
}