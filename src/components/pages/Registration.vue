<template>
    <!-- Hero -->
    <section class="relative overflow-hidden" style="background-color: #0f172a; min-height: 200px;">
        <div class="absolute inset-0 opacity-10 pointer-events-none"
            :style="{ backgroundImage: `url(${bgHome})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
        </div>
        <div class="relative z-10 flex items-center pt-24 pb-8">
            <div class="container mx-auto px-4">
                <h1 class="text-white text-2xl font-bold m-0 flex items-center gap-2">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Player Registration
                </h1>
                <p class="text-slate-400 text-sm mt-1 m-0">Fill in the form below to register as a MadCricketers
                    player.</p>
            </div>
        </div>
    </section>

    <!-- Form Body -->
    <section class="bg-slate-50 py-8">
        <div class="container mx-auto px-4 pb-10">
            <form @submit.prevent="submitForm" enctype="multipart/form-data" class="flex flex-col gap-6">

                <!-- ── Section: Profile Picture ── -->
                <div class="bg-white rounded-xl border border-slate-100 p-6">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Profile Picture <span class="text-red-500 text-sm font-normal ml-1">*</span>
                    </h2>

                    <!-- Upload area (no image yet) -->
                    <div v-if="!imageSrc"
                        class="border-2 border-dashed border-slate-200 hover:border-red-300 rounded-xl p-10 text-center transition-colors cursor-pointer"
                        @click="triggerFileInput">
                        <input type="file" @change="uploadImage" accept="image/*" class="hidden" ref="fileInput" />
                        <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <p class="text-sm font-semibold text-slate-700 m-0">Click to choose an image</p>
                        <p class="text-xs text-slate-400 mt-1 m-0">JPEG, PNG or WebP · Max 12 MB</p>
                    </div>

                    <!-- Cropper area -->
                    <div v-if="imageSrc">
                        <input type="file" @change="uploadImage" accept="image/*" class="hidden" ref="fileInput" />

                        <vue-cropper ref="cropperRef" :src="imageSrc" :aspect-ratio="1" :view-mode="2"
                            :background="false" :auto-crop-area="0.8" :drag-mode="'crop'" :guides="true" :center="true"
                            :highlight="true" :responsive="true" :restore="true" :check-cross-origin="false"
                            @ready="onReady" class="cropper-container" />

                        <!-- Cropper action buttons -->
                        <div class="flex flex-wrap gap-2 mt-4">
                            <button type="button" @click="cropImage"
                                class="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Crop Image
                            </button>
                            <button type="button" @click="rotateLeft"
                                class="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                ↺ Rotate Left
                            </button>
                            <button type="button" @click="rotateRight"
                                class="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                ↻ Rotate Right
                            </button>
                            <button type="button" @click="resetCrop"
                                class="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors">
                                Reset Crop
                            </button>
                            <button type="button" @click="triggerFileInput"
                                class="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors">
                                Change Image
                            </button>
                            <button type="button" @click="removeImage"
                                class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
                                Remove
                            </button>
                        </div>

                        <!-- Crop preview -->
                        <div v-if="croppedImageUrl"
                            class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4">
                            <img :src="croppedImageUrl" alt="Cropped Preview"
                                class="w-20 h-20 object-cover rounded-full border-2 border-emerald-300 flex-shrink-0" />
                            <div>
                                <p class="text-sm font-semibold text-emerald-700 m-0">
                                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor"
                                        stroke-width="2.5" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Image ready for upload
                                </p>
                                <p class="text-xs text-emerald-600 m-0 mt-0.5">
                                    {{ formatFileSize(croppedBlob?.size || 0) }} · 300 × 300 px
                                </p>
                            </div>
                        </div>
                    </div>

                    <span v-if="errors.image" class="text-red-500 text-xs mt-2 block">{{ errors.image[0] }}</span>
                    <p class="text-slate-400 text-xs mt-2 m-0">Square image recommended. Will be cropped to 300×300
                        px.</p>
                </div>

                <!-- ── Section: Personal Information ── -->
                <div class="bg-white rounded-xl border border-slate-100 p-6">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Personal Information
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <!-- Full Name -->
                        <div>
                            <label class="field-label">Full Name <span class="text-red-500">*</span></label>
                            <input v-model="form.full_name" type="text" required placeholder="e.g. Al-Amin Hossain"
                                :class="fieldClass(errors.full_name)" />
                            <span v-if="errors.full_name" class="field-error">{{ errors.full_name[0] }}</span>
                        </div>

                        <!-- Nickname -->
                        <div>
                            <label class="field-label">Nickname <span class="optional">(optional)</span></label>
                            <input v-model="form.nickname" type="text" placeholder="e.g. Rony"
                                :class="fieldClass(errors.nickname)" />
                            <span v-if="errors.nickname" class="field-error">{{ errors.nickname[0] }}</span>
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="field-label">Email <span class="text-red-500">*</span></label>
                            <input v-model="form.email" type="email" required placeholder="your@email.com"
                                :class="fieldClass(errors.email)" />
                            <span v-if="errors.email" class="field-error">{{ errors.email[0] }}</span>
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="field-label">Password <span class="text-red-500">*</span></label>
                            <input v-model="form.password" type="password" required placeholder="Choose a password"
                                :class="fieldClass(errors.password)" />
                            <span v-if="errors.password" class="field-error">{{ errors.password[0] }}</span>
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="field-label">Phone <span class="text-red-500">*</span></label>
                            <input v-model="form.phone" type="tel" required placeholder="+880 1700-000000"
                                :class="fieldClass(errors.phone)" />
                            <span v-if="errors.phone" class="field-error">{{ errors.phone[0] }}</span>
                        </div>

                        <!-- Gender -->
                        <div>
                            <label class="field-label">Gender <span class="optional">(optional)</span></label>
                            <select v-model="form.gender" :class="fieldClass(errors.gender)">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <span v-if="errors.gender" class="field-error">{{ errors.gender[0] }}</span>
                        </div>

                        <!-- Date of Birth -->
                        <div>
                            <label class="field-label">Date of Birth <span class="optional">(optional)</span></label>
                            <flat-pickr v-model="form.date_of_birth" :config="flatpickrConfig"
                                :class="fieldClass(errors.date_of_birth)" placeholder="Select date" />
                            <span v-if="errors.date_of_birth" class="field-error">{{ errors.date_of_birth[0] }}</span>
                        </div>

                        <!-- Blood Group -->
                        <div>
                            <label class="field-label">Blood Group <span class="optional">(optional)</span></label>
                            <select v-model="form.blood_group" :class="fieldClass(errors.blood_group)">
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                            <span v-if="errors.blood_group" class="field-error">{{ errors.blood_group[0] }}</span>
                        </div>

                        <!-- Religion -->
                        <div>
                            <label class="field-label">Religion <span class="optional">(optional)</span></label>
                            <select v-model="form.religion" :class="fieldClass(errors.religion)">
                                <option value="">Select Religion</option>
                                <option value="islam">Islam</option>
                                <option value="hinduism">Hinduism</option>
                                <option value="christianity">Christianity</option>
                                <option value="buddhism">Buddhism</option>
                                <option value="other">Other</option>
                            </select>
                            <span v-if="errors.religion" class="field-error">{{ errors.religion[0] }}</span>
                        </div>

                        <!-- Married Status -->
                        <div>
                            <label class="field-label">Marital Status <span class="optional">(optional)</span></label>
                            <select v-model="form.married_status" :class="fieldClass(errors.married_status)">
                                <option value="">Select Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                            </select>
                            <span v-if="errors.married_status" class="field-error">{{ errors.married_status[0]
                            }}</span>
                        </div>

                        <!-- National ID -->
                        <div>
                            <label class="field-label">National ID <span class="optional">(optional)</span></label>
                            <input v-model="form.national_id" type="text" placeholder="NID number"
                                :class="fieldClass(errors.national_id)" />
                            <span v-if="errors.national_id" class="field-error">{{ errors.national_id[0] }}</span>
                        </div>

                        <!-- Address (full width) -->
                        <div class="sm:col-span-2">
                            <label class="field-label">Address <span class="optional">(optional)</span></label>
                            <input v-model="form.address" type="text" placeholder="City, Country"
                                :class="fieldClass(errors.address)" />
                            <span v-if="errors.address" class="field-error">{{ errors.address[0] }}</span>
                        </div>

                    </div>
                </div>

                <!-- ── Section: Education ── -->
                <div class="bg-white rounded-xl border border-slate-100 p-6">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Education
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <!-- Education Batch -->
                        <div>
                            <label class="field-label">Education Batch <span class="optional">(optional)</span></label>
                            <input v-model="form.education_batch" type="text" placeholder="e.g., 2018-2022"
                                :class="fieldClass(errors.education_batch)" />
                            <span v-if="errors.education_batch" class="field-error">{{ errors.education_batch[0]
                            }}</span>
                        </div>

                        <!-- SSC Batch -->
                        <div>
                            <label class="field-label">SSC Batch <span class="optional">(optional)</span></label>
                            <input v-model="form.ssc_batch" type="text" placeholder="e.g., 2018"
                                :class="fieldClass(errors.ssc_batch)" />
                            <span v-if="errors.ssc_batch" class="field-error">{{ errors.ssc_batch[0] }}</span>
                        </div>

                    </div>
                </div>

                <!-- ── Section: Favourites ── -->
                <div class="bg-white rounded-xl border border-slate-100 p-6">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Favourites
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <div>
                            <label class="field-label">Favourite Cricket Country <span
                                    class="optional">(optional)</span></label>
                            <input v-model="form.favourite_cricket_country" type="text" placeholder="e.g., Bangladesh"
                                :class="fieldClass(errors.favourite_cricket_country)" />
                            <span v-if="errors.favourite_cricket_country" class="field-error">{{
                                errors.favourite_cricket_country[0] }}</span>
                        </div>

                        <div>
                            <label class="field-label">Favourite Football Country <span
                                    class="optional">(optional)</span></label>
                            <input v-model="form.favourite_football_country" type="text" placeholder="e.g., Brazil"
                                :class="fieldClass(errors.favourite_football_country)" />
                            <span v-if="errors.favourite_football_country" class="field-error">{{
                                errors.favourite_football_country[0] }}</span>
                        </div>

                        <div class="sm:col-span-2">
                            <label class="field-label">Favourite Football League Team <span
                                    class="optional">(optional)</span></label>
                            <input v-model="form.favourite_football_league_team" type="text"
                                placeholder="e.g., Barcelona"
                                :class="fieldClass(errors.favourite_football_league_team)" />
                            <span v-if="errors.favourite_football_league_team" class="field-error">{{
                                errors.favourite_football_league_team[0] }}</span>
                        </div>

                    </div>
                </div>

                <!-- ── Section: Cricket Details ── -->
                <div class="bg-white rounded-xl border border-slate-100 p-6">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Cricket Details
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <!-- Player Type (disabled) -->
                        <div>
                            <label class="field-label">Player Type</label>
                            <select v-model="form.player_type"
                                class="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                disabled>
                                <option value="registered">Registered</option>
                                <option value="guest">Guest</option>
                            </select>
                            <input type="hidden" name="player_type" v-model="form.player_type" />
                            <span v-if="errors.player_type" class="field-error">{{ errors.player_type[0] }}</span>
                            <p class="text-xs text-slate-400 mt-1 m-0">Automatically set to Guest</p>
                        </div>

                        <!-- Player Role -->
                        <div>
                            <label class="field-label">Player Role <span class="optional">(optional)</span></label>
                            <select v-model="form.player_role" :class="fieldClass(errors.player_role)">
                                <option value="">Select Role</option>
                                <option value="batsman">Batsman</option>
                                <option value="bowler">Bowler</option>
                                <option value="all-rounder">All Rounder</option>
                                <option value="wicketkeeper">Wicket Keeper</option>
                            </select>
                            <span v-if="errors.player_role" class="field-error">{{ errors.player_role[0] }}</span>
                        </div>

                        <!-- Batting Style -->
                        <div>
                            <label class="field-label">Batting Style <span class="optional">(optional)</span></label>
                            <select v-model="form.batting_style" :class="fieldClass(errors.batting_style)">
                                <option value="">Select Style</option>
                                <option value="right-handed">Right-handed</option>
                                <option value="left-handed">Left-handed</option>
                                <option value="switch hitter">Switch Hitter</option>
                            </select>
                            <span v-if="errors.batting_style" class="field-error">{{ errors.batting_style[0] }}</span>
                        </div>

                        <!-- Bowling Style -->
                        <div>
                            <label class="field-label">Bowling Style <span class="optional">(optional)</span></label>
                            <select v-model="form.bowling_style" :class="fieldClass(errors.bowling_style)">
                                <option value="">Select Style</option>
                                <option value="fast">Fast</option>
                                <option value="medium">Medium</option>
                                <option value="spin">Spin</option>
                                <option value="none">None</option>
                            </select>
                            <span v-if="errors.bowling_style" class="field-error">{{ errors.bowling_style[0] }}</span>
                        </div>

                    </div>
                </div>

                <!-- ── Section: Jersey & Kit ── -->
                <div class="bg-white rounded-xl border border-slate-100 p-6">
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Jersey &amp; Kit
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        <!-- Jersey Number -->
                        <div>
                            <label class="field-label">Jersey Number <span class="optional">(optional)</span></label>
                            <input v-model="form.jursey_number" type="text" placeholder="e.g., 10"
                                :class="fieldClass(errors.jursey_number)" />
                            <span v-if="errors.jursey_number" class="field-error">{{ errors.jursey_number[0] }}</span>
                        </div>

                        <!-- Jersey Name -->
                        <div>
                            <label class="field-label">Jersey Name <span class="optional">(optional)</span></label>
                            <input v-model="form.jursey_name" type="text" placeholder="e.g., Al-Amin"
                                :class="fieldClass(errors.jursey_name)" />
                            <span v-if="errors.jursey_name" class="field-error">{{ errors.jursey_name[0] }}</span>
                        </div>

                        <!-- Chest Measurement -->
                        <div>
                            <label class="field-label">Chest Measurement (inches) <span
                                    class="optional">(optional)</span></label>
                            <input v-model="form.chest_measurement" type="text" placeholder="e.g., 38.5"
                                :class="fieldClass(errors.chest_measurement)" />
                            <span v-if="errors.chest_measurement" class="field-error">{{
                                errors.chest_measurement[0] }}</span>
                        </div>

                        <!-- Jersey Size (radio) -->
                        <div>
                            <label class="field-label">
                                Jersey Size <span class="optional">(optional)</span>
                            </label>
                            <!-- <p class="text-xs text-slate-400 mt-0.5 mb-2 m-0">Select your preferred jersey size</p> -->
                            <div class="flex flex-wrap gap-2">
                                <label v-for="size in ['s', 'm', 'l', 'xl', '2xl', '3xl', '4xl']" :key="size"
                                    class="cursor-pointer">
                                    <input type="radio" :value="size" v-model="form.jursey_size" class="sr-only peer" />
                                    <span :class="[
                                        'inline-flex items-center justify-center rounded-lg border-2 font-bold text-xs transition-all duration-150 select-none',
                                        'min-w-[48px] px-3 py-2',
                                        form.jursey_size === size
                                            ? 'border-red-600 bg-red-600 text-white shadow-sm scale-[1.04]'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50'
                                    ]">
                                        {{ size.toUpperCase() }}
                                    </span>
                                </label>
                            </div>
                            <span v-if="errors.jursey_size" class="field-error">{{ errors.jursey_size[0] }}</span>
                        </div>

                    </div>
                </div>

                <!-- ── Submit ── -->
                <div class="flex items-center justify-end gap-4">
                    <p class="text-xs text-slate-400 m-0">
                        Fields marked <span class="text-red-500 font-semibold">*</span> are required.
                    </p>
                    <button type="submit" :disabled="submitting"
                        class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-7 py-3 rounded-xl transition-colors shadow-sm">
                        <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {{ submitting ? 'Submitting...' : 'Submit Registration' }}
                    </button>
                </div>

            </form>
        </div>
    </section>
</template>

<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useToast } from "vue-toastification"
import axios from 'axios'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { API_BASE_URL } from '../api/config'
import { useRouter } from 'vue-router'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

const toast = useToast()
const router = useRouter();

const flatpickrConfig = {
    enableTime: false,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    disableMobile: true,
    maxDate: new Date()
};

const form = reactive({
    full_name: '',
    nickname: '',
    email: '',
    phone: '',
    blood_group: '',
    password: '',
    gender: 'male',
    date_of_birth: '',
    religion: '',
    national_id: '',
    address: 'Rajshai, Bangladesh',
    player_type: 'guest',
    player_role: '',
    batting_style: '',
    bowling_style: '',
    jursey_number: '',
    jursey_name: '',
    jursey_size: '',
    chest_measurement: '',
    favourite_football_country: '',
    favourite_cricket_country: '',
    favourite_football_league_team: '',
    married_status: '',
    education_batch: '',
    ssc_batch: ''
})

const fileInput = ref(null)
const imageSrc = ref('')
const imageFile = ref(null)
const cropperRef = ref(null)
const croppedImageUrl = ref('')
const croppedBlob = ref(null)
const errors = reactive({})
const submitting = ref(false)

// Helper: consistent field class
const fieldClass = (fieldErrors) => [
    'w-full px-3 py-2.5 text-sm rounded-lg border bg-slate-50 text-slate-800 placeholder-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition',
    fieldErrors ? 'border-red-400' : 'border-slate-200'
]

const triggerFileInput = () => {
    fileInput.value.click()
}

// Cropper ready event
const onReady = () => {
    console.log('Cropper is ready')
    toast.info("Adjust the crop area, then click 'Crop Image'")
}

// Crop image function
const cropImage = () => {
    if (!cropperRef.value) {
        toast.error("Cropper not ready yet")
        return
    }

    try {
        // Get cropped canvas
        const canvas = cropperRef.value.getCroppedCanvas({
            width: 300,
            height: 300,
            fillColor: '#fff',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        })

        if (!canvas) {
            toast.error("Could not get canvas. Try adjusting the crop area.")
            return
        }

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                croppedBlob.value = blob

                // Create object URL for preview
                if (croppedImageUrl.value) {
                    URL.revokeObjectURL(croppedImageUrl.value)
                }
                croppedImageUrl.value = URL.createObjectURL(blob)

                toast.success("Image cropped successfully!")
                console.log('Cropped image size:', formatFileSize(blob.size))
            } else {
                toast.error("Failed to create image blob")
            }
        }, 'image/jpeg', 0.9)

    } catch (error) {
        console.error('Crop error:', error)
        toast.error("Error cropping image: " + error.message)
    }
}

// Rotate functions
const rotateLeft = () => {
    if (cropperRef.value) {
        cropperRef.value.rotate(-90)
    }
}

const rotateRight = () => {
    if (cropperRef.value) {
        cropperRef.value.rotate(90)
    }
}

// Reset crop
const resetCrop = () => {
    if (cropperRef.value) {
        cropperRef.value.reset()
        toast.info("Crop area reset")
    }
}

// Upload image
const uploadImage = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (12MB)
    if (file.size > 12 * 1024 * 1024) {
        toast.error("File size must be less than 12MB")
        resetFileInput()
        return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and WebP images are allowed")
        resetFileInput()
        return
    }

    // Reset states
    if (croppedImageUrl.value) {
        URL.revokeObjectURL(croppedImageUrl.value)
    }
    croppedImageUrl.value = ''
    croppedBlob.value = null

    // Read file
    const reader = new FileReader()
    reader.onload = (e) => {
        imageSrc.value = e.target.result
        imageFile.value = file
        toast.success("Image loaded. Adjust the crop area.")
    }
    reader.onerror = () => {
        toast.error("Error reading file")
        resetFileInput()
    }
    reader.readAsDataURL(file)

    resetFileInput()
}

const resetFileInput = () => {
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// Remove image
const removeImage = () => {
    if (croppedImageUrl.value) {
        URL.revokeObjectURL(croppedImageUrl.value)
    }
    imageSrc.value = ''
    imageFile.value = null
    croppedImageUrl.value = ''
    croppedBlob.value = null
    toast.info("Image removed")
}

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const resetForm = () => {
    Object.keys(form).forEach(key => {
        if (key !== 'player_type' && key !== 'address') {
            form[key] = ''
        }
    })

    removeImage()
    console.log('Form reset complete')
}

const submitForm = async () => {
    if (!imageFile.value) {
        toast.error("Please select a profile picture.")
        return
    }

    if (!croppedBlob.value) {
        toast.error("Please crop your image before submitting.")
        return
    }

    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = null)

    const formData = new FormData()

    // Add form data
    Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value.toString())
        }
    })

    // Add cropped image
    formData.append('image', croppedBlob.value, 'profile-picture.jpg')

    // Add original filename for reference
    formData.append('original_filename', imageFile.value.name)

    submitting.value = true

    try {
        const response = await axios.post(API_BASE_URL + '/registration', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
            timeout: 30000
        })

        resetForm()
        toast.success(response.data.message || "Player Registration successful")

        if (response.data.reg_uid) {
            router.push(`/registration-confirmation/${response.data.reg_uid}`)
        } else {
            router.push('/registration-confirmation/success')
        }

    } catch (err) {
        if (err.response?.status === 422) {
            Object.assign(errors, err.response.data.errors)
            toast.error("Please fix the highlighted errors")
        } else if (err.response?.status === 413) {
            toast.error("File too large. Please select a smaller image.")
        } else if (err.response?.status === 500) {
            toast.error("Server error. Please try again later.")
            console.error('Server Error:', err.response?.data)
        } else if (err.code === 'ECONNABORTED') {
            toast.error("Request timeout. Please try again.")
        } else {
            toast.error("Registration failed. Please check your connection and try again.")
            console.error('Error:', err.response?.data || err.message)
        }
    } finally {
        submitting.value = false
    }
}

// Clean up object URLs on unmount
onUnmounted(() => {
    if (croppedImageUrl.value) {
        URL.revokeObjectURL(croppedImageUrl.value)
    }
})

// Initialize on component mount
onMounted(() => {
    // You can set an initial image URL here if needed
    // imageSrc.value = 'path/to/default/image.jpg'
})
</script>

<style scoped>
/* Field label utility */
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.field-error {
    display: block;
    font-size: 0.75rem;
    color: #ef4444;
    margin-top: 0.25rem;
}

.optional {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
}

/* Cropper container */
:deep(.cropper-container) {
    width: 100%;
    height: 380px;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
}

/* Circular crop view */
:deep(.cropper-view-box),
:deep(.cropper-face) {
    border-radius: 50%;
}

:deep(.cropper-view-box) {
    outline: 2px solid #dc2626;
    outline-color: rgba(220, 38, 38, 0.75);
}

:deep(.cropper-line) {
    background-color: #dc2626;
}

:deep(.cropper-point) {
    background-color: #dc2626;
    width: 8px;
    height: 8px;
}

:deep(.cropper-point.point-se) {
    width: 12px;
    height: 12px;
}

@media (max-width: 640px) {
    :deep(.cropper-container) {
        height: 280px;
    }
}
</style>
