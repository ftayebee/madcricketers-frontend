<template>
  <main class="min-h-screen bg-slate-50 pt-24 pb-12">
    <section class="mx-auto max-w-6xl px-4">
      <div class="mb-6 flex flex-col gap-3 rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-4">
          <img :src="profile?.image" class="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/10" alt="Player profile" />
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.22em] text-red-300">Player profile</p>
            <h1 class="text-3xl font-black">{{ profile?.full_name || 'Player' }}</h1>
            <p class="text-sm text-slate-300">{{ profile?.phone || '-' }} · {{ profile?.email || '-' }}</p>
            <p class="mt-1 text-sm text-slate-300">{{ profile?.teams?.[0]?.name || 'No team assigned' }}</p>
          </div>
        </div>
        <button class="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10" @click="logout">
          Logout
        </button>
      </div>

      <div class="mb-6 overflow-x-auto">
        <div class="flex min-w-max gap-2">
          <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="rounded-3xl bg-white p-8 text-center shadow-sm">Loading player data...</div>
      <div v-else-if="error" class="rounded-3xl bg-red-50 p-6 font-semibold text-red-700">{{ error }}</div>

      <template v-else>
        <section v-if="activeTab === 'summary'" class="space-y-6">
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Matches" :value="summary.matches" />
            <StatCard label="Runs" :value="summary.runs" />
            <StatCard label="Highest" :value="summary.highest_score" />
            <StatCard label="Wickets" :value="summary.wickets" />
            <StatCard label="Average" :value="summary.average" />
            <StatCard label="Strike Rate" :value="summary.strike_rate" />
            <StatCard label="Economy" :value="summary.economy" />
            <StatCard label="Fielding" :value="`${summary.catches || 0} C / ${summary.runouts || 0} RO / ${summary.stumpings || 0} St`" />
          </div>
        </section>

        <section v-if="activeTab === 'matches'" class="grid gap-3">
          <div v-for="row in matches" :key="`${row.match_id}-${row.team}`" class="stat-row">
            <div>
              <p class="font-bold text-slate-900">{{ row.match_title || 'Match' }}</p>
              <p class="text-sm text-slate-500">vs {{ row.opponent || '-' }} · {{ formatDate(row.date) }}</p>
            </div>
            <div class="grid grid-cols-3 gap-3 text-right text-sm md:grid-cols-6">
              <Metric label="Runs" :value="`${row.runs} (${row.balls})`" />
              <Metric label="4s/6s" :value="`${row.fours}/${row.sixes}`" />
              <Metric label="Wkts" :value="row.wickets" />
              <Metric label="Overs" :value="row.overs" />
              <Metric label="RC" :value="row.runs_conceded" />
              <Metric label="Econ" :value="row.economy" />
            </div>
          </div>
          <EmptyState v-if="matches.length === 0" text="No match-wise stats yet." />
        </section>

        <section v-if="activeTab === 'tournaments'" class="grid gap-3">
          <div v-for="row in tournaments" :key="`${row.tournament_id}-${row.team}`" class="stat-row">
            <div>
              <p class="font-bold text-slate-900">{{ row.tournament || 'Tournament' }}</p>
              <p class="text-sm text-slate-500">{{ row.team || '-' }}</p>
            </div>
            <div class="grid grid-cols-3 gap-3 text-right text-sm md:grid-cols-6">
              <Metric label="Mat" :value="row.matches" />
              <Metric label="Runs" :value="row.runs" />
              <Metric label="Avg" :value="row.average" />
              <Metric label="SR" :value="row.strike_rate" />
              <Metric label="Wkts" :value="row.wickets" />
              <Metric label="Econ" :value="row.economy" />
            </div>
          </div>
          <EmptyState v-if="tournaments.length === 0" text="No tournament stats yet." />
        </section>

        <section v-if="activeTab === 'profile'" class="rounded-3xl bg-white p-5 shadow-sm">
          <form class="grid gap-4 md:grid-cols-2" @submit.prevent="saveProfile">
            <InputField v-model="form.full_name" label="Full name" />
            <InputField v-model="form.phone" label="Phone" />
            <InputField v-model="form.email" label="Email" type="email" />
            <InputField v-model="form.date_of_birth" label="Date of birth" type="date" />
            <InputField v-model="form.address" label="Address" class="md:col-span-2" />
            <SelectField v-model="form.player_role" label="Role" :options="['batsman','bowler','all-rounder','wicketkeeper']" />
            <SelectField v-model="form.batting_style" label="Batting style" :options="['right-handed','left-handed','switch hitter']" />
            <SelectField v-model="form.bowling_style" label="Bowling style" :options="['fast','medium','spin','none']" />
            <SelectField v-model="form.jursey_size" label="Jersey size" :options="['s','m','l','xl','2xl','3xl']" />
            <InputField v-model="form.jursey_number" label="Jersey number" />
            <InputField v-model="form.jursey_name" label="Jersey name" />
            <InputField v-model="form.chest_measurement" label="Chest measurement" />
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-700">Profile image</label>
              <input class="field" type="file" accept="image/png,image/jpeg" @change="onImageChange" />
            </div>
            <div class="md:col-span-2">
              <button class="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save Profile' }}
              </button>
            </div>
          </form>
        </section>
      </template>
    </section>
  </main>
</template>

<script setup>
import { computed, h, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  clearPlayerSession,
  fetchPlayerMatchStats,
  fetchPlayerProfile,
  fetchPlayerStatsSummary,
  fetchPlayerTournamentStats,
  playerLogout,
  updatePlayerProfile,
} from '../api/playerAuth';

const route = useRoute();
const router = useRouter();
const tabs = [
  { key: 'summary', label: 'Summary' },
  { key: 'matches', label: 'Matches' },
  { key: 'tournaments', label: 'Tournaments' },
  { key: 'profile', label: 'Edit Profile' },
];
const activeTab = ref(route.meta.tab || 'summary');
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const profile = ref(null);
const summary = ref({});
const matches = ref([]);
const tournaments = ref([]);
const imageFile = ref(null);
const form = reactive({});

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const [profileRes, summaryRes, matchesRes, tournamentsRes] = await Promise.all([
      fetchPlayerProfile(),
      fetchPlayerStatsSummary(),
      fetchPlayerMatchStats(),
      fetchPlayerTournamentStats(),
    ]);
    profile.value = profileRes.data;
    summary.value = summaryRes.data || {};
    matches.value = matchesRes.data || [];
    tournaments.value = tournamentsRes.data || [];
    Object.assign(form, profile.value);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load player profile.';
    if (err.response?.status === 401) {
      clearPlayerSession();
      router.push('/player-login');
    }
  } finally {
    loading.value = false;
  }
};

const onImageChange = (event) => {
  imageFile.value = event.target.files?.[0] || null;
};

const saveProfile = async () => {
  saving.value = true;
  const payload = new FormData();
  Object.entries(form).forEach(([key, value]) => {
    if (['teams', 'safe_update_fields', 'image', 'id', 'user_id', 'status'].includes(key)) return;
    if (value !== null && value !== undefined) payload.append(key, value);
  });
  if (imageFile.value) payload.append('profile_image', imageFile.value);

  try {
    const response = await updatePlayerProfile(payload);
    profile.value = response.data;
    Object.assign(form, response.data);
  } catch (err) {
    error.value = err.response?.data?.message || 'Profile update failed.';
  } finally {
    saving.value = false;
  }
};

const logout = async () => {
  await playerLogout();
  router.push('/');
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-';

const StatCard = (_, { attrs }) => h('div', { class: 'rounded-3xl bg-white p-5 shadow-sm' }, [
  h('p', { class: 'text-sm font-semibold text-slate-500' }, attrs.label),
  h('p', { class: 'mt-2 text-3xl font-black text-slate-950' }, attrs.value ?? 0),
]);
const Metric = (_, { attrs }) => h('div', [h('p', { class: 'text-xs text-slate-400' }, attrs.label), h('p', { class: 'font-bold text-slate-900' }, attrs.value ?? 0)]);
const EmptyState = (_, { attrs }) => h('div', { class: 'rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm' }, attrs.text);
const InputField = {
  props: ['modelValue', 'label', 'type'],
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () => h('div', attrs, [
      h('label', { class: 'mb-1 block text-sm font-semibold text-slate-700' }, props.label),
      h('input', { class: 'field', type: props.type || 'text', value: props.modelValue || '', onInput: e => emit('update:modelValue', e.target.value) }),
    ]);
  },
};
const SelectField = {
  props: ['modelValue', 'label', 'options'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', [
      h('label', { class: 'mb-1 block text-sm font-semibold text-slate-700' }, props.label),
      h('select', { class: 'field', value: props.modelValue || '', onChange: e => emit('update:modelValue', e.target.value) }, [
        h('option', { value: '' }, 'Select'),
        ...props.options.map(option => h('option', { value: option }, option)),
      ]),
    ]);
  },
};

onMounted(load);
</script>

<style scoped>
.tab-btn {
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  padding: 10px 16px;
  font-weight: 800;
}
.tab-btn.active {
  background: #dc2626;
  border-color: #dc2626;
  color: #fff;
}
.stat-row {
  display: grid;
  gap: 16px;
  border-radius: 24px;
  background: #fff;
  padding: 18px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
}
@media (min-width: 768px) {
  .stat-row {
    grid-template-columns: 1.2fr 2fr;
    align-items: center;
  }
}
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
