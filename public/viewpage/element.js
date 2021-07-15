// ROOT element
export const root = document.getElementById('root')

// top menus
export const menuSignIn = document.getElementById('menu-signin');
export const menuHome = document.getElementById('menu-home');
export const menuPurchases = document.getElementById('menu-purchases');
export const menuSignOut = document.getElementById('menu-signout');
export const menuCart = document.getElementById('menu-cart');
export const menuProfile = document.getElementById('menu-profile');
export const shoppingCartCount = document.getElementById('shoppingcart-count');
export const menuProducts = document.getElementById('menu-products')
export const menuUsers = document.getElementById('menu-users')
export const menuRefunds = document.getElementById('menu-refunds')

// forms
export const formSignin = document.getElementById('form-signin');
export const formSignup = document.getElementById('form-signup');
export const formSignupPasswordError = document.getElementById('form-signup-password-error');
export const formAddProduct = {
    form: document.getElementById('form-add-product'),
    errorName: document.getElementById('form-add-product-error-name'),
    errorPrice: document.getElementById('form-add-product-error-price'),
    errorSummary: document.getElementById('form-add-product-error-summary'),
    imageTag: document.getElementById('form-add-product-image-tag'),
    imageButton: document.getElementById('form-add-product-image-button'),
    errorImage: document.getElementById('form-add-product-error-image'),

}
export const buttonSignup = document.getElementById('button-signup');
export const formEditProduct = {
    form: document.getElementById('form-edit-product'),
    imageTag: document.getElementById('form-edit-product-image-tag'),
    imageButton: document.getElementById('form-edit-product-image-button'),
    errorName: document.getElementById('form-edit-product-error-name'),
    errorPrice: document.getElementById('form-edit-product-error-price'),
    errorSummary: document.getElementById('form-edit-product-error-summary'),
    errorImage: document.getElementById('form-edit-product-error-image')
};
export const formEditReview = document.getElementById('form-edit-review');


// modals
export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'), { backdrop: 'static' });
export const modalInfo = new bootstrap.Modal(document.getElementById('modal-info'), { backdrop: 'static' });
export const modalInfoTitle = document.getElementById('modal-info-title');
export const modalInfoBody = document.getElementById('modal-info-body');
export const modalTransactionView = new bootstrap.Modal(document.getElementById('modal-transaction-view'), { backdrop: 'static' });
export const modalTransactionTitle = document.getElementById('modal-transaction-title');
export const modalTransactionBody = document.getElementById('modal-transaction-body');
export const modalSignup = new bootstrap.Modal(document.getElementById('modal-signup'), { backdrop: 'static' });
export const modalAddProduct = new bootstrap.Modal(document.getElementById('modal-add-product'), { backdrop: 'static' })
export const modalEditProduct = new bootstrap.Modal(document.getElementById('modal-edit-product'), { backdrop: 'static' })
export const modalEditReview = new bootstrap.Modal(document.getElementById('modal-edit-review'), { backdrop: 'static' });