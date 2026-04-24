<template>
    <!-- Hero -->
    <section class="relative overflow-hidden" style="background-color: #0f172a; min-height: 200px;">
        <div class="absolute inset-0 opacity-10 pointer-events-none"
            style="background-image: url('/img/bg-home.jpg'); background-size: cover; background-position: center;"></div>
        <div class="relative z-10 flex items-center pt-24 pb-8">
            <div class="container mx-auto px-4">
                <h1 class="text-white text-2xl font-bold m-0 flex items-center gap-2">
                    <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Us
                </h1>
                <p class="text-slate-400 text-sm mt-1 m-0">Get in touch with the MadCricketers team</p>
            </div>
        </div>
    </section>

    <!-- Content -->
    <section class="bg-slate-50 py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <!-- Left: Contact Info -->
                <div class="lg:col-span-1 flex flex-col gap-4">

                    <!-- Section heading -->
                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Reach Us
                    </h2>

                    <!-- Email -->
                    <div class="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
                        <div class="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-medium m-0 uppercase tracking-wide">Email</p>
                            <a href="mailto:contact@madcricketers.com"
                                class="text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors">
                                contact@madcricketers.com
                            </a>
                        </div>
                    </div>

                    <!-- Phone -->
                    <div class="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
                        <div class="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-medium m-0 uppercase tracking-wide">Phone</p>
                            <a href="tel:+8801700000000"
                                class="text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors">
                                +880 1700-000000
                            </a>
                        </div>
                    </div>

                    <!-- Location -->
                    <div class="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
                        <div class="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-medium m-0 uppercase tracking-wide">Location</p>
                            <p class="text-sm font-semibold text-slate-800 m-0">Dhaka, Bangladesh</p>
                        </div>
                    </div>

                    <!-- Facebook -->
                    <div class="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-3">
                        <div class="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-slate-400 font-medium m-0 uppercase tracking-wide">Facebook</p>
                            <a href="https://facebook.com/madcricketers" target="_blank" rel="noopener noreferrer"
                                class="text-sm font-semibold text-slate-800 hover:text-red-600 transition-colors">
                                facebook.com/madcricketers
                            </a>
                        </div>
                    </div>

                </div>

                <!-- Right: Contact Form -->
                <div class="lg:col-span-2 flex flex-col gap-4">

                    <h2 class="text-base font-bold text-slate-800 flex items-center gap-2 m-0">
                        <span class="w-1 h-5 rounded bg-red-500 inline-block"></span>
                        Send a Message
                    </h2>

                    <div class="bg-white rounded-xl border border-slate-100 p-6">

                        <!-- Success message -->
                        <div v-if="submitSuccess"
                            class="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                            <svg class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none"
                                stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p class="text-sm font-semibold text-emerald-800 m-0">Message sent!</p>
                                <p class="text-xs text-emerald-700 m-0 mt-0.5">We'll get back to you as soon as
                                    possible.</p>
                            </div>
                        </div>

                        <!-- Error message -->
                        <div v-if="submitError"
                            class="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                                stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-sm text-red-700 m-0">{{ submitError }}</p>
                        </div>

                        <form @submit.prevent="handleSubmit" novalidate>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <!-- Name -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                                        Name <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.trim="form.name" type="text" placeholder="Your full name"
                                        :class="['w-full px-3 py-2.5 text-sm rounded-lg border bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition',
                                            errors.name ? 'border-red-400' : 'border-slate-200']" />
                                    <p v-if="errors.name" class="text-xs text-red-500 mt-1 m-0">{{ errors.name }}</p>
                                </div>

                                <!-- Email -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                                        Email <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.trim="form.email" type="email" placeholder="your@email.com"
                                        :class="['w-full px-3 py-2.5 text-sm rounded-lg border bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition',
                                            errors.email ? 'border-red-400' : 'border-slate-200']" />
                                    <p v-if="errors.email" class="text-xs text-red-500 mt-1 m-0">{{ errors.email }}</p>
                                </div>

                                <!-- Phone (optional) -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                                        Phone <span class="text-slate-400 font-normal normal-case">(optional)</span>
                                    </label>
                                    <input v-model.trim="form.phone" type="tel" placeholder="+880 1700-000000"
                                        class="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition" />
                                </div>

                                <!-- Subject -->
                                <div>
                                    <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                                        Subject <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.trim="form.subject" type="text" placeholder="What is this about?"
                                        :class="['w-full px-3 py-2.5 text-sm rounded-lg border bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition',
                                            errors.subject ? 'border-red-400' : 'border-slate-200']" />
                                    <p v-if="errors.subject" class="text-xs text-red-500 mt-1 m-0">{{ errors.subject }}</p>
                                </div>

                                <!-- Message -->
                                <div class="sm:col-span-2">
                                    <label class="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                                        Message <span class="text-red-500">*</span>
                                    </label>
                                    <textarea v-model.trim="form.message" rows="5"
                                        placeholder="Write your message here..."
                                        :class="['w-full px-3 py-2.5 text-sm rounded-lg border bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none',
                                            errors.message ? 'border-red-400' : 'border-slate-200']"></textarea>
                                    <p v-if="errors.message" class="text-xs text-red-500 mt-1 m-0">{{ errors.message }}</p>
                                </div>

                            </div>

                            <!-- Submit -->
                            <div class="mt-5">
                                <button type="submit" :disabled="submitting"
                                    class="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                                    <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none"
                                        stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {{ submitting ? 'Sending...' : 'Send Message' }}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
})

const errors = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
})

const submitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = () => {
    errors.name = form.name ? '' : 'Name is required.'
    errors.email = !form.email ? 'Email is required.' : !emailRegex.test(form.email) ? 'Enter a valid email address.' : ''
    errors.subject = form.subject ? '' : 'Subject is required.'
    errors.message = form.message ? '' : 'Message is required.'
    return !errors.name && !errors.email && !errors.subject && !errors.message
}

const handleSubmit = async () => {
    submitSuccess.value = false
    submitError.value = ''

    if (!validate()) return

    submitting.value = true

    try {
        // TODO: Connect to backend contact API when endpoint is available.
        // Example: await axios.post('/api/contact', form)
        await new Promise(resolve => setTimeout(resolve, 800)) // simulate delay

        submitSuccess.value = true
        form.name = ''
        form.email = ''
        form.phone = ''
        form.subject = ''
        form.message = ''
        Object.keys(errors).forEach(k => (errors[k] = ''))
    } catch (err) {
        submitError.value = 'Failed to send message. Please try again.'
    } finally {
        submitting.value = false
    }
}
</script>
