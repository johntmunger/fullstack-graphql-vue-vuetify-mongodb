import store from './store/index';

export default (to, from, next) => {
    if(!store.getters.user) {
    // redirect to signin page if no user exists
    next({
        path: '/signin'
    });
    } else {
    next();
    }
}
