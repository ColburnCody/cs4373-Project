import * as Auth from './controller/auth.js'
import * as Home from './viewpage/home_page.js'
import * as Purchase from './viewpage/purchase_page.js'
import * as Cart from './viewpage/cart.js'
import * as Profile from './viewpage/profile_page.js'
import * as Route from './controller/route.js'
import * as ProductPage from './viewpage/product_page.js'
import * as UserPage from './viewpage/user_page.js'
import * as Review from './viewpage/review_page.js'
import * as EditReview from './controller/edit_review.js'

Auth.addEventListeners();
Home.addEventListeners();
Purchase.addEventListeners();
Cart.addEventListeners();
Profile.addEventListeners();
ProductPage.addEventListeners();
UserPage.addEventListeners();
Review.addEventListeners();
EditReview.addEventListeners();

window.onload = () => {
    const pathName = window.location.pathname;
    const hash = window.location.hash;
    Route.routing(pathName, hash);
}

window.addEventListener('popstate', e => {
    e.preventDefault();
    const pathName = e.target.location.pathname;
    const hash = e.target.location.hash;
    Route.routing(pathName, hash);
})
