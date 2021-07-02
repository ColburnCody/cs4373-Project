import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as Auth from '../controller/auth.js'

export function addEventListeners() {
    Element.menuProfile.addEventListener('click', async () => {
        history.pushState(null, null, Route.routePathnames.PROFILE);
        await profile_page();
    })
}

let accountInfo;

export async function profile_page() {
    let html = '<h1>Profile page</h1>'
    if (!Auth.currentUser) {
        html += '<h2>Protected page</h2>'
        Element.root.innerHTML = html;
        return;
    }

    if (!accountInfo) {
        html += `<h2>Failed to retrieve account info for ${Auth.currentUser.email}</h2>`
        Element.root.innerHTML = html;
        return;
    }

    html += `
    <div class="alert alert-primary">
        Email: ${Auth.currentUser.email} (cannot change email as login name)
    </div>
    `;

    Element.root.innerHTML = html;
}

export async function getAccountInfo(user) {
    try {
        accountInfo = await FirebaseController.getAccountInfo(user.uid);
    } catch (e) {
        if (Constant.DEV) console.log(e);
        Util.info(`Failed to retrieve account info for ${user.email}`, JSON.stringify(e));
        accountInfo = null;
        return;
    }

    Element.menuProfile.innerHTML = `
    <img src=${accountInfo.photoURL} class="rounded-circle" height="30px">
    `;
}