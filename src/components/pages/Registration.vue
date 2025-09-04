<template>
    <section id="home" class="bg-home" :style="{ backgroundImage: `url(${bgHome})` }">
        <div class="flex items-center justify-center py-8" style="padding-top: 7rem;">
            <div class="container mx-auto px-4 pt-12">
                <div class="w-full text-center">
                    <h2 class="mb-6 text-white text-3xl font-semibold">Player Registration</h2>
                    <p class="text-white text-lg">Please fill in the form below to register as a player.</p>
                </div>
            </div>
        </div>
    </section>

    <section>
        <div class="container mx-auto px-4 pb-20">
            <div class="bg-white p-8 rounded shadow mx-auto mt-4">
                <form @submit.prevent="submitForm" enctype="multipart/form-data">
                    <!-- Personal Information -->
                    <div>
                        <label class="block font-medium mb-2">Profile Picture</label>
                        <file-pond name="image" ref="pond"
                            label-idle="Drag & Drop your profile image or <span class='filepond--label-action'>Browse</span>"
                            allow-multiple="false" accepted-file-types="image/jpeg, image/png, image/webp"
                            max-file-size="2MB" :files="profileImageFile" @init="handleFilePondInit"
                            @addfile="handleFilePondAddFile" @removefile="handleFilePondRemoveFile" />
                        <span v-if="errors.image" class="text-red-500 text-sm mt-1">{{ errors.image[0] }}</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-medium mb-1">Full Name *</label>
                            <input v-model="form.full_name" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                            <span v-if="errors.full_name" class="text-red-500 text-sm mt-1">{{ errors.full_name[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Nickname</label>
                            <input v-model="form.nickname" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" />
                            <span v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Email *</label>
                            <input v-model="form.email" type="email"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                            <span v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Password *</label>
                            <input v-model="form.password" type="password"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                            <span v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Phone *</label>
                            <input v-model="form.phone" type="tel"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                            <span v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Blood Group</label>
                            <select v-model="form.blood_group"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring">
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
                            <span v-if="errors.blood_group" class="text-red-500 text-sm mt-1">{{ errors.blood_group[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Gender</label>
                            <select v-model="form.gender"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <span v-if="errors.gender" class="text-red-500 text-sm mt-1">{{ errors.gender[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Date of Birth</label>
                            <flat-pickr v-model="form.date_of_birth" :config="flatpickrConfig"></flat-pickr>
                            <span v-if="errors.date_of_birth" class="text-red-500 text-sm mt-1">{{ errors.date_of_birth[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Religion</label>
                            <select v-model="form.religion"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring">
                                <option value="">Select Religion</option>
                                <option value="islam">Islam</option>
                                <option value="hinduism">Hinduism</option>
                                <option value="christianity">Christianity</option>
                                <option value="buddhism">Buddhism</option>
                                <option value="other">Other</option>
                            </select>
                            <span v-if="errors.religion" class="text-red-500 text-sm mt-1">{{ errors.religion[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">National ID</label>
                            <input v-model="form.national_id" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" />
                            <span v-if="errors.national_id" class="text-red-500 text-sm mt-1">{{ errors.national_id[0] }}</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 my-3">
                        <div>
                            <label class="block font-medium mb-1">Address</label>
                            <input v-model="form.address" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" />
                            <span v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address[0] }}</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Player Information -->
                        <div>
                            <label class="block font-medium mb-1">Player Type</label>
                            <select v-model="form.player_type"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" disabled>
                                <option value="registered">Registered</option>
                                <option value="guest">Guest</option>
                            </select>
                            <input type="hidden" name="player_type" v-model="form.player_type" />
                            <span v-if="errors.player_type" class="text-red-500 text-sm mt-1">{{ errors.player_type[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Player Role</label>
                            <select v-model="form.player_role"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring">
                                <option value="">Select</option>
                                <option value="batsman">Batsman</option>
                                <option value="bowler">Bowler</option>
                                <option value="all-rounder">All Rounder</option>
                                <option value="wicketkeeper">Wicket Keeper</option>
                            </select>
                            <span v-if="errors.player_role" class="text-red-500 text-sm mt-1">{{ errors.player_role[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Batting Style</label>
                            <select v-model="form.batting_style"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring">
                                <option value="">Select</option>
                                <option value="right-handed">Right-handed</option>
                                <option value="left-handed">Left-handed</option>
                                <option value="switch hitter">Switch Hitter</option>
                            </select>
                            <span v-if="errors.batting_style" class="text-red-500 text-sm mt-1">{{ errors.batting_style[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Bowling Style</label>
                            <select v-model="form.bowling_style"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring">
                                <option value="">Select</option>
                                <option value="fast">Fast</option>
                                <option value="medium">Medium</option>
                                <option value="spin">Spin</option>
                                <option value="none">None</option>
                            </select>
                            <span v-if="errors.bowling_style" class="text-red-500 text-sm mt-1">{{ errors.bowling_style[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Jursey Number</label>
                            <input v-model="form.jursey_number" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" placeholder="e.g., 10"/>
                            <span v-if="errors.jursey_number" class="text-red-500 text-sm mt-1">{{ errors.jursey_number[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Jursey Name</label>
                            <input v-model="form.jursey_name" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" placeholder="e.g., Al-Amin"/>
                            <span v-if="errors.jursey_name" class="text-red-500 text-sm mt-1">{{ errors.jursey_name[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Jersey Size</label>
                            <div class="flex space-x-4">
                                <label class="flex items-center space-x-2">
                                <input type="radio" value="s" v-model="form.jursey_size" class="form-radio" />
                                <span>S</span>
                                </label>
                                <label class="flex items-center space-x-2">
                                <input type="radio" value="m" v-model="form.jursey_size" class="form-radio" />
                                <span>M</span>
                                </label>
                                <label class="flex items-center space-x-2">
                                <input type="radio" value="l" v-model="form.jursey_size" class="form-radio" />
                                <span>L</span>
                                </label>
                                <label class="flex items-center space-x-2">
                                <input type="radio" value="xl" v-model="form.jursey_size" class="form-radio" />
                                <span>XL</span>
                                </label>
                                <label class="flex items-center space-x-2">
                                <input type="radio" value="2xl" v-model="form.jursey_size" class="form-radio" />
                                <span>2XL</span>
                                </label>
                                <label class="flex items-center space-x-2">
                                <input type="radio" value="3xl" v-model="form.jursey_size" class="form-radio" />
                                <span>3XL</span>
                                </label>
                            </div>
                            <span v-if="errors.jursey_size" class="text-red-500 text-sm mt-1">{{ errors.jursey_size[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Chest Measurement</label>
                            <input v-model="form.chest_measurement" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" placeholder="e.g., 38.5"/>
                            <span v-if="errors.chest_measurement" class="text-red-500 text-sm mt-1">{{ errors.chest_measurement[0] }}</span>
                        </div>
                    </div>

                    <div class="col-span-1 md:col-span-2 text-center mt-6">
                        <button type="submit"
                            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                            Submit Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>


<script setup>
import bgHome from './../../assets/bg/bg-home.png'
import { reactive, ref } from 'vue'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import { useToast } from "vue-toastification"
import axios from 'axios'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { API_BASE_URL } from '../api/config'

const toast = useToast()

const flatpickrConfig = {
    enableTime: false,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    disableMobile: true
};

const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
)

const form = reactive({
    full_name: '',
    nickname: '',
    username: '',
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
    chest_measurement: ''
})

const pond = ref(null)
const profileImageFile = ref([])
const fileObject = ref(null)
const errors = reactive({})

const handleFilePondInit = () => {
    console.log('FilePond initialized')
}

const handleFilePondAddFile = (error, file) => {
    if (error) {
        toast.error(error.message)
        return
    }

    fileObject.value = file.file
}

const handleFilePondRemoveFile = () => {
    fileObject.value = null
}

const resetForm = () => {
    Object.keys(form).forEach(key => {
        if (key !== 'player_type' && key !== 'address') {
            form[key] = ''
        }
    })

    profileImageFile.value = []
    fileObject.value = null

    if (pond.value) {
        pond.value.removeFiles()
    }

    console.log('Form reset complete')
}

const submitForm = async () => {
    if (!fileObject.value) {
        toast.error("Please select a valid profile picture.")
        return
    }

    // Reset errors
    Object.keys(errors).forEach(key => errors[key] = null)

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
    })
    formData.append('image', fileObject.value)
    
    try {
        const response = await axios.post(API_BASE_URL+'/registration', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        resetForm()
        toast.success(response.data.message || "Player Registration successful")
    } catch (err) {
        if (err.response?.status === 422) {
            // Laravel validation errors
            Object.assign(errors, err.response.data.errors)
            toast.error("Please fix the highlighted errors")
        } else {
            toast.error("Registration failed")
            console.error('Error:', err.response?.data || err.message)
        }
    }
}
</script>

<style scoped>
.el-form-item {
    margin-bottom: 20px;
}

.filepond--root .filepond--credits {
    display: none !important;
}

/* Hide the default radio input */
.form-radio {
    display: none;
}

/* Custom radio wrapper */
.form-radio + span {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 2px solid #ccc;
    border-radius: 4px; /* fully rounded */
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    user-select: none;
}

/* Hover effect */
.form-radio + span:hover {
    border-color: #61CE70;
    background-color: rgba(97, 206, 112, 0.1);
}

/* Checked state */
.form-radio:checked + span {
    background-color: #61CE70; /* brand color */
    color: white;
    border-color: #61CE70;
}
</style>