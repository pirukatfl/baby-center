<template>
    <div class="container-events">
        <div class="new-event">
            <button @click="open" :disabled="events.length >= 30"><IconSvg icon="add" /><span>novo evento</span></button>
            <div class="filter">
                <span>Filtrar por:</span>
                <BaseTag
                    v-for="category in categoriesData"
                    :key="category.id"
                    :category="category"
                    :isActive="filters.includes(category.id) || (!filters.length && category.id === 'all')"
                    @clicked="updateFilter($event)"
                />
            </div>
        </div>
        <BaseAlert v-show="showAlertDelete" :action="removeEvent" @close="close">
            Confirmar a exclusão do item {{ currentEventClicked.event_title }}?
        </BaseAlert>
        <div class="container">
            <FormEvents :isOpen="isOpen" @close="close" @reload-list-events="getEvents" />
            <ModalImage :isOpenImage="isOpenImage" :imagePath="imagePath" :eventTitle="eventTitle" @close="close" />
            <div class="timeline" v-for="event in events" :key="event.id">
                <template  v-if="event.id !== currentEventClickedToEdit.id"> 
                    <div class="line">
                        <div class="category"><IconSvg :noHover="true" :icon="event.category.name" /></div>
                        <div class="category __bg"></div>
                        <div class="category-name">{{ categoriesMapper[event.category.name] }}</div>
                    </div>
                    <div class="card">
                        <div class="event-title">
                            <h4>{{ event.event_title }}</h4>
                            <div class="event-date-value">
                                <div class="event-date">{{ event.event_date ? event.event_date.split('-').reverse().join('/') : '' }}</div>
                                <div class="event-value">{{ formatCurrency(event.event_value) }}</div>
                            </div>
                        </div>
                        <div class="event-description">
                            {{ event.event_description }}
                        </div>
                        <div class="event-actions">
                            <div><IconSvg :noHover="true" icon="delete" @click="openConfirmation(event)" /></div>
                            
                            <div><IconSvg :noHover="true" icon="edit" @click="editEvent(event)" /></div>
                        </div>
                        <div
                            class="file"
                            v-if="event.image.length"
                            @click="openModalImage(`${config.public.supabaseUrl}/storage/v1/object/public/images/${event.image[0].image_path}`, event.event_title)"
                        >
                            <IconSvg :noHover="true" title="Ver mais" icon="image" />
                            <span>Ver mais</span>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="line">
                        <div class="category"><IconSvg :noHover="true" :icon="currentEventClickedToEdit.category.name" /></div>
                        <div class="category __bg"></div>
                        <div class="category-name">{{ categoriesMapper[currentEventClickedToEdit.category.name] }}</div>
                    </div>
                    <div class="card">
                            <div class="update-image">
                                <template v-if="currentEventClickedToEdit.image && currentEventClickedToEdit.image.length && !isUpdateImage">
                                    <div class="edit-image">
                                        <IconSvg icon="edit" @click="toggleEditImage(true)"/>
                                    </div>
                                    <NuxtImg
                                        :src="`${config.public.supabaseUrl}/storage/v1/object/public/images/${currentEventClickedToEdit.image[0].image_path}`"
                                        draggable="false"
                                    />
                                </template>
                                <template v-else>
                                    <div v-if="isUpdateImage || newImage" class="edit-image">
                                        <IconSvg icon="cancel" @click="toggleEditImage(false) "/>
                                    </div>
                                    <input-file
                                        v-if="isUpdateImage || !currentEventClickedToEdit.image.length"
                                        v-model="imageToEdit"
                                        @change-image="getImageModel($event)"
                                    />
                                </template>
                            </div>
                            <input :class="{ error: currentEventClickedToEdit.event_title === '' }" placeholder="título" type="text" v-model="currentEventClickedToEdit.event_title">
                            <select name="event" id="event" v-model="currentEventClickedToEdit.category.id">
                                <option v-for="category in categoriesData" :value="category.id">{{ categoriesMapper[category.name] }}</option>
                            </select>
                            <input placeholder="data" type="date" v-model="currentEventClickedToEdit.event_date">
                            <input-currency v-model="currentEventClickedToEdit.event_value " />
                            <textarea placeholder="Descrição do evento" v-model="currentEventClickedToEdit.event_description" />
                        <div class="event-actions">
                            <IconSvg icon="confirm" @click="updateEvent" />
                            <IconSvg icon="cancel" @click="currentEventClickedToEdit = {}" />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { useRoute } from 'vue-router'
    import { onMounted } from 'vue'

    const config = useRuntimeConfig()
    let filters = ref([])
    const imageToEdit = ref('')
    const newImage = ref('')
    const showAlertDelete = ref(false)
    let currentEventClicked = {}
    let currentEventClickedToEdit = ref({})
    const categoriesData = ref([])
    const isUpdateImage = ref(false)

    const categoriesMapper = {
        exam: 'Exame',
        consultation: 'Consulta',
        recipe: 'Receita',
        daily: 'Evento do dia',
        note: 'Nota de compra',
    }

    const router = useRoute()

    const supabase = useSupabaseClient()

    const isOpen = ref(false)
    const isOpenImage = ref(false)
    const imagePath = ref('')
    const eventTitle = ref('')

    let events = ref([])

    function formatCurrency(value: string) {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

        return String(formatter.format(Number(String(value).replace(/\D/g, '')) / 100 / 100))
    }

    function getImageModel(image: File) {
        newImage.value = image
    }

    function toggleEditImage(value) {
        isUpdateImage.value = value
        if (!isOpenImage.value) {
            imageToEdit.value = ''
            newImage.value = ''
        }
    }

    function transformToObjectUrl(file: File) {
        if (currentEventClickedToEdit.value.image) {
            URL.revokeObjectURL(currentEventClickedToEdit.value.image);
        }
        currentEventClickedToEdit.value.image = URL.createObjectURL(file)
    }
    function updateFilter(event: string) {
        if (event === 'all') {
            filters.value = []
            getEvents()
            return
        }
        const index = filters.value.indexOf(event)
        if (index === -1) {
            filters.value.push(event)
            getEvents()
            return
        }

        filters.value.splice(index, 1)
        getEvents()

    }

    function editEvent(event: {}) {
        currentEventClickedToEdit.value = { ...event, image: event.image.length ? event.image : [] }
    }

    function openConfirmation(event: {}) {
        currentEventClicked = event
        showAlertDelete.value = true
    }

    function close() {
        isOpen.value = false
        isOpenImage.value = false
        showAlertDelete.value = false
        imagePath.value = ''
        eventTitle.value = ''
    }

    function open() {
        isOpen.value = true
    }

    function openModalImage(eventImagePath: string, eventTitleToModal: string) {
        isOpenImage.value = true
        imagePath.value = eventImagePath
        eventTitle.value = eventTitleToModal
    }

    async function removeEvent() {
        const event = { ...currentEventClicked }
        showAlertDelete.value = false
        currentEventClicked = {}
        const { error } = await supabase
            .from('life_events')
            .delete()
            .eq('id', event.id)
        if (!error) {
            if (event.image.length) {
                const pathsToDelete = event.image.map(img => img.image_path)
                const { error: storageError } = await supabase.storage
                    .from('images')
                    .remove(pathsToDelete)

                if (storageError) alert(`Erro ao excluir imagem do storage: ${storageError.message}`)
            }
            await getEvents()
            return
        }
        alert('erro ao deletar evento')
    }

    async function saveEventImage(eventId) {
        if (!imageToEdit.value) return
        const fileExt = newImage.value.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `event/${fileName}`

        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, newImage.value)

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

        return data.image_path
    }

    async function updateEvent() {
        if (!currentEventClickedToEdit.value.event_title) return
        let image_path: string = ''
        if (!currentEventClickedToEdit.value.image.length) {
           image_path = await saveEventImage(currentEventClickedToEdit.value.id)
        } else {
            await supabase.storage.from('bucket').remove([currentEventClickedToEdit.value.image[0].image_path])
            image_path = saveEventImage(currentEventClickedToEdit.value.id)
        }

        if (image_path) {
            const { data, error } = await supabase
            .from('life_events')
            .update(
                { 
                    image_path
                },
            )
            .eq('event_id', currentEventClickedToEdit.value.id)
            .select()
        }

        const { data, error } = await supabase
        .from('life_events')
        .update(
            { 
                event_title: currentEventClickedToEdit.value.event_title,
                event_description: currentEventClickedToEdit.value.event_description,
                event_date: currentEventClickedToEdit.value.event_date,
                event_value: currentEventClickedToEdit.value.event_value.split('.').join('').split(',').join('').split('R$').join('').trim() * 100,
                categorie_id: currentEventClickedToEdit.value.category.id,

            },
        )
        .eq('id', currentEventClickedToEdit.value.id)
        .select()
        if (error) {
            alert('erro ao salvar o evento')
        }
        currentEventClickedToEdit.value = {}
        isUpdateImage.value = false
        await getEvents()
    }

    async function getEvents() {
        const childId: string | string[] = router.params.id || ''
        let query = supabase
        .from('life_events')
        .select('id, event_title, event_description, event_date, event_value, category:categories(name, id), image:image_events(id, event_id, image_path)')
        .eq('child_id', childId)

        if (filters.value.length) {
            query = query.in('categorie_id', filters.value)
        }

        const { data, error } = await query.order('id', { ascending: true })

        if (error) {
            alert('erro ao buscar listagem de eventos')
            return
        }
        events.value = data
    }

    async function getCategories() {
        const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name')
        if (error) {
            alert('erro ao buscar lista de categorias')
        }
        categoriesData.value = categories
        categoriesData.value.push({ id: 'all', name: 'all'})
    }

    onMounted(async() => {
        getCategories()
        getEvents()
    })
</script>
<style lang="scss" scoped>
.container-events {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.input-file {
    width: 90%!important;
}
.new-event {
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .filter {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        span {
            margin: 10px;
        }
    }
}
.container {
    flex-direction: column;
    display: flex;
    align-items: center;
    padding: 0 25px;
    padding-top: 15px;
    position: relative;
    height: 76dvh;
    overflow-y: auto;

    &:after {
        position: absolute;
        content: '';
        height: 100%;
        left: 1.9rem;
    }

    .timeline {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 15px;

        &:last-child {
            margin-bottom: 0px;
        }

        .line {
            height: auto;
            width: 2px;
            margin-right: 20px;
            margin-left: 20px;
            position: relative;

            .category {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                border-radius: 30px;
                border: 1px solid rgba($color: black, $alpha: .3);
                content: '';
                background-color: rgba($color: white, $alpha: .6);
                left: -28px;
                top: -34px;
                z-index: 2;

                &.__bg {
                    background-color: #c5e5f3;
                    z-index: 1;
                }
            }

            .category-name {
                text-align: center;
                content: '';
                width: 52px;
                position: absolute;
                font-size: .5rem;
                text-transform: uppercase;
                z-index: 2;
                left: -38px;
                padding: 3px;
                border-radius: 50px;
                top: 0;
                background-color: #535252;
                font-weight: bold;
                color: #c5e5f3;
            }
        }

        .card {
            width: 100%;
            background-color: rgb(245, 245, 245);
            padding: 10px;
            border-radius: 15px;
            position: relative;
            min-height: 65px;

            .update-image {
                position: relative;
                

                .edit-image {
                    position: absolute;
                    right: 40px;
                    top: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    content: '';
                    background-color: rgba($color: #fff, $alpha: .5);
                    border-radius: 10px;
                    transition: .2s ease-in-out;
                    z-index: 998;

                    img {
                        margin: 5px;
                        overflow: hidden;
                    }

                    &:hover {
                        background-color: rgba($color: #fff, $alpha: .7);
                    }
                }

                img {
                    width: 90%;
                }
            }

            .event-actions {
                position: absolute;
                right: 0;
                height: 100%;
                background-color: white;
                border-radius: 0 15px 15px 0;
                top: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                z-index: 1;

                div {
                    height: 100%;
                    width: 100%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: .2s ease-in-out;
                    border-radius: 0 15px 15px 0;
                    &:first-child {
                        border-radius: 0 15px 0 0;
                    }
                    &:last-child {
                        border-radius: 0 0 15px 0;
                    }

                    &:hover {
                        background-color: rgba($color: black, $alpha: .1);;

                        img {
                            fill: #ff0000; /* Altera a cor do preenchimento */
                            stroke: #00ff00;

                            &:hover {
                                fill: red!important;
                                stroke: red!important;
                            }
                        }
                    }
                }

                img {
                    width: 30px;
                    height: 24px;
                }
            }

            .event-title {
                text-transform: uppercase;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;

                h4 {
                    padding-right: 5px;
                    overflow-wrap: break-word;
                    hyphens: auto;
                }

            }

            .event-description {
                font-size: .8rem;
                padding-right: 5px;
            }

            .event-date-value {
                display: flex;
                flex-direction: column;
                margin-right: 30px;
                text-align: right;

                .event-date {
                    font-size: .7rem;
                    font-weight: bold;
                }

                .event-value {
                    font-size: .8rem;
                }
            }
        }
    }

    input, select {
        margin-top: 10px;
        width: 90%;
        padding: 15px 15px;
        border-radius: 25px;
        border: none;
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

button {
    cursor: pointer;
    padding: 5px 10px;
    outline: none;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    color: rgba($color: #000000, $alpha: .7);
    border: 1px solid rgba($color: #000000, $alpha: .3);
}

input, select, textarea {
    margin-top: 10px;
    width: 90%;
    padding: 10px 15px!important;
    border-radius: 25px;
    border: none;

    &:focus {
        outline: none;
    }
}

textarea {
    min-height: 180px;
    margin-bottom: 10px;
}

.file {
    cursor: pointer;
    margin-top: 5px;
    display: flex;
    align-items: center;
    opacity: .8;
    transition: .2s ease-in-out;

    &:hover {
        opacity: 1;
    }

    span {
        font-size: .8rem;
        font-weight: bold;
    }

    img {
        padding-left: 0px;
        padding-right: 0px;
    }
}
</style>