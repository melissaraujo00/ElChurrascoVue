import { createRouter, createMemoryHistory } from "vue-router";
import Home from '../components/Home.vue'
import Menu from '../components/Menu.vue';
import Reserve from '../components/Reserve.vue';
import Events from '../components/Events.vue'


const routes = [
    {path: '/', component: Home, name: 'Home'}, 
    {path: '/menu', component: Menu, name: 'Menu'},
    { path: '/reserve', component: Reserve,name: 'Reserve' },
    { path: '/events', component: Events, name: 'Events' }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router;