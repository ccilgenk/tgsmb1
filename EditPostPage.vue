<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="text-align: center;">Edit Data Post</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <main v-if="!loading">
        <ion-item>
          <ion-input label="Post ID" label-placement="floating" v-model="postId"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Judul" label-placement="floating" v-model="judul"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Deskripsi" label-placement="floating" v-model="deskripsi"></ion-input>
        </ion-item>

        <ion-button expand="block" @click="submitForm()" :disabled="saving">
          {{ saving ? 'Menyimpan...' : 'Edit Data' }}
        </ion-button>
      </main>

      <div v-else style="text-align:center; margin-top: 2rem;">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Memuat data...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, 
  IonContent, IonItem, IonInput, IonButton, IonSpinner 
} from '@ionic/vue';

const router = useRouter(); 
const route = useRoute(); 

const postId = ref(''); 
const judul = ref(''); 
const deskripsi = ref(''); 
const loading = ref(true);
const saving = ref(false);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token tidak ditemukan! Silakan login ulang.');
      router.push('/login');
      return;
    }

    const response = await axios.get(`http://localhost:3000/posts/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const post: any = response.data;
    postId.value = post.postId;  
    judul.value = post.judul;
    deskripsi.value = post.deskripsi;

  } catch (error: any) {
    console.error('Gagal memuat data:', error);
    alert(error.response?.data?.message || 'Gagal memuat data dari server.');
  } finally {
    loading.value = false;
  }
});

const submitForm = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Token tidak ditemukan! Silakan login ulang.');
    router.push('/login');
    return;
  }

  saving.value = true;

  try {
    const postData = {
      postId: postId.value,
      judul: judul.value,
      deskripsi: deskripsi.value
    };

    const response = await axios.put(
      `http://localhost:3000/posts/${route.params.id}`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("✅ Data berhasil diupdate:", response.data);
    alert("Data berhasil diperbarui!");
    router.push('/tabs/tab1');
  } catch (err: any) {
    console.error("❌ Gagal update:", err);
    alert(err.response?.data?.message || "Gagal memperbarui data.");
  } finally {
    saving.value = false;
  }
};
</script>
  