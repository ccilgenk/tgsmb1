<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>
       
      <ion-button @click="() => router.push('/tabs/create')">Tambah</ion-button>
      
      <CardComponents         
        v-for="post in posts"
        :key="post.id"
        :id="post.postId"
        :userId="post.id"
        :judul="post.judul"
        :deskripsi="post.deskripsi"
      >
        <slot>
          <ion-button fill="clear" color="success" @click="router.push(`/tabs/edit/${post.id}`)">Edit</ion-button>
          <ion-button fill="clear" color="danger" @click="hapusPost(post.id)">Hapus</ion-button>
        </slot>
      </CardComponents>
      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent } from '@ionic/vue';
import CardComponents from '../components/cardcomponent.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter(); 
const posts = ref<any[]>([]);

// 🔹 Fungsi untuk mengambil data post dengan token
const getPosts = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token tidak ditemukan! Silakan login ulang.');
      return;
    }

    const response = await axios.get('http://localhost:3000/posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    posts.value = response.data;
    console.log('✅ Data posts:', response.data);

  } catch (error: any) {
    console.error('❌ Gagal ambil data:', error);
    alert(error.response?.data?.message || 'Gagal mengambil data.');
  }
};

// 🔹 Fungsi untuk hapus post dengan token
const hapusPost = async (id: number) => {
  if (!confirm("Yakin mau hapus data ini?")) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token tidak ditemukan! Silakan login ulang.');
      return;
    }

    await axios.delete(`http://localhost:3000/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    posts.value = posts.value.filter(p => p.id !== id);
    console.log("🗑️ Data berhasil dihapus:", id);

  } catch (error: any) {
    console.error("Gagal hapus:", error);
    alert(error.response?.data?.message || "Gagal menghapus data.");
  }
};

// 🔹 Ambil data saat halaman dimuat
onMounted(() => {
  getPosts();
});
</script>
