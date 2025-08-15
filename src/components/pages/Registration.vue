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
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-medium mb-1">Full Name *</label>
                            <input v-model="form.full_name" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Nickname</label>
                            <input v-model="form.nickname" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" />
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Username *</label>
                            <input v-model="form.username" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Password *</label>
                            <input v-model="form.password" type="password"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Email *</label>
                            <input v-model="form.email" type="email"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Phone *</label>
                            <input v-model="form.phone" type="tel"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" required />
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
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Date of Birth</label>
                            <flat-pickr v-model="form.date_of_birth" :config="flatpickrConfig"></flat-pickr>
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
                        </div>

                        <div>
                            <label class="block font-medium mb-1">National ID</label>
                            <input v-model="form.national_id" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" />
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Address</label>
                            <input v-model="form.address" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" />
                        </div>

                        <!-- Player Information -->
                        <div>
                            <label class="block font-medium mb-1">Player Type</label>
                            <select v-model="form.player_type"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring" disabled>
                                <option value="registered">Registered</option>
                                <option value="guest">Guest</option>
                            </select>
                            <input type="hidden" name="player_type" v-model="form.player_type" />
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

const toast = useToast()

const flatpickrConfig = {
    enableTime: false,
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
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
    bowling_style: ''
})

const pond = ref(null)
const profileImageFile = ref([])
const fileObject = ref(null)

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

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
    })

    formData.append('image', fileObject.value)

    try {
        const response = await axios.post('http://127.0.0.1:8000/api/registration', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        resetForm()
        toast.success(response.message || "Player Registration successful")
    } catch (err) {
        toast.error("Registration failed")
        console.error('Error:', err.response?.data || err.message)
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
</style>