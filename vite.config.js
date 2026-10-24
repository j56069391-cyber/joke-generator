import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The sandbox preview reaches this dev server through a rotating proxy host
// (<port>-<sandbox id>.<BASE44_SANDBOX_HOST_DOMAIN>). Only relax the Host
// allowlist when the platform preview flag is set, so local runs keep the
// default strict behavior.
const previewAllowedHosts =
  process.env.BASE44_PREVIEW_MODE === '1' && process.env.BASE44_SANDBOX_HOST_DOMAIN
    ? [`.${process.env.BASE44_SANDBOX_HOST_DOMAIN}`]
    : []

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    ...(previewAllowedHosts.length > 0 && { allowedHosts: previewAllowedHosts }),
  },
})
