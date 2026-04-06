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
                        <label class="block font-medium mb-2">Profile Picture *</label>
                        <div class="mb-4">
                            <div v-if="!imageSrc"
                                class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <input type="file" @change="uploadImage" accept="image/*" class="hidden"
                                    ref="fileInput" />
                                <button type="button" @click="triggerFileInput"
                                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mb-3">
                                    Choose Image
                                </button>
                                <p class="text-gray-500">or drag and drop an image here</p>
                                <p class="text-gray-400 text-sm mt-2">Maximum file size: 2MB</p>
                            </div>

                            <div v-if="imageSrc">
                                <!-- Vue Cropper Component -->
                                <vue-cropper ref="cropperRef" :src="imageSrc" :aspect-ratio="1" :view-mode="2"
                                    :background="false" :auto-crop-area="0.8" :drag-mode="'crop'" :guides="true"
                                    :center="true" :highlight="true" :responsive="true" :restore="true"
                                    :check-cross-origin="false" @ready="onReady" class="cropper-container" />

                                <div class="flex flex-wrap gap-2 mb-4 mt-4">
                                    <button type="button" @click="cropImage"
                                        class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                                        Crop Image
                                    </button>
                                    <button type="button" @click="rotateLeft"
                                        class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                        ↺ Rotate Left
                                    </button>
                                    <button type="button" @click="rotateRight"
                                        class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                        ↻ Rotate Right
                                    </button>
                                    <button type="button" @click="resetCrop"
                                        class="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                                        Reset Crop
                                    </button>
                                    <button type="button" @click="removeImage"
                                        class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                        Remove Image
                                    </button>
                                    <button type="button" @click="triggerFileInput"
                                        class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
                                        Change Image
                                    </button>
                                </div>

                                <!-- Preview -->
                                <div v-if="croppedImageUrl" class="mt-4 p-4 bg-gray-50 rounded border">
                                    <p class="text-sm font-medium text-gray-700 mb-2">Cropped Preview:</p>
                                    <div class="flex flex-col md:flex-row items-start gap-4">
                                        <img :src="croppedImageUrl" alt="Cropped Preview"
                                            class="w-32 h-32 object-cover rounded border" />
                                        <div>
                                            <p class="text-sm text-green-600 font-medium">
                                                ✓ Image cropped and ready for upload
                                            </p>
                                            <p class="text-xs text-gray-500 mt-1">
                                                Size: {{ formatFileSize(croppedBlob?.size || 0) }}
                                            </p>
                                            <p class="text-xs text-gray-500">
                                                Dimensions: 300 × 300 pixels
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span v-if="errors.image" class="text-red-500 text-sm mt-1">{{ errors.image[0] }}</span>
                        <p class="text-gray-500 text-xs mt-1">Recommended: Square image, max 2MB (JPEG, PNG, WebP)</p>
                    </div>

                    <!-- Rest of your form fields -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block font-medium mb-1">Full Name *</label>
                            <input v-model="form.full_name" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                required />
                            <span v-if="errors.full_name" class="text-red-500 text-sm mt-1">{{ errors.full_name[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Nickname</label>
                            <input v-model="form.nickname" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                            <span v-if="errors.nickname" class="text-red-500 text-sm mt-1">{{ errors.nickname[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Email *</label>
                            <input v-model="form.email" type="email"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                required />
                            <span v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Password *</label>
                            <input v-model="form.password" type="password"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                required />
                            <span v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Phone *</label>
                            <input v-model="form.phone" type="tel"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                required />
                            <span v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Blood Group</label>
                            <select v-model="form.blood_group"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
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
                            <span v-if="errors.blood_group" class="text-red-500 text-sm mt-1">{{ errors.blood_group[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Gender</label>
                            <select v-model="form.gender"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <span v-if="errors.gender" class="text-red-500 text-sm mt-1">{{ errors.gender[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Date of Birth</label>
                            <flat-pickr v-model="form.date_of_birth" :config="flatpickrConfig"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
                            </flat-pickr>
                            <span v-if="errors.date_of_birth" class="text-red-500 text-sm mt-1">{{
                                errors.date_of_birth[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Religion</label>
                            <select v-model="form.religion"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Select Religion</option>
                                <option value="islam">Islam</option>
                                <option value="hinduism">Hinduism</option>
                                <option value="christianity">Christianity</option>
                                <option value="buddhism">Buddhism</option>
                                <option value="other">Other</option>
                            </select>
                            <span v-if="errors.religion" class="text-red-500 text-sm mt-1">{{ errors.religion[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">National ID</label>
                            <input v-model="form.national_id" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                            <span v-if="errors.national_id" class="text-red-500 text-sm mt-1">{{ errors.national_id[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Favourite Football Country</label>
                            <input v-model="form.favourite_football_country" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                            <span v-if="errors.favourite_football_country" class="text-red-500 text-sm mt-1">{{ errors.favourite_football_country[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Favourite Cricket Country</label>
                            <input v-model="form.favourite_cricket_country" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                            <span v-if="errors.favourite_cricket_country" class="text-red-500 text-sm mt-1">{{ errors.favourite_cricket_country[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Favourite Football League Team</label>
                            <input v-model="form.favourite_football_league_team" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                            <span v-if="errors.favourite_football_league_team" class="text-red-500 text-sm mt-1">{{ errors.favourite_football_league_team[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Married Status</label>
                            <select v-model="form.married_status"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Select Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                            </select>
                            <span v-if="errors.married_status" class="text-red-500 text-sm mt-1">{{ errors.married_status[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Education Batch Filter</label>
                            <input v-model="form.education_batch" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="e.g., 2018-2022" />
                            <span v-if="errors.education_batch" class="text-red-500 text-sm mt-1">{{ errors.education_batch[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">SSC Batch Field</label>
                            <input v-model="form.ssc_batch" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="e.g., 2018" />
                            <span v-if="errors.ssc_batch" class="text-red-500 text-sm mt-1">{{ errors.ssc_batch[0] }}</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 my-3">
                        <div>
                            <label class="block font-medium mb-1">Address</label>
                            <input v-model="form.address" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300" />
                            <span v-if="errors.address" class="text-red-500 text-sm mt-1">{{ errors.address[0] }}</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Player Information -->
                        <div>
                            <label class="block font-medium mb-1">Player Type</label>
                            <select v-model="form.player_type"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                disabled>
                                <option value="registered">Registered</option>
                                <option value="guest">Guest</option>
                            </select>
                            <input type="hidden" name="player_type" v-model="form.player_type" />
                            <span v-if="errors.player_type" class="text-red-500 text-sm mt-1">{{ errors.player_type[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Player Role</label>
                            <select v-model="form.player_role"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Select</option>
                                <option value="batsman">Batsman</option>
                                <option value="bowler">Bowler</option>
                                <option value="all-rounder">All Rounder</option>
                                <option value="wicketkeeper">Wicket Keeper</option>
                            </select>
                            <span v-if="errors.player_role" class="text-red-500 text-sm mt-1">{{ errors.player_role[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Batting Style</label>
                            <select v-model="form.batting_style"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Select</option>
                                <option value="right-handed">Right-handed</option>
                                <option value="left-handed">Left-handed</option>
                                <option value="switch hitter">Switch Hitter</option>
                            </select>
                            <span v-if="errors.batting_style" class="text-red-500 text-sm mt-1">{{
                                errors.batting_style[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Bowling Style</label>
                            <select v-model="form.bowling_style"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">Select</option>
                                <option value="fast">Fast</option>
                                <option value="medium">Medium</option>
                                <option value="spin">Spin</option>
                                <option value="none">None</option>
                            </select>
                            <span v-if="errors.bowling_style" class="text-red-500 text-sm mt-1">{{
                                errors.bowling_style[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Jersey Number</label>
                            <input v-model="form.jursey_number" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="e.g., 10" />
                            <span v-if="errors.jursey_number" class="text-red-500 text-sm mt-1">{{
                                errors.jursey_number[0] }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Jersey Name</label>
                            <input v-model="form.jursey_name" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="e.g., Al-Amin" />
                            <span v-if="errors.jursey_name" class="text-red-500 text-sm mt-1">{{ errors.jursey_name[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Jersey Size</label>
                            <div class="flex flex-wrap gap-2">
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
                                <label class="flex items-center space-x-2">
                                    <input type="radio" value="4xl" v-model="form.jursey_size" class="form-radio" />
                                    <span>4XL</span>
                                </label>
                            </div>
                            <span v-if="errors.jursey_size" class="text-red-500 text-sm mt-1">{{ errors.jursey_size[0]
                            }}</span>
                        </div>

                        <div>
                            <label class="block font-medium mb-1">Chest Measurement</label>
                            <input v-model="form.chest_measurement" type="text"
                                class="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                placeholder="e.g., 38.5" />
                            <span v-if="errors.chest_measurement" class="text-red-500 text-sm mt-1">{{
                                errors.chest_measurement[0] }}</span>
                        </div>
                    </div>

                    <div class="col-span-1 md:col-span-2 text-center mt-8">
                        <button type="submit"
                            class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-lg">
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
.el-form-item {
    margin-bottom: 20px;
}

/* Hide the default radio input */
.form-radio {
    display: none;
}

/* Custom radio wrapper */
.form-radio+span {
    display: inline-block;
    padding: 0.5rem 1rem;
    border: 2px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    user-select: none;
    min-width: 3rem;
    text-align: center;
}

/* Hover effect */
.form-radio+span:hover {
    border-color: #61CE70;
    background-color: rgba(97, 206, 112, 0.1);
}

/* Checked state */
.form-radio:checked+span {
    background-color: #61CE70;
    color: white;
    border-color: #61CE70;
}

/* Cropper container styling */
:deep(.cropper-container) {
    width: 100%;
    height: 400px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Cropper.js custom styles */
:deep(.cropper-view-box),
:deep(.cropper-face) {
    border-radius: 50%;
}

:deep(.cropper-view-box) {
    outline: 2px solid #3b82f6;
    outline-color: rgba(59, 130, 246, 0.75);
}

:deep(.cropper-line) {
    background-color: #3b82f6;
}

:deep(.cropper-point) {
    background-color: #3b82f6;
    width: 8px;
    height: 8px;
}

:deep(.cropper-point.point-se) {
    width: 12px;
    height: 12px;
}

/* Form input focus styles */
input:focus,
select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* File upload area */
.drag-drop-area {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    transition: border-color 0.3s;
    cursor: pointer;
}

.drag-drop-area:hover {
    border-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .flex-wrap {
        gap: 0.5rem;
    }

    .form-radio+span {
        padding: 0.4rem 0.8rem;
        min-width: 2.5rem;
    }

    :deep(.cropper-container) {
        height: 300px !important;
    }
}
</style>