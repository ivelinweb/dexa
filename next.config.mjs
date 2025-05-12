/** @type {import('next').NextConfig} */
const nextConfig = {
  // Change from static export to server-side rendering for cPanel
  // output: "export",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gnfd-testnet-sp1.bnbchain.org",
        port: "",
        pathname: "/view/dexa/**",
      },
    ],
    unoptimized: true,
    loader: "akamai",
    path: "",
  },
  trailingSlash: true,
};

export default nextConfig;
