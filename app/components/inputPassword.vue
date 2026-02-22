<template>
  <div class="pass">
    <input :type="`${show ? 'text' : 'password'}`" v-bind="$attrs" :placeholder="placeholder" v-model="model">
    <div class="eye" @click="show = !show">
      <IconSvg :icon="show ? 'visibility' : 'no-visibility'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const model = defineModel<string>();

const props = withDefaults(defineProps<{
  modelValue: string,
  placeholder: string,
}>(),
  {
    placeholder: 'senha'
  }
)

const show = ref(false)

</script>

<style scoped lang="scss">
.pass {
  position: relative;

  .eye {
    cursor: pointer;
    position: absolute;
    top: 23px;
    right: 15px;
  }
}

input {
  margin-top: 15px;
  width: 100%;
  padding: 15px 15px;
  padding-right: 45px;
  border-radius: 25px;
  border: none;

  &.error {
    border: 1px solid red;
  }

  &:focus {
    outline: none;
  }
}
</style>