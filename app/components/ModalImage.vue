<template>
    <Teleport to="body">
        <div v-if="isOpenImage" class="overflow-body">
          <div class="container">
                <div class="modal">
                    <div class="header">
                        <div>Imagem do evento: <span>{{ eventTitle }}</span> 
                            <span v-if="imagePaths.length > 1" style="margin-left: 10px;">({{ currentIndex + 1 }}/{{ imagePaths.length }})</span>
                        </div>
                        <IconSvg icon="cancel" @click="$emit('close')" />
                        <div class="action-rotate">
                          <IconSvg icon="rotate-left" @click="rotate('left')" />
                          <IconSvg icon="rotate-reset" @click="rotate('default')" />
                          <IconSvg icon="rotate-right" @click="rotate('right')" />
                        </div>
                        <div class="action-zoom">
                          <IconSvg icon="zoom-out" @click="zoom('out')" />
                          <span class="zoom-percent">{{ Math.round(scale * 100) }}%</span>
                          <IconSvg icon="zoom-in" @click="zoom('in')" />
                        </div>
                    </div>
                    <div class="body">
                      <div class="carousel-btn prev" v-if="imagePaths.length > 1" @click="prevImage">
                        <span>&#10094;</span>
                      </div>
                      
                      <NuxtImg
                        class="image-opened"
                        v-if="imagePaths.length > 0"
                        :src="imagePaths[currentIndex]"
                        :style="{ transform: `rotate(${rotation}deg) scale(${scale})` }"
                      />

                      <div class="carousel-btn next" v-if="imagePaths.length > 1" @click="nextImage">
                        <span>&#10095;</span>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
    import { ref, watch } from 'vue'

    const props = defineProps({
        isOpenImage: {
            type: Boolean,
        },
        imagePaths: {
            type: Array as () => string[],
            default: () => []
        },
        eventTitle: {
            type: String,
        },
    })

    const rotation = ref(0)
    const scale = ref(1)
    const currentIndex = ref(0)

    watch(() => props.isOpenImage, (newVal) => {
        if (newVal) {
            currentIndex.value = 0
            rotation.value = 0
            scale.value = 1
        }
    })

    function prevImage() {
        if (currentIndex.value > 0) {
            currentIndex.value--
        } else {
            currentIndex.value = props.imagePaths.length - 1
        }
        rotation.value = 0
        scale.value = 1
    }

    function nextImage() {
        if (currentIndex.value < props.imagePaths.length - 1) {
            currentIndex.value++
        } else {
            currentIndex.value = 0
        }
        rotation.value = 0
        scale.value = 1
    }

    function zoom(type: string) {
      if (type === 'in') {
        if (scale.value < 3) scale.value += 0.2
      } else if (type === 'out') {
        if (scale.value > 0.5) scale.value -= 0.2
      } else {
        scale.value = 1
      }
    }
    function rotate(direction: string) {
      scale.value = 1
      if (direction === 'right') {
        rotation.value += 90
      } else if (direction === 'left') {
        rotation.value -= 90
      } else {
        rotation.value = 0
      }
    }

    const emit = defineEmits([
        'close',
    ])
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
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    .modal {
        border-radius: 24px;
        width: 98dvw;
        height: 98dvh;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f4f4f4;

        .header {
            position: relative;
            padding: 15px;
            border-radius: 24px 24px 0 0;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #ffffff;

            span {
              font-weight: bold;
            }

            .action-rotate {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: absolute;
              content: '';
              right: 10px;
              bottom: -50px;
              background-color: rgba($color: #fff, $alpha: .4);
              border-radius: 10px;
              transition: .2s ease-in-out;
              z-index: 998;

              img {
                margin: 5px;
                overflow: hidden;
              }

              &:hover {
                background-color: rgba($color: #fff, $alpha: 1);
              }
            }

            .action-zoom {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: absolute;
              content: '';
              left: 10px;
              bottom: -50px;
              background-color: rgba($color: #fff, $alpha: .4);
              border-radius: 10px;
              transition: .2s ease-in-out;
              z-index: 998;

              .zoom-percent {
                font-size: .9rem;
              }

              img {
                margin: 5px;
                overflow: hidden;
              }

              &:hover {
                background-color: rgba($color: #fff, $alpha: 1);
              }
            }
        }

        .body {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 5px!important;
          position: relative;
          
          .carousel-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(255, 255, 255, 0.7);
            color: black;
            padding: 15px 20px;
            cursor: pointer;
            z-index: 1000;
            border-radius: 50%;
            font-size: 1.5rem;
            user-select: none;
            transition: background-color 0.2s;

            &:hover {
              background-color: rgba(255, 255, 255, 1);
            }

            &.prev {
              left: 20px;
            }

            &.next {
              right: 20px;
            }
          }

          .image-opened {
              max-width: 100%;
              max-height: 100%;

          }
        }

    }
}

.close {
  cursor: pointer;
}
</style>