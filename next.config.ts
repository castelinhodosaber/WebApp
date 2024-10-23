import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});
const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA({ nextConfig });

module.exports = withPWA({
  // Outras configurações do Next.js
});
