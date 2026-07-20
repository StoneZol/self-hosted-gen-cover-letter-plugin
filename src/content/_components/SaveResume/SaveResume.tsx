import { ContentWrapper } from '../ContentWrapper'
import { SaveResumeProps } from './SaveResume.types'
import useSaveResumeHook from './SaveResume.hooks'
import styles from './SaveResume.module.css'

const SaveResume = (_props: SaveResumeProps) => {
    const { handleSaveResume, isSaving } = useSaveResumeHook()

    return (
        <ContentWrapper>
            <div className={styles.root}>
                <button
                    type="button"
                    onClick={() => void handleSaveResume()}
                    disabled={isSaving}
                    className={styles.button}
                >
                    {isSaving ? 'Сохраняю...' : 'Сохранить резюме'}
                </button>
            </div>
        </ContentWrapper>
    )
}

export default SaveResume
