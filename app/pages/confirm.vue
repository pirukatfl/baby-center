<template>
  <div>
    
  </div>
</template>

<script lang="ts" setup>

const supabase = useSupabaseClient()
const user = useSupabaseUser()

watch(user, async() => {
    if (user.value) {
        await getFamilyId()
        await navigateTo('/')
    }
}, { immediate: true })

async function getFamilyId() {
    const user = useSupabaseUser()

    if (!user.value) return

    const { data, error } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.value.sub)
        .single()

    if (!error && data) {
        localStorage.setItem('family_id', data.family_id)
    }
}
</script>

<style>

</style>