<template>
    <div class="min-h-screen bg-white">
        <section id="home" class="bg-home relative" :style="{ backgroundImage: `url(${bgHome})` }">
            <div class="flex items-center justify-center py-8" style="padding-top: 7rem;">
                <div class="container mx-auto px-4 pt-12 relative z-10">
                    <div class="w-full text-center">
                        <h2 class="mb-6 text-white text-3xl font-semibold">Registration Successful!</h2>
                        <p class="text-white text-lg">Thank you for registering as a player.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="relative z-10">
            <div class="container mx-auto px-4 py-12">
                <div class="mx-auto">
                    <div class="bg-white rounded-2xl shadow-sm overflow-hidden transform transition-all duration-500">
                        <!-- Important Notice for Guest Players -->
                        <div v-if="registrationData.player_type === 'guest'"
                            class="bg-yellow-50 border-l-4 border-yellow-400 p-6 mx-8 mt-8 rounded-lg animate-slide-in-right">
                            <div class="flex items-start">
                                <div class="flex-shrink-0">
                                    <svg class="h-8 w-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <h3 class="text-lg font-medium text-yellow-800">Important Notice for Guest Players
                                    </h3>
                                    <div class="mt-2 text-yellow-700">
                                        <p class="text-base">
                                            <span class="font-bold">Note:</span> As a <span
                                                class="font-semibold text-yellow-900">Guest Player</span>, you need to
                                            play at least
                                            <span class="font-bold text-red-600">3 matches</span> to become eligible for
                                            tournament selection and ranking.
                                        </p>
                                        <ul class="mt-3 space-y-2 text-sm">
                                            <li class="flex items-center">
                                                <svg class="h-5 w-5 text-yellow-500 mr-2" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                Complete your 3 matches within the next 30 days
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="h-5 w-5 text-yellow-500 mr-2" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                Performance will be evaluated after 3 matches
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="h-5 w-5 text-yellow-500 mr-2" fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                Regular updates will be sent to your registered email
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Registration Details -->
                        <div class="p-8">
                            <h2
                                class="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200 animate-fade-in-up animation-delay-500">
                                Registration Details
                            </h2>

                            <!-- Profile Image Preview & Login Credentials -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                                <!-- Profile Picture Card -->
                                <div v-if="registrationData.profile_image_url"
                                    class="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm p-6">
                                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Profile Picture</h3>
                                    <div class="flex flex-col md:flex-row items-start gap-6">
                                        <!-- Fixed Size Image Container -->
                                        <div class="relative flex-shrink-0">
                                            <img :src="registrationData.profile_image_url" alt="Profile Picture"
                                                class="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover"
                                                @error="handleImageError">
                                            <div
                                                class="absolute inset-0 rounded-full border-2 border-blue-300 animate-pulse opacity-50">
                                            </div>
                                        </div>

                                        <!-- File Details -->
                                        <div class="flex-1">
                                            <div class="space-y-4">
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p class="text-gray-600 text-sm mb-1">Format</p>
                                                        <p class="text-gray-800 font-medium">{{
                                                            getImageFormat(registrationData.profile_image_url) }}</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-gray-600 text-sm mb-1">Size</p>
                                                        <p class="text-gray-800 font-medium">{{ imageSize }}</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-gray-600 text-sm mb-1">Dimensions</p>
                                                        <p class="text-gray-800 font-medium">300 × 300 px</p>
                                                    </div>
                                                    <div>
                                                        <p class="text-gray-600 text-sm mb-1">Quality</p>
                                                        <p class="text-gray-800 font-medium">High</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Login Credentials Card -->
                                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6">
                                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Login Credentials</h3>

                                    <div class="space-y-4">
                                        <!-- Username -->
                                        <div class="bg-white rounded-lg p-4 border border-gray-200">
                                            <div class="flex justify-between items-center mb-2">
                                                <p class="text-sm text-gray-600 mb-2">Username</p>
                                                <button @click="copyToClipboard(registrationData.username)"
                                                    class="text-blue-500 hover:text-blue-700 text-xs flex items-center">
                                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Copy
                                                </button>
                                            </div>
                                            <p class="text-lg font-mono text-gray-800 mb-0">
                                                {{ registrationData.username }}
                                            </p>
                                        </div>

                                        <!-- Password -->
                                        <div class="bg-white rounded-lg p-4 border border-gray-200">
                                            <div class="flex justify-between items-center mb-2">
                                                <p class="text-sm text-gray-600 mb-2">Password</p>
                                                <button @click="copyToClipboard(registrationData.password)"
                                                    class="text-blue-500 hover:text-blue-700 text-xs flex items-center">
                                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                    Copy
                                                </button>
                                            </div>
                                            <div class="flex items-center">
                                                <p class="text-lg font-mono text-gray-800 mb-0">
                                                    {{ registrationData.visible_pass }}
                                                </p>
                                                <span
                                                    class="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                    Visible
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Personal Information Card -->
                                <div
                                    class="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-sm transform transition-transform duration-300 hover:-translate-y-1">
                                    <div class="flex items-center mb-4">
                                        <div class="bg-blue-100 p-3 rounded-lg mr-4">
                                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <h3 class="text-xl font-semibold text-gray-800">Personal Information</h3>
                                    </div>

                                    <div class="space-y-4">
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Full Name:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.full_name
                                                }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Nickname:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.nickname ||
                                                'N/A' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Email:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.email
                                                }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Phone:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.phone
                                                }}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 font-medium">Player Type:</span>
                                            <span :class="playerTypeClass"
                                                class="px-3 py-1 rounded-full text-sm font-semibold">
                                                {{ playerTypeDisplay }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Player Details Card -->
                                <div
                                    class="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-sm transform transition-transform duration-300 hover:-translate-y-1">
                                    <div class="flex items-center mb-4">
                                        <div class="bg-green-100 p-3 rounded-lg mr-4">
                                            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h3 class="text-xl font-semibold text-gray-800">Player Details</h3>
                                    </div>

                                    <div class="space-y-4">
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Player Role:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                formatPlayerRole(registrationData.player_role) ||
                                                'Not Specified' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Batting Style:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                formatBattingStyle(registrationData.batting_style)
                                                || 'Not Specified' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Bowling Style:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                formatBowlingStyle(registrationData.bowling_style)
                                                || 'Not Specified' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Jersey Number:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.jursey_number
                                                || 'Not Assigned' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 font-medium">Jersey Name:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.jursey_name ||
                                                'Not Assigned' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Additional Information Card -->
                                <div
                                    class="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 shadow-sm transform transition-transform duration-300 hover:-translate-y-1">
                                    <div class="flex items-center mb-4">
                                        <div class="bg-purple-100 p-3 rounded-lg mr-4">
                                            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h3 class="text-xl font-semibold text-gray-800">Additional Information</h3>
                                    </div>

                                    <div class="space-y-4">
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Blood Group:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.blood_group ||
                                                'Not Specified' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Gender:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                formatGender(registrationData.gender) }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Date of Birth:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                formatDate(registrationData.date_of_birth) }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Religion:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                formatReligion(registrationData.religion) ||
                                                'Not Specified' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 font-medium">National ID:</span>
                                            <span class="text-gray-900 font-semibold">{{ registrationData.national_id ||
                                                'Not Provided' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Jersey & Contact Card -->
                                <div
                                    class="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 shadow-sm transform transition-transform duration-300 hover:-translate-y-1">
                                    <div class="flex items-center mb-4">
                                        <div class="bg-orange-100 p-3 rounded-lg mr-4">
                                            <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <h3 class="text-xl font-semibold text-gray-800">Jersey & Contact</h3>
                                    </div>

                                    <div class="space-y-4">
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Jersey Size:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                registrationData.jursey_size?.toUpperCase() || 'Not Specified' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Chest Measurement:</span>
                                            <span class="text-gray-900 font-semibold">{{
                                                registrationData.chest_measurement || 'Not Provided' }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span class="text-gray-600 font-medium">Address:</span>
                                            <span class="text-gray-900 font-semibold text-right">{{
                                                registrationData.address }}</span>
                                        </div>
                                        <div class="flex justify-between items-center pt-4">
                                            <span class="text-gray-600 font-medium">Registration Date:</span>
                                            <span class="text-gray-900 font-semibold">{{ new Date().toLocaleDateString()
                                                }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <!-- Next Steps -->
                            <div
                                class="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                <h3 class="text-xl font-semibold text-gray-800 mb-4">What's Next?</h3>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <div
                                            class="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h4 class="font-semibold text-gray-700 mb-1">Email Verification</h4>
                                        <p class="text-sm text-gray-600">Check your email for verification link</p>
                                    </div>
                                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <div
                                            class="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 class="font-semibold text-gray-700 mb-1">Account Activation</h4>
                                        <p class="text-sm text-gray-600">Your account will be activated within 24 hours
                                        </p>
                                    </div>
                                    <div class="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <div
                                            class="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <h4 class="font-semibold text-gray-700 mb-1">Team Assignment</h4>
                                        <p class="text-sm text-gray-600">You'll be assigned to a team soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="mt-8 bg-white rounded-xl shadow-sm p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4">Need Help?</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="flex items-center">
                                <div class="bg-blue-100 p-3 rounded-lg mr-4">
                                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-700 mb-1">Phone Support</p>
                                    <p class="text-gray-600 mb-0">+880 1234 567890</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="bg-green-100 p-3 rounded-lg mr-4">
                                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-700 mb-1">Email Support</p>
                                    <p class="text-gray-600 mb-0">support@cricketclub.com</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <div class="bg-purple-100 p-3 rounded-lg mr-4">
                                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-medium text-gray-700 mb-1">Office Address</p>
                                    <p class="text-gray-600 mb-0">Rajshahi, Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { API_BASE_URL } from '../api/config'
import bgHome from './../../assets/bg/bg-home.png'
import {
    formatPlayerRole,
    formatBattingStyle,
    formatBowlingStyle,
    formatGender,
    formatDate,
    formatReligion
} from './../../helpers/PlayerHelper'

const router = useRouter()
const route = useRoute()
const toast = useToast()

// State
const loading = ref(true)
const error = ref(null)
const registrationData = ref({})
const checkmarkLength = ref(0)

const imageSize = ref('Loading...')
const imageFormat = ref('Unknown')
const imageDimensions = ref({ width: 0, height: 0 })

const regUid = route.params.reg_uid

const mapApiData = (apiData) => {
    return {
        id: apiData.id,
        player_uid: apiData.player_uid,
        reg_uid: apiData.player_uid,
        player_type: apiData.player_type,
        player_role: apiData.player_role,
        batting_style: apiData.batting_style,
        bowling_style: apiData.bowling_style,
        jursey_number: apiData.jursey_number,
        jursey_name: apiData.jursey_name,
        jursey_size: apiData.jursey_size,
        chest_measurement: apiData.chest_measurement,

        full_name: apiData.user?.full_name,
        nickname: apiData.user?.nickname,
        username: apiData.user?.username,
        email: apiData.user?.email,
        phone: apiData.user?.phone,
        blood_group: apiData.user?.blood_group,
        gender: apiData.user?.gender,
        date_of_birth: apiData.user?.date_of_birth,
        religion: apiData.user?.religion,
        national_id: apiData.user?.national_id,
        address: apiData.user?.address,
        visible_pass: apiData.user?.visible_pass,

        profile_image_url: apiData.user?.image,

        created_at: apiData.created_at,
        updated_at: apiData.updated_at,

        status: apiData.user?.status,
        role: apiData.user?.roles?.[0]?.name || 'player'
    }
}

const fetchRegistrationData = async () => {
    try {
        loading.value = true

        const response = await axios.get(`${API_BASE_URL}/registration/find/${regUid}`)

        if (response.data) {
            registrationData.value = mapApiData(response.data.data)

            console.log('Mapped registration data:', registrationData.value)
        } else {
            error.value = 'Registration data not found'
        }
    } catch (err) {
        console.error('Error fetching registration:', err)
        error.value = 'Failed to load registration details. Please try again later.'

        if (err.response?.status === 404) {
            error.value = 'Registration not found. Please check the registration ID.'
        } else if (err.response?.data?.message) {
            error.value = err.response.data.message
        }
    } finally {
        loading.value = false
    }
}

// Computed properties
const playerTypeDisplay = computed(() => {
    return registrationData.value.player_type === 'guest'
        ? 'Guest Player'
        : 'Registered Player'
})

const playerTypeClass = computed(() => {
    return registrationData.value.player_type === 'guest'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800'
})

// Handle image error
const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/300x300?text=Profile+Image'
}

// Helper functions for the profile image section
const getImageFormat = (url) => {
    if (!url) return 'JPEG'
    const extension = url.split('.').pop().toLowerCase()
    const formatMap = {
        'jpg': 'JPEG',
        'jpeg': 'JPEG',
        'png': 'PNG',
        'webp': 'WebP',
        'gif': 'GIF'
    }
    return formatMap[extension] || extension.toUpperCase()
}

// Helper function to format bytes
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Copy to clipboard function
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
    } catch (err) {
        console.error('Failed to copy:', err)
        toast.error('Failed to copy text')
    }
}

// Fetch image details
const fetchImageDetails = async (url) => {
    if (!url) return

    try {
        imageSize.value = 'Loading...'

        // Get size from HEAD request
        const sizeResponse = await fetch(url, { method: 'HEAD' })
        if (sizeResponse.ok) {
            const contentLength = sizeResponse.headers.get('content-length')
            if (contentLength) {
                imageSize.value = formatFileSize(parseInt(contentLength))
            } else {
                // Fallback to fetching the whole image
                const fullResponse = await fetch(url)
                const blob = await fullResponse.blob()
                imageSize.value = formatFileSize(blob.size)
            }
        }

        // Get format
        imageFormat.value = getImageFormat(url)

        // Get dimensions
        await getImageDimensions(url)

    } catch (error) {
        console.error('Error fetching image details:', error)
        imageSize.value = 'Unknown size'
    }
}

// Get image dimensions
const getImageDimensions = (url) => {
    return new Promise((resolve) => {
        const img = new Image()

        img.onload = function () {
            imageDimensions.value = {
                width: this.width,
                height: this.height
            }
            resolve()
        }

        img.onerror = function () {
            imageDimensions.value = { width: 300, height: 300 }
            resolve()
        }

        img.src = url
    })
}

watch(() => registrationData.value.profile_image_url, (newUrl) => {
    if (newUrl) {
        fetchImageDetails(newUrl)
    }
}, { immediate: true })

// Initialize on mount
onMounted(() => {
    // Check if reg_uid exists
    if (!regUid) {
        error.value = 'Registration ID is missing'
        loading.value = false
        return
    }

    fetchRegistrationData()

    // Animate checkmark after data loads
    setTimeout(() => {
        const path = document.querySelector('.checkmark-path')
        if (path) {
            checkmarkLength.value = path.getTotalLength()
            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 0.5s ease-in-out'
                path.style.strokeDashoffset = '0'
            }, 500)
        }
    }, 100)
})
</script>

<style scoped>
/* Custom Animations */
@keyframes blob {
    0% {
        transform: translate(0px, 0px) scale(1);
    }

    33% {
        transform: translate(30px, -50px) scale(1.1);
    }

    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }

    100% {
        transform: translate(0px, 0px) scale(1);
    }
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slide-in-right {
    from {
        opacity: 0;
        transform: translateX(30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.8);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-blob {
    animation: blob 7s infinite;
}

.animation-delay-2000 {
    animation-delay: 2s;
}

.animation-delay-4000 {
    animation-delay: 4s;
}

.animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out;
}

.animation-delay-300 {
    animation-delay: 0.3s;
}

.animation-delay-500 {
    animation-delay: 0.5s;
}

.animate-slide-in-right {
    animation: slide-in-right 0.5s ease-out;
}

.animate-scale-in {
    animation: scale-in 0.5s ease-out;
}

.checkmark-path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    transition: stroke-dashoffset 0.5s ease-in-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Print styles */
@media print {
    .no-print {
        display: none;
    }

    body {
        background: white !important;
    }

    .bg-gradient-to-br {
        background: white !important;
    }
}
</style>