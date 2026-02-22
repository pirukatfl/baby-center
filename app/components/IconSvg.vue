<template>
    <NuxtImg :class="{ 'no-hover': noHover }" :src="`icons/${props.icon}.svg`" :width="props.size" :height="props.size" draggable="false" />
</template>
<script setup lang="ts">
    const props = defineProps({
        icon: {
            type: String,
            default: 'visibility',
        },
        size: {
            type: String,
            default: '30'
        },
        noHover: {
            type: Boolean,
            default: false,
        },
    })
</script>
<style lang="scss" scoped>
    img {
        padding: 5px;
        border-radius: 8px;
        transition: ease-in-out .2s;

        &:hover {
            background-color: #d1ecff;
            cursor: pointer;
        }
    }

    .no-hover {
        &:hover {
            background-color: transparent!important;
        }
    }
</style>