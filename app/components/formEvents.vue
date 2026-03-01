<template>
    <Teleport to="body">
        <div v-if="isOpen" class="overflow-body">
            <div class="container">
                <div class="modal">
                    <div class="header">
                        <div class="title">novo evento</div>
                        <div class="close" @click="closeModal">fechar</div>
                    </div>
                    <div class="body">
                        <input-file v-model="form.file" @change-image="getImageModel($event)" />
                        <input :class="{ error: form.title === '' }" placeholder="título" type="text" v-model="form.title">
                        <select name="event" id="event" v-model="form.category">
                            <option v-for="category in categoriesData" :value="category.id">{{ categoriesMapper[category.name] }}</option>
                        </select>
                        <input-currency v-model="form.value" />
                        <input placeholder="data" type="date" v-model="form.date">
                        <textarea placeholder="Descrição do evento" v-model="form.description" />
                    </div>
                    <button @click="saveEvent">salvar evento</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const supabase = useSupabaseClient()
    const categoriesData = ref([])
    const file = ref(null)
    const categoriesMapper = {
        exam: 'Exame',
        consultation: 'Consulta',
        recipe: 'Receita',
        daily: 'Evento do dia',
        note: 'Nota de compra',
    }

    interface FormEvent {
        title: string,
        category: string,
        description: string,
        value: number,
        date: string,
        imageUrl: string,
    }

    const form = ref<FormEvent>({
        title: '',
        category: '7a42b0e8-7824-4a2d-8a25-af1d36093035',
        description: '',
        value: 0,
        date: '',
        imageUrl: '',
    })

    function getNow() {
        const today = new Date()
        form.value.date = `${String(today.getFullYear())}-${(String(today.getMonth())).padStart(2, '0')}-${String(String(today.getDate()).padStart(2, '0'))}`
    }

    const props = defineProps({
        isOpen: {
            type: Boolean,
        },
    })
    const emit = defineEmits([
        'close',
        'reload-list-events'
    ])

    function closeModal() {
        clearForm()
        emit('close')

    }

    function clearForm() {
        form.value.title = ''
        form.value.category = '7a42b0e8-7824-4a2d-8a25-af1d36093035'
        form.value.description = ''
        form.value.value = 0
        form.value.date = ''
        form.value.imageUrl = ''
        getNow()
    }

    function getImageModel(image: File) {
        file.value = image
    }

    async function saveEventImage(eventId) {
        if (!file.value) return
        const fileExt = file.value.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `event/${fileName}`

        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file.value)

        if (error) {
            console.error('Erro no upload:', error.message);
            return;
        }

        await saveImageEventPath(eventId, filePath)
    }

    async function saveImageEventPath(eventId: number, filePath: string) {
        const { data, error } = await supabase
        .from('image_events')
        .insert([
            { event_id: eventId, image_path: filePath },
        ])
        .select()

        if (error) {
            alert('erro ao salvar o path a imagem')
        }
    }
    async function saveEvent() {
        if (!form.value.title) return
        const child_id = route.params.id
        const { data, error } = await supabase
        .from('life_events')
        .insert([
            { 
                child_id,
                event_title: form.value.title,
                event_description: form.value.description,
                event_date: form.value.date,
                event_value: form.value.value ? form.value.value.split('.').join('').split(',').join('').split('R$').join('').trim() * 100 : 0,
                categorie_id: form.value.category
            },
        ])
        .select()
        if (error) {
            alert('erro ao salvar o evento')
        }
        await saveEventImage(data[0].id)
        emit('reload-list-events')
        closeModal()
    }

    async function getCategories() {
        const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name')
        if (error) {
            alert('erro ao buscar lista de categorias')
        }
        categoriesData.value = categories
    }

    onMounted(async() => {
        await getCategories()
        getNow()
    })
</script>
<style lang="scss" scoped>
.overflow-body {
    position: fixed;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba($color: #000000, $alpha: .3);
}

.container {
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;

    .modal {
        padding: 0 0px 15px 0;
        border-radius: 24px;
        width: 90dvw;
        min-width: 300px;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f4f4f4;
        overflow-y: auto;

        .header {
            padding: 15px 24px;
            border-radius: 24px 24px 0 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #ffffff;

            .title {
                font-size: 1.3rem;
            }

            .close {
                cursor: pointer;
            }
        }

        .body {
            overflow-y: auto;

        }
    }
}

input, select, textarea {
    margin-top: 10px;
    width: 100%;
    padding: 10px 15px;
    border-radius: 25px;
    border: none;

    &:focus {
        outline: none;
    }

    &.error {
        border: 1px solid red;
    }
}

textarea {
    min-height: 180px;
    margin-bottom: 10px;
}

button {
    cursor: pointer;
    padding: 10px 15px;
    outline: none;
    border: none;
    border-radius: 50px;
    font-size: 1.2rem;
    display: flex;
    border: 1px solid rgba($color: #000000, $alpha: .3);
}
</style>