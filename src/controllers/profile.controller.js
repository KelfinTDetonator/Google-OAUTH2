const { userProfiles } = require('../models/index')
const response = require('../../utils/response.utils')
const createError = require('http-errors')

module.exports = {
    /**
     * GET /api/v1/profile
     * Ambil profile milik user yang sedang login
     */
    getProfile: async (req, res, next) => {
        try {
            const userId = res.user.id

            const profile = await userProfiles.findUnique({
                where: { userId: Number(userId) },
                include: {
                    user: {
                        select: { id: true, email: true, createdAt: true }
                    }
                }
            })

            if (!profile) {
                throw createError(404, 'Profile not found. Create your profile first.')
            }

            return res.status(200).json(response.success('Fetch profile success', profile))
        } catch (error) {
            console.error(error)
            next(error)
        }
    },

    /**
     * POST /api/v1/profile
     * Buat profile baru untuk user yang sedang login
     */
    createProfile: async (req, res, next) => {
        try {
            const userId = res.user.id
            const { fullName, bio, avatarUrl, phone } = req.body

            const existing = await userProfiles.findUnique({
                where: { userId: Number(userId) }
            })

            if (existing) {
                throw createError(409, 'Profile already exists. Use PUT to update your profile.')
            }

            const profile = await userProfiles.create({
                data: {
                    userId: Number(userId),
                    fullName: fullName || null,
                    bio: bio || null,
                    avatarUrl: avatarUrl || null,
                    phone: phone || null
                }
            })

            return res.status(201).json(response.success('Profile created successfully', profile))
        } catch (error) {
            console.error(error)
            next(error)
        }
    },

    /**
     * PUT /api/v1/profile
     * Update profile user yang sedang login
     */
    updateProfile: async (req, res, next) => {
        try {
            const userId = res.user.id
            const { fullName, bio, avatarUrl, phone } = req.body

            const existing = await userProfiles.findUnique({
                where: { userId: Number(userId) }
            })

            if (!existing) {
                throw createError(404, 'Profile not found. Create your profile first using POST /profile.')
            }

            const updatedProfile = await userProfiles.update({
                where: { userId: Number(userId) },
                data: {
                    ...(fullName  !== undefined && { fullName }),
                    ...(bio       !== undefined && { bio }),
                    ...(avatarUrl !== undefined && { avatarUrl }),
                    ...(phone     !== undefined && { phone })
                }
            })

            return res.status(200).json(response.success('Profile updated successfully', updatedProfile))
        } catch (error) {
            console.error(error)
            next(error)
        }
    }
}
