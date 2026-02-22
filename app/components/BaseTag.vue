<template>
  <div :class="['tag', { 'active': isActive }]" @click="emit('clicked', category.id)">
    {{ categoriesMapper[category.name] }}
  </div>
</template>

<script lang="ts" setup>
interface Category {
  id: number | string;
  name: string;
}
const props = defineProps<{
  category: Category,
  isActive: {
    type: boolean,
    default: false,
  }
}>()
const emit = defineEmits(['clicked'])

const categoriesMapper = {
    exam: 'Exame',
    consultation: 'Consulta',
    recipe: 'Receita',
    daily: 'Evento do dia',
    note: 'Nota de compra',
    all: 'Todos',
}
</script>

<style lang="scss" scoped>
.tag {
  padding: 5px 8px;
  margin: 3px;
  border-radius: 16px;
  border: 1px solid rgba($color: #535252, $alpha: .5);
  cursor: pointer;
  transition: .2s ease-in-out;

  &:hover {
    color: white;
    border: 1px solid rgba($color: #535252, $alpha: 1);
    background-color: #535252;
  }

  &.active {
    color: white;
    border: 1px solid rgba($color: #535252, $alpha: 1);
    background-color: #4f7d85;
  }
}
</style>