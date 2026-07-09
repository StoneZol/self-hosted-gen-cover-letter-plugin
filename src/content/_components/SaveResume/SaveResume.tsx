import { ContentWrapper } from '../ContentWrapper'
import { SaveResumeProps } from './SaveResume.types'
import useSaveResumeHook from './SaveResume.hooks'
import styles from './SaveResume.module.css'

const SaveResume = (_props: SaveResumeProps) => {
    const { handleSaveResume, saveHint, buttonLabel, isSaving } = useSaveResumeHook()

    return (
        <ContentWrapper>
            <div className={styles.root}>
                <div className={styles.content}>
                    <p className={styles.hint}>{saveHint}</p>
                    <button
                        type="button"
                        onClick={() => void handleSaveResume()}
                        disabled={isSaving}
                        className={styles.button}
                    >
                        {isSaving ? 'Сохраняю...' : buttonLabel}
                    </button>
                </div>
            </div>
        </ContentWrapper>
    )
}

export default SaveResume
