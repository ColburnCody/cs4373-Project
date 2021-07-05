import * as Home from '../viewpage/home_page.js'
import * as Purchase from '../viewpage/purchase_page.js'
import * as Cart from '../viewpage/cart.js'
import * as Profile from '../viewpage/profile_page.js'
import * as ProductPage from '../viewpage/product_page.js'
import * as UserPage from '../viewpage/user_page.js'
import * as Review from '../viewpage/review_page.js'

export const routePathnames = {
    HOME: '/',
    PURCHASE: '/purchase',
    PROFILE: '/profile',
    CART: '/cart',
    PRODUCTS: '/product',
    USER: '/user',
    REVIEW: '/reviews',
}

export const routes = [
    { pathName: routePathnames.HOME, page: Home.home_page },
    { pathName: routePathnames.PURCHASE, page: Purchase.purchase_page },
    { pathName: routePathnames.CART, page: Cart.cart_page },
    { pathName: routePathnames.PROFILE, page: Profile.profile_page },
    { pathName: routePathnames.PRODUCTS, page: ProductPage.product_page },
    { pathName: routePathnames.USER, page: UserPage.users_page },
    { pathName: routePathnames.REVIEW, page: Review.review_page },
];

export function routing(pathName, hash) {
    const route = routes.find(r => r.pathName == pathName);
    if (route) route.page();
    else route[0].page();
}