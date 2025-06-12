import { createRouter, createMemoryHistory } from "vue-router";
import Home from '../components/Home.vue'
import Menu from '../components/Menu.vue';
import Reserve from '../components/Reserve.vue';
import Events from '../components/Events.vue';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import Crud from '../components/AdminComponets/CrudUsers.vue';
import CrudReservations from '../components/AdminComponets/Reservations/CrudReservations.vue';
import Cart from '../components/Cart.vue';


const routes = [
    { path: '/', component: Home, name: 'Home'}, 
    { path: '/menu', component: Menu, name: 'Menu'},
    { path: '/reserve', component: Reserve,name: 'Reserve' },
    { path: '/events', component: Events, name: 'Events' },
    { path: '/register', component: Register, name: 'Register' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/cart', name: 'Cart'},
    { path: '/crud', component: Crud, name: 'Crud' },
    
    { path: '/cart', component:Cart ,name: 'Cart'},
    { path: '/CrudReservations', component:CrudReservations ,name: 'CrudReservations'}
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router;