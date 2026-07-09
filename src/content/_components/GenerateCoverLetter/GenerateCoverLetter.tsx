import { ContentWrapper } from '../ContentWrapper'
import useGenerateCoverLetterHook from './GenerateCoverLetter.hooks'
import type { GenerateCoverLetterProps } from './GenerateCoverLetter.types'
import styles from './GenerateCoverLetter.module.css'

const GenerateCoverLetter = (_props: GenerateCoverLetterProps) => {
    const { handleGenerateCoverLetter } = useGenerateCoverLetterHook()

    return (
        <ContentWrapper>
            <div className={styles.root}>
                <button
                    type="button"
                    onClick={handleGenerateCoverLetter}
                    className={styles.button}
                >
                    Сгенерировать сопровод
                </button>
            </div>
        </ContentWrapper>
    )
}

export default GenerateCoverLetter
