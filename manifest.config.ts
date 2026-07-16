import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    icons: {
        128: 'public/logo.png',
    },
    action: {
        default_icon: {
            128: 'public/logo.png',
        },
        default_popup: 'src/popup/index.html',
    },
    permissions: [
        'sidePanel',
        'contentSettings',
        'storage',
        'tabs',
        'clipboardRead',
        'clipboardWrite',
    ],
    background: {
        service_worker: 'src/background/main.ts',
        type: 'module',
    },
    // LLM может быть на localhost, LAN IP, своём домене или у облачного провайдера —
    // поэтому разрешаем любые origin'ы для fetch из расширения.
    host_permissions: ['<all_urls>'],
    content_scripts: [{
        js: ['src/content/main.tsx'],
        matches: ['https://*/*'],
    }],
    side_panel: {
        default_path: 'src/sidepanel/index.html',
    },
})
