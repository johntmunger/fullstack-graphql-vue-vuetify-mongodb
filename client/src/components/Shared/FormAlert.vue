<template>
    <v-alert type="error" :value="true" transition="scale-transition" origin="center center" dismissible>
        <h3>{{ message }}</h3>
    </v-alert>
</template>

<script>
export default {
    props: ['message']
}
</script>