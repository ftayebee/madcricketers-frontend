<template>
  <main class="min-h-screen bg-slate-50 pt-24 pb-12">
    <section class="mx-auto max-w-md px-4">
      <div class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
        <div class="mb-6 text-center">
          <p class="text-xs font-bold uppercase tracking-[0.24em] text-red-600">Player access</p>
          <h1 class="mt-2 text-3xl font-black text-slate-900">Login to your profile</h1>
          <p class="mt-2 text-sm text-slate-500">Use your phone, email, username, or player ID.</p>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">Phone / Email / Player ID</label>
            <input v-model.trim="login" class="field" autocomplete="username" required placeholder="017xxxxxxxx or name@email.com" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input v-model="password" class="field" type="password" autocomplete="current-password" required placeholder="Your password" />
          </div>

          <div v-if="error" class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {{ error }}
          </div>

          <button class="w-full rounded-2xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Player Login' }}
          </button>
        </form>

        <div class="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          Admin users should use
          <a class="font-bold text-red-600" href="https://app.madcricketers.com/login">app.madcricketers.com/login</a>.
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { playerLogin } from '../api/playerAuth';

const router = useRouter();
const route = useRoute();
const login = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';
  loading.value = true;
  try {
    await playerLogin(login.value, password.value);
    router.push(route.query.redirect?.toString() || '/player-dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Player login failed.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.field {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 12px 14px;
  outline: none;
}

.field:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}
</style>
