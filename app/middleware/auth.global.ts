
export default defineNuxtRouteMiddleware(async (to, from) => {

  const familyId = localStorage.getItem('family_id')

  if (!familyId && to.path === '/confirm') return
  if (!familyId && to.path !== '/login') {
    return navigateTo('/login')
  }
})