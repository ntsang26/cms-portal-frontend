/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
    ]
  },
  publicRuntimeConfig: {
    // host: "https://cms-api-loyalty.momoney.com.mm",
    host: "http://localhost:1339",
    secretApiKey: "b8c535c5-0622-4119-803f-7e4d845133ba"
  },
  env: {
    GA4_MEASUREMENT_ID: "G-MXYFSJSZFZ",
  },
}

module.exports = nextConfig
