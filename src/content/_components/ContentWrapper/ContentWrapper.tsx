import { APP_DISPLAY_NAME } from '@/lib/constants/appName'
import logoAsset from '@/assets/logoTransparent.png'
import styles from './ContentWrapper.module.css'
import { ContentWrapperProps } from './ContentWrapper.types'

/** Vite даёт `/assets/...`; на странице сайта это чужой origin — нужен chrome-extension:// URL. */
const logoSrc = chrome.runtime.getURL(logoAsset.replace(/^\//, ''))

const ContentWrapper = ({ children }: ContentWrapperProps) => {
    return (
        <div className={styles.root}>
            <div className={styles.brand}>
                <img src={logoSrc} alt={`${APP_DISPLAY_NAME} logo`} className={styles.brandLogo} />
            </div>
            <span className={styles.eyebrow}>{APP_DISPLAY_NAME}</span>

            <div className={styles.content}>
                <div className={styles.children}>{children}</div>
            </div>
        </div>
    )
}

export default ContentWrapper
