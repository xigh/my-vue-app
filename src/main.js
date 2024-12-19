import { createApp, h, Suspense } from 'vue'
import router from './router'
import App from './App.vue'

const app = createApp({
    render() {
        return h(Suspense, 
            { 
                style: {
                    height: '100%',
                    width: '100%',
                    display: 'block'
                } 
            }, 
            {
                default: () => h(App),
                fallback: () => h('div', {
                    style: {
                        height: '100vh',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }, 'Loading...')
            }
        )
    }
})

app.use(router)
app.mount('#app')