/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/desprendibles',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;