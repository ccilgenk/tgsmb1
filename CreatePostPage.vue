<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tambah Post</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input 
            label="Post ID" 
            v-model="postId" 
            placeholder="Enter Post ID"
            required
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input 
            label="Judul" 
            v-model="judul" 
            placeholder="Enter Judul"
            required
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input 
            label="Deskripsi" 
            v-model="deskripsi" 
            placeholder="Enter Deskripsi"
            required
          ></ion-input>
        </ion-item>
        
        <div class="ion-padding">
          <ion-button expand="block" @click="submitForm" :disabled="loading">
            {{ loading ? 'Menyimpan...' : 'Simpan Data' }}
          </ion-button>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonList, IonItem } from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);
const postId = ref('');
const judul = ref('');
const deskripsi = ref('');

const submitForm = async () => {
  if (!postId.value || !judul.value || !deskripsi.value) {
    alert('Semua field harus diisi!');
    return;
  }

  loading.value = true;

  try {
    // 🔑 Ambil token dari localStorage (pastikan sudah diset saat login)
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token tidak ditemukan! Silakan login terlebih dahulu.');
      loading.value = false;
      return;
    }

    // 🔥 Kirim data beserta token di header Authorization
    const response = await axios.post(
      'http://localhost:3000/posts',
      {
        postId: postId.value,
        judul: judul.value,
        deskripsi: deskripsi.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Response:', response.data);
    alert('Data berhasil disimpan!');
    router.push('/tabs/tab1');

  } catch (error: any) {
    console.error('Error:', error);
    alert(`Gagal menyimpan data: ${error.response?.data?.message || error.message}`);
  } finally {
    loading.value = false;
  }
};
</script>
