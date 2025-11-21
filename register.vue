<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <main>
        <div class="container">
          <h1 style="margin-bottom: 1rem; font-weight: bolder; font-size: 2rem;">Aplication.id</h1>
          <p style="margin-bottom: 2rem; line-height: 1.65; font-weight: 400;">
            Daftar Sekarang dan rasakan fitur fitur menyenangkan dari
            <span style="font-weight: bold; color: skyblue;">Application.id</span>
          </p>

          <form @submit.prevent="registerUser">
            <ion-item class="ion-margin-bottom">
              <ion-label position="stacked">Nama (Username)</ion-label>
              <ion-input
                type="text"
                placeholder="namakamu"
                v-model="user_name"
                required
              ></ion-input>
            </ion-item>

            <ion-item class="ion-margin-bottom">
              <ion-label position="stacked">Email</ion-label>
              <ion-input
                type="email"
                placeholder="emailkamu@contoh.com"
                v-model="user_email"
                required
              ></ion-input>
            </ion-item>

            <ion-item class="ion-margin-bottom">
              <ion-label position="stacked">Password</ion-label>
              <ion-input
                type="password"
                v-model="user_password"
                required
              ></ion-input>
            </ion-item>

            <ion-button 
              expand="block" 
              type="submit" 
              :disabled="isLoading"
              class="ion-margin-top"
            >
              {{ isLoading ? 'Memproses...' : 'Daftar' }}
            </ion-button>

            <p class="ion-text-center ion-margin-top">
              Sudah Punya Akun?
              <router-link to="/login" style="color: skyblue; text-decoration: none; font-weight: bold;">
                Masuk
              </router-link>
            </p>
          </form>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  useIonRouter,
} from '@ionic/vue';
import { ref } from 'vue';
import axios from 'axios';

const ionRouter = useIonRouter();

// Status Loading
const isLoading = ref(false);

// Variabel untuk data input
const user_name = ref('');
const user_email = ref('');
const user_password = ref('');

// Fungsi kirim data register ke backend
const registerUser = async () => {
  if (!user_name.value || !user_email.value || !user_password.value) {
    alert('Mohon lengkapi semua data!');
    return;
  }

  isLoading.value = true; // Set loading true
  
  //menghub kan frontend ke backend
  try {                               //almt API
    const response = await axios.post('http://localhost:3000/register', {
      user_name: user_name.value,
      user_email: user_email.value,
      user_password: user_password.value,
    });

    console.log(response.data);
    
    // Notifikasi Berhasil
    alert('Registrasi berhasil!');
    
    // Navigasi
    ionRouter.push('/login');
    
  } catch (error: any) {
    console.error('Error register:', error);
    
    let errorMessage = 'Terjadi kesalahan saat registrasi!';
    
    // Cek pesan error dari backend (khusus untuk kode 400 Bad Request)
    if (error.response && error.response.status === 400) {
      // Ambil pesan error dari backend jika tersedia (misalnya: 'Username sudah digunakan')
      errorMessage = error.response.data.message || 'Data yang Anda masukkan tidak valid.';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Gagal terhubung ke server API. Periksa koneksi Anda.';
    }

    // Notifikasi Gagal
    alert(errorMessage);
    
  } finally {
    isLoading.value = false; // Set loading false
  }
};
</script>

<style scoped>
/* Pertahankan styling utama, tetapi pastikan tidak bertentangan dengan komponen Ionic */
ion-content {
    --padding-top: 2.5rem;
    --padding-bottom: 2.5rem;
}
main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;
}
.container {
    max-width: 500px;
    width: 100%;
    border-radius: 20px;
    box-shadow: var(--ion-box-shadow);
    padding: 3rem; /* Sesuaikan padding */
    background: var(--ion-background-color);
}
/* Menghapus semua styling input dan form yang bertentangan dengan Ion-item/Ion-input */
form ion-item {
    --background: var(--ion-item-background, var(--ion-background-color));
    --border-radius: 5px;
    --border-color: var(--ion-color-medium-tint);
    --border-width: 1px;
    --inner-border-width: 0; /* Hapus border internal Ionic */
}
ion-input {
    --padding-start: 0;
}
</style>