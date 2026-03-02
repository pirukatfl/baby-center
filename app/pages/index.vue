<template>
    <div class="container-list">
        <div class="container box body-content">
            <div class="logo bold">CENTRAL DO BEBÊ</div>
            <div class="container" v-if="step === 1">
                <h2>Selecione</h2>
                <div class="selection-step">
                    <template v-for="children in childrens">
                        <div class="characters" @click="showEventsChildren(children.id)">
                            <div class="avatar box">{{ children.name.charAt(0) }}</div>
                            <span>{{ children.name }}</span>
                        </div>
                        <div class="delete-button-positioned" @click="openConfirmation(children)">
                            <span><IconSvg :noHover="true" icon="delete" /></span>
                            <!-- <span><IconSvg :noHover="true" icon="edit" @click="openConfirmation(event)" /></span> -->
                        </div>
                    </template>
                    <div class="characters" @click="nextStep">
                        <div class="avatar box">+</div>
                        <span>Adicionar</span>
                    </div>
                    <BaseAlert v-show="showAlertDelete" :action="removeChild" @close="close">
                        Confirmar a exclusão do item {{ currentEventClicked.name }}?
                    </BaseAlert>
                </div>
            </div>
            <div class="container" v-if="step === 2">
                <div class="image-picture"></div>
                <div class="text-step">
                    <h2>Cada momento conta</h2>
                    <p>Acompanhe o desenvolvimento  do seu pequeno, desde os primeiros passos até as grnades conquistas!</p>
                </div>
                <div class="flex">
                    <button class="no-background" @click="cancel">cancelar</button>
                    <button class="bold" @click="saveChild">continuar</button>
                </div>
            </div>
            <div class="container" v-if="step === 3">
                <input type="text" placeholder="nome" v-model="form.name">
                <label for="birth-date">Data de nascimento:</label>
                <input type="date" placeholder="data de nascimento" name="birth-date" v-model="form.birthDate">
                <label for="birth-date">Gênero:</label>
                <select name="gender" id="gender" v-model="form.gender">
                    <option value="BOY">MENINO</option>
                    <option value="GIRL">MENINA</option>
                    <option value="OTHER">OUTRO</option>
                </select>
                <label for="birth-date">Tipo sanguíneo:</label>
                <select name="blood-type" id="blood-type" v-model="form.bloodType">
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
                <InputWeigth v-model="form.weight" />
                <InputHeight v-model="form.height" />
                <div class="flex">
                    <button class="no-background" @click="cancel">cancelar</button>
                    <button class="bold" @click="saveInfoChild">continuar</button>
                </div>
            </div>
            <div class="container" v-if="step === 4">
                <h2>Confirme as informações</h2>
                <div>Nome: {{ form.name }}</div>
                <div>Data de nascimento: {{ birthDateFormated }}</div>
                <div>Gênero: {{ genderMap[form.gender] }}</div>
                <div>Tipo Sanguíneo: {{ form.bloodType }}</div>
                <div class="row">
                    <div>Peso: {{ form.weight }}</div>
                    <div>Altura: {{ form.height }}</div>
                </div>
                <div class="flex">
                    <button class="no-background" @click="cancel">cancelar</button>
                    <button class="bold" @click="save">salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useRouter } from 'vue-router'
    import { onMounted, computed } from 'vue'

    const genderMap = {
        BOY: 'MENINO',
        GIRL: 'MENINA',
        OTHER: 'OUTRO',
    }

    interface Children {
        name: string,
        birthDate: string,
        gender: 'MENINO' | 'MENINA' | 'OUTRO',
        bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
        weight: string,
        height: string,
    }
    const supabase = useSupabaseClient()
    const defaultValue: Children = {
        name: '',
        birthDate: '',
        gender: 'MENINO',
        bloodType: 'A+',
        weight: '',
        height: '',
    }

    const showAlertDelete = ref(false)
    let currentEventClicked = {}

    const router = useRouter()
    const step = ref(1)
    const childrens = ref([])
    const form = ref<Children>(defaultValue)
    const familyId = localStorage.getItem('family_id') || 0
    
    function openConfirmation(event: {}) {
        currentEventClicked = event
        showAlertDelete.value = true
    }

    function showEventsChildren(childrenId: string) {
        router.replace(`timeline/${childrenId}`)
    }

    function nextStep() {
        step.value = step.value + 1
    }

    function saveChild() {
        nextStep()
    }
    function saveInfoChild() {
        nextStep()
    }

    function cancel() {
        step.value = 1
    }

    function close() {
        showAlertDelete.value = false
    }
    async function removeChild() {
        showAlertDelete.value = false
        const { error } = await supabase
            .from('children')
            .delete()
            .eq('id', currentEventClicked.id)
        if (!error) {
            await getChildrens()
            currentEventClicked = {}
            return
        }
        console.log(error)
        alert('erro ao deletar evento')
    }

    function formatValue(field: keyof Children) {
        (form.value[field] as any) = form.value[field].replace(/[^0-9,]/g, "")

        const pieces = form.value[field].split(',')
        if (pieces.length > 1) {
            (form.value[field] as any) = pieces[0] + ',' + pieces.slice(1).join("");
        }
    }

    const birthDateFormated = computed(() => {
        return form.value.birthDate.split('-').reverse().join('/')
    })
    async function save() {
        if (familyId === 0) {
            alert('faça o login novamente!')
            return
        }
        const { data, error } = await supabase
        .from('children')
        .insert([
            { 
                family_id: familyId,
                name: form.value.name,
                birth_date: form.value.birthDate,
                gender: form.value.gender,
                blood_type: form.value.bloodType,
                weight: form.value.weight,
                height: form.value.height,
            },
        ])
        .select()
        await getChildrens()
        step.value = 1
    }

    async function getChildrens() {
        const { data, error } = await supabase
            .from('children')
            .select('*')
            .eq('family_id', familyId)
        if (!error && data) {
            childrens.value = data
            return
        }
        alert('error when getting childrens')
    }

    onMounted(async () => {
        await getChildrens()
    })
</script>
<style lang="scss" scoped>
.flex {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
}
.container-list {
    display: flex;
    align-items: baseline;
    height: 70dvh;
    margin: 0 10px 0 10px;

    .container {
        flex-direction: column;
        display: flex;
        align-items: center;
        padding: 5px;
        max-width: 380px;
        width: 100%;

        .logo {
            padding: 5px 10px;
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
            margin: 10px 0 0 0;

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
            position: relative;

            .delete-button-positioned {
                position: absolute;
                left: -50px;
                top: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                border-radius: 30px;
                background-color: #cacaca;
                border: 1px solid #6d6d6d;
                cursor: pointer;
                transition: ease-in-out .2s;

                &:hover {
                    background-color: rgb(252, 83, 83);
                }

                img {
                    margin-top: 3px;
                    fill: red!important;
                    stroke: red!important;
                    color: red!important;
                }
            }
        }

        input, select {
            margin-top: 10px;
            width: 90%;
            padding: 15px 15px;
            border-radius: 25px;
            border: none;
            &:focus {
                outline: none;
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
    }
}

button {
    padding: 15px;
    outline: none;
    border: none;
    border-radius: 50px;
    font-size: 1.2rem;
    display: flex;
    background: rgba(#a0d7ee, .5);
    transition: .2s ease-in-out;
    color: #fff;
    cursor: pointer;

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
}

.body-content {
    width: 100%;
    margin: 0 auto;
    margin-top: 15px;
}

.characters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
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

label {
    margin-top: 5px;
    margin-bottom: -5px;
}

.no-background {
    background-color: rgba(160, 160, 160, 0.7);

    &:hover {
        background-color: rgba(240, 89, 89, 1);;
    }
}
</style>