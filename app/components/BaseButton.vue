<template>
  <button :disabled="disabled" class="bold" @click="action">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>

  interface Props {
    action?: (payload: PointerEvent) => void
    disabled?: boolean
  }
  const { 
    action = () => {}, 
    disabled = false 
  } = defineProps<Props>()

</script>

<style lang="scss" scoped>
button {
    padding: 5px 8px;
    outline: none;
    border: none;
    border-radius: 50px;
    font-size: .9rem;
    display: flex;
    background: rgba(#7dbbd6, 1);
    transition: .2s ease-in-out;
    color: #fff;
    cursor: pointer;
    margin: 5px 0;
    opacity: .7;

    @media (max-width: 769px) {
        background: rgba(#7dbbd6, 1);
        opacity: 1;
    }

    &:hover {
        background: rgba(#7dbbd6, 1);
        opacity: 1;
    }
}
</style>