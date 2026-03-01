<template>
    <div class="container box body-content">
        <NuxtImg src="images/logo.png" :width="180" :height="180" draggable="false" />
        <div>
            <input :class="{ error: loginForm.login === '' && !firstRender }" type="text" placeholder="email" v-model="loginForm.login">
            <inputPassword :class="{ error: loginForm.password === '' && !firstRender}" placeholder="senha" v-model="loginForm.password" />
            <div class="container">
                <button :disabled="loading" class="bold" @click="login">entrar</button>
                <button class="google-login" @click="loginWithGoogle">
                    <NuxtImg src="images/google-logo.svg" :width="30" :height="30" draggable="false" />
                    <span>Login com google</span>
                </button>
                <span @click="modal=true">cadastrar-se</span>
            </div>
        </div>
    </div>
    <div v-if="modal">
        <div class="container modal modal-active">
            <div class="box modal-active">
                <div class="logo bold">CADASTRO</div>
                <div class="container">
                    <input type="text" placeholder="email" v-model="registerForm.login">
                    <input type="text" placeholder="nome do responsável" v-model="registerForm.name">
                    <inputPassword placeholder="senha" v-model="registerForm.password" />
                    <inputPassword placeholder="confirme a senha" v-model="registerForm.confirmPassword" />
                    <div class="container">
                        <button :disabled="loading" class="bold" @click="register">cadastrar</button>
                        <span @click="modal=false">voltar</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    definePageMeta({
        layout: false
    })
    import { ref, watch } from 'vue'
    
    const supabase = useSupabaseClient()

    const registerForm = ref({
        login: '',
        password: '',
        confirmPassword: '',
        name: '',
    })

    const loginForm = ref({
        login: '',
        password: '',
    })

    const firstRender = ref(true)

    async function loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: import.meta.dev ? 'https://baby-center.vercel.app/confirm' : 'http://localhost:3000/confirm'
        }
    })
    if (error) console.error('Erro ao logar:', error.message)
    }

    function validEmailVerification() {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(registerForm.value.login);
    }
    function validateRegisterForm() {
        if (!validEmailVerification()) {
            alert('informe um email válido')
            return true
        }

        if (registerForm.value.password.length < 6) {
            alert('senha com no mínimo 6 caracteres')
            return true
        }

        if (registerForm.value.confirmPassword !== registerForm.value.password) {
            alert('as senhas estão diferentes!')
            return true
        }
        return registerForm.value.login === '' || registerForm.value.password === ''
    }

    function validateLoginForm() {
        firstRender.value = false
        return loginForm.value.login === '' || loginForm.value.password === ''
    }
    const loading = ref(false)

    const modal = ref(false)
    async function register() {
        if (validateRegisterForm()) return
        try {
            loading.value = true
            const { data, error } = await supabase.auth.signUp({
                email: registerForm.value.login,
                password: registerForm.value.password,
                options: {
                    // emailRedirectTo: 'http://localhost:3000/login',
                    emailRedirectTo: import.meta.dev ? 'https://baby-center.vercel.app/login' : 'http://localhost:3000/login',
                    data: {
                        name: registerForm.value.name
                    }
                }
            })
            if (error) console.error('ERROR CATCH', error)
            alert(`verifique sua caixa de entrada do email: ${registerForm.value.login} para confirmar o cadastro`)
        } catch (error) {
            console.error('ERROR CATCH', error)
        } finally {
            loading.value = false
        }
    }

    async function login() {
        try {
            if (validateLoginForm()) return
            loading.value = true
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginForm.value.login,
                password: loginForm.value.password,
            })
            if (error) {
                alert('erro:' +error)
                return
            }
            await getFamilyId()
            await navigateTo('/')
        } catch (error) {
            console.error('ERROR CATCH', error)
        } finally {
            loading.value = false
        }
    }

    async function getFamilyId() {
        const user = useSupabaseUser()

        if (!user.value) return

        const { data, error } = await supabase
            .from('family_members')
            .select('family_id')
            .eq('user_id', user.value.sub)
            .single()

        if (!error && data) {
            localStorage.setItem('family_id', data.family_id)
        }
    }

    watch(modal, () => {
        registerForm.value.login = ''
        registerForm.value.password = ''
        registerForm.value.confirmPassword = ''
    })
</script>
<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: .2);
    display: flex;
    justify-content: center;
}
.container {
    flex-direction: column;
    display: flex;
    align-items: center;
    padding: 10px;
    max-height: 97dvh;

    &.modal-active {
        max-height: 100vh;
        position: fixed;
        height: 100vh!important;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .logo {
        padding: 15px 20px;
        background: rgba(#a0d7ee, 1);
        border-radius: 50px;
        margin: 5px 0;
        color: #fff;
    }
    
    .image-picture {
        width: 100%;
        border: 1px solid #f4f4f4;
        min-height: 30dvh;
        background-image: url('https://s2.glbimg.com/He2eu5JY7s_xZ5dLYlJYve2jZlk=/e.glbimg.com/og/ed/f/original/2020/09/11/gettyimages-1185943155.jpg');
        background-size: cover;
        background-position: center;
    }

    .text-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin: 10px 0;

        p {
            font-size: 1.2rem;
            margin-top: 5px;
            width: 300px;
        }
    }

    .selection-step {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    input, select {
        margin-top: 10px;
        width: 100%;
        padding: 15px 15px;
        border-radius: 25px;
        border: none;
        &:focus {
            outline: none;
        }

        &.error {
            border: 1px solid red;
        }
    }

    .row {
        display: flex;
        input {
            &:first-child {
                margin-right: 5px;
                margin-left: 20px;
            }
            &:last-child {
                margin-left: 5px;
                margin-right: 20px;
            }
        }
        margin-bottom: 10px;
    }

    .google-login {
        display: flex;
        align-items: center;

        span {
            margin-left: 5px;
        }
    }
}

button {
    padding: 8px 15px;
    outline: none;
    border: none;
    border-radius: 50px;
    font-size: 1.2rem;
    display: flex;
    background: rgba(#a0d7ee, .8);
    transition: .2s ease-in-out;
    color: #fff;
    cursor: pointer;
    margin: 5px 0;
    border: 1px solid rgba(#000, .5);

    @media (max-width: 769px) {
        background: rgba(#a0d7ee, 1);
    }

    &:hover {
        background: rgba(#a0d7ee, 1);
    }
}

.box {
    background-color: #f7f7f7;
    margin: 10px;
    padding: 5px;
    border-radius: 16px;
    box-shadow: 0px 0px 5px 2px rgba(#000, .2);
    transition: .2s ease-in-out;
    max-width: 400px;

    &.modal-active {
        margin: 0;
        padding: 0;
        .logo {
            background: rgba(#a0d7ee, 1);
            margin: 0;
            border-radius: 15px 15px 0 0;
        }
    }
}

.body-content {
    margin: 0 auto;
    margin-top: 15px;
}

.characters {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: .2s ease-in-out;

    &:hover {
        transform: scale(1.1);
        .box {
            box-shadow: 0px 0px 5px 2px rgba(#a0d7ee, .9);
        }
    }

    span {
        font-size: 1.4rem;
    }

    .avatar {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

span {
    cursor: pointer;
}
</style>