/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
            protocol: 'https',
            hostname:'cobra-case-bucket.s3.amazonaws.com'
            }
        ]
    }
};

export default nextConfig;
