import * as FirebaseController from '../controller/firebase_controller.js'
import * as Element from '../viewpage/element.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Route from './route.js'
import * as Home from '../viewpage/home_page.js'
import * as Profile from '../viewpage/profile_page.js'

export let currentUser;

export function addEventListeners() {

    Element.formSignin.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disableButton(button);
        try {
            await FirebaseController.signIn(email, password);
            Element.modalSignin.hide();
        } catch (e) {
            if (Constant.DEV) console.log(e);
            Util.info('Sign in error', JSON.stringify(e), Element.modalSignin);
        }
        Util.enableButton(button, label);
    })

    Element.menuSignOut.addEventListener('click', async () => {
        try {
            await FirebaseController.signOut();
        } catch (e) {
            if (Constant.DEV) console.log(e);
            Util.info('Sign out error', JSON.stringify(e))
        }
    })

    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            currentUser = user;
            await Profile.getAccountInfo(user)

            Home.initShoppingCart();

            let elements = document.getElementsByClassName('modal-pre-auth');
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
            elements = document.getElementsByClassName('modal-post-auth');
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }

            if (currentUser.email == Constant.adminEmail) {
                elements = document.getElementsByClassName('admin-login');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }
                elements = document.getElementsByClassName('user-login');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
            } else {
                elements = document.getElementsByClassName('admin-login');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                elements = document.getElementsByClassName('user-login');
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }
            }

            Route.routing(window.location.pathname, window.location.hash);
        } else {
            currentUser = null;
            let elements = document.getElementsByClassName('modal-post-auth');
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
            elements = document.getElementsByClassName('modal-pre-auth');
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }

            history.pushState(null, null, Route.routePathnames.HOME);
            Route.routing(window.location.pathname, window.location.hash);

        }
    });

    Element.buttonSignup.addEventListener('click', () => {
        // show sign up modal
        Element.modalSignin.hide();
        Element.formSignup.reset();
        Element.formSignupPasswordError.innerHTML = ''
        Element.modalSignup.show();
    })

    Element.formSignup.addEventListener('submit', async e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const passwordConfirm = e.target.passwordConfirm.value;

        Element.formSignupPasswordError.innerHTML = ''
        if (password != passwordConfirm) {
            Element.formSignupPasswordError.innerHTML = 'Two passwords do not match';
            return;
        }

        try {
            await FirebaseController.createUser(email, password);
            Util.info('Account created!', `You are now signed in as ${email}`, Element.modalSignup.hide())
        } catch (e) {
            if (Constant.DEV) console.log(e)
            Util.info('Failed to create new account', JSON.stringify(e), Element.modalSignup.hide());
        }
    })
}