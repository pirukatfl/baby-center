<template>
  <div class="input-file">
    <IconSvg class="icon" v-if="!model" icon="image-upload" size="80" />
    <NuxtImg v-if="model" :src="model" width="200" height="200" draggable="false" />
    <input class="hide" type="file" :multiple="false" ref="inputFile" @change="fileUpload" placeholder="envie a imagem do novo eveno">
    <button @click="triggerUpload">Selecione sua imagem</button>
  </div>
</template>

<script lang="ts" setup>

const emits = defineEmits(['change-image', 'url-image'])

const inputFile = ref(null)
const model = defineModel<String>()

async function fileUpload(event) {
  const file = event.target.files[0]
  model.value = URL.createObjectURL(file)
  emits('change-image', event.target.files[0])
  emits('url-image', model.value)
}

function triggerUpload() {
  inputFile.value.click()
}
</script>

<style lang="scss", scoped>

.hide {
  display: none;
}
.input-file {
  min-height: 200px;
  background-color: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .icon {
    margin-top: 35px;
  }
}

button {
    cursor: pointer;
    margin-top: 10px;
    padding: 10px 15px;
    outline: none;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    display: flex;
    border: 1px solid rgba($color: #000000, $alpha: .3);
}

img {
  border-radius: 10px;
}
</style>