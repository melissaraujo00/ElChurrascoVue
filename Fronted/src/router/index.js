import { createRouter, createMemoryHistory } from "vue-router";
import Home from '../components/Home.vue'
import Menu from '../components/Menu.vue';
import Reserve from '../components/Reserve.vue';
import Events from '../components/Events.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import Cart from '../components/Cart.vue';


const routes = [
    { path: '/', component: Home, name: 'Home'}, 
    { path: '/menu', component: Menu, name: 'Menu'},
    { path: '/reserve', component: Reserve,name: 'Reserve' },
    { path: '/events', component: Events, name: 'Events' },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/cart', name: 'Cart'},
    { path: '/cart', component:Cart ,name: 'Cart'}
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router;