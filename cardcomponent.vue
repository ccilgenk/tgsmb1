<template>
    <div class="card">
        <header class="card-header">
            <h1>User Id : {{userId }}</h1>
            <h1>Post Id : {{id}}</h1>
        </header>
        <div class="card-content">
            <p>{{judul}}</p>
            <p>{{deskripsi}}</p>
            <slot>

            </slot>
            
        </div>
        <ion-card>
            
        </ion-card>
    </div>  
</template>

<script setup lang="ts">
defineProps({
  judul: String,
  deskripsi: String,
  id: Number,
  userId: Number ,
});

</script>
<style>
.card {
    display: flex;
    border: 2px solid #ff0000;
    flex-direction: column;
    border-radius: 10px;
}

.card-content {
    padding: 3rem   ;
}
</style>