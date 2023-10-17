/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: {
            exclude: ['error', 'warn'],
        },
    },
}

module.exports = nextConfig
