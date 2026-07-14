import { ContentWrapper } from '../ContentWrapper'
import useGenerateCoverLetterHook from './GenerateCoverLetter.hooks'
import type { GenerateCoverLetterProps } from './GenerateCoverLetter.types'
import styles from './GenerateCoverLetter.module.css'

const GenerateCoverLetter = (_props: GenerateCoverLetterProps) => {
    const { handleGenerateCoverLetter, hasVacancy, isGenerating } = useGenerateCoverLetterHook()
    const isDisabled = isGenerating || !hasVacancy

    return (
        <ContentWrapper>
            <div className={styles.root}>
                <button
                    type="button"
                    onClick={handleGenerateCoverLetter}
                    className={styles.button}
                    disabled={isDisabled}
                    data-generating={isGenerating ? 'true' : undefined}
                    title={
                        !hasVacancy
                            ? 'Сначала откройте вакансию — текст должен появиться в sidepanel'
                            : undefined
                    }
                >
                    {isGenerating ? 'Генерирую...' : 'Сгенерировать сопровод'}
                </button>
            </div>
        </ContentWrapper>
    )
}

export default GenerateCoverLetter
