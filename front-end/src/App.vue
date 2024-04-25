<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { css } from '../styled-system/css';

</script>

<template>
  <header :class="css({
    height: '10dvh',
    // backgroundColor: '#003566',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderBottom: '0.1rem solid #051014',
  })">
    <div :class="css({
      width: '100%',
      height: '100%',
    })">
      <nav :class="css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingX: '8rem',
        height: '100%',
        width: '100%',
        fontSize: '1.15rem',
        fontWeight: 'bold'
      })">
        <RouterLink to="/">
          <h1>
            LogiScrap
          </h1>
        </RouterLink>

        <div :class="css({
          display: 'flex',
          gap: '2rem',
        })">
          <RouterLink to="/">Accueil</RouterLink>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped></style>
