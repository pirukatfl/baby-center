<template>
  <div class="input-file">
    <IconSvg class="icon" v-if="!model || model.length === 0" icon="image-upload" size="80" />
    <div class="image-preview" v-if="model && model.length > 0">
      <NuxtImg v-for="(img, index) in model" :key="index" :src="img" width="100" height="100" draggable="false" />
    </div>
    <input class="hide" type="file" :multiple="true" ref="inputFile" @change="fileUpload" placeholder="envie a imagem do novo evento">
    <button @click="triggerUpload">Selecione suas imagens</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emits = defineEmits(['change-image', 'url-image'])

const inputFile = ref(null)
const model = defineModel<string[]>({ default: () => [] })

async function fileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  
  if (model.value && model.value.length) {
    model.value.forEach(url => URL.revokeObjectURL(url as string))
  }
  
  model.value = files.map(file => URL.createObjectURL(file))
  emits('change-image', files)
  emits('url-image', model.value)
}

function triggerUpload() {
  if (inputFile.value) {
    (inputFile.value as HTMLInputElement).click()
  }
}
</script>

<style lang="scss" scoped>
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

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
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
  object-fit: cover;
}
</style>