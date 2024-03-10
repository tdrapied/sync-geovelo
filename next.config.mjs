import nextTranslate from "next-translate-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  }
};

export default nextTranslate({
  webpack: (config, { isServer, webpack }) => {
    return config;
  }
});
