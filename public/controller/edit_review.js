import * as FirebaseController from './firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import { Review } from '../model/review.js'

export function addEventListeners() {
    Element.formEditReview.addEventListener('submit', async e => {
        e.preventDefault();
        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disableButton(button)

        const content = e.target.content.value.trim();

        const r = new Review({
            content: content,
        })
        r.docId = e.target.docId.value;
        try {
            await FirebaseController.updateReview(r);
            window.location.reload();
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

    Element.formEditReview.content.value = review.content;

    Element.modalEditReview.show();
}

export async function delete_review(docId) {
    try {
        await FirebaseController.deleteReview(docId);
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info('Delete review error', JSON.stringify(e))
    }
    window.history.back();
}