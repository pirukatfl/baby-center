<template>
  <div class="container-layout">
    <slot />
    <nav>
      <!-- <div class="logo">
        <NuxtImg src="images/logo.png" :width="80" :height="80" draggable="false" />
      </div> -->
      <ul>
        <li><NuxtLink to="/"><IconSvg :icon="'edit'" /><span>Meus Bebês</span></NuxtLink></li>
        <li><NuxtLink to="/relatorios"><IconSvg :icon="'report'" /><span>Relatórios</span></NuxtLink></li>
        <li @click="logout"><IconSvg :icon="'door-out'" /><span>Sair</span></li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
function logout() {
  localStorage.removeItem('family_id')
  location.href = '/login'
}
</script>

<style lang="scss" scoped>
.container-layout {
  display: flex;
  flex-direction: column;
  justify-content: baseline;
  width: 100dvw;

  .logo {
    margin: 10px 0;
    width: 70px;
    height: 70px;
    margin-right: auto;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 100%;
    box-shadow: 0px 0px 5px 2px rgba(#000, .2);
  }

  nav {
    background-color: #f4f4f4;
    height: 60px;
    width: 100dvw;
    display: flex;
    box-shadow: 0px 0px 5px 2px rgba(#000, .2);
    position: fixed;
    bottom: 0;

    ul {
      display: flex;
      justify-content: center;
      width: 100dvw;
      li {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 5px 10px;
        text-align: left;
        transition: .2s ease-in-out;

        a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: unset;
        }

        &:hover {
          background-color: #c5e5f3;
        }

        &.active {
          background-color: #c5e5f3;
        }
      }
    }
  }
}
</style>