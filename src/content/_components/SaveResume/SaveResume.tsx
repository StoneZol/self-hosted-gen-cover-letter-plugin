import { ContentWrapper } from '../ContentWrapper';
import { SaveResumeProps } from './SaveResume.types';
import useSaveResumeHook from './SaveResume.hooks';
import styles from './SaveResume.module.css'

const SaveResume = ({ }: SaveResumeProps) => {
    const { handleSaveResume } = useSaveResumeHook()

    return (
        <ContentWrapper>
            <div className={styles.root}>
                <button
                    type="button"
                    onClick={handleSaveResume}
                    className={styles.button}
                >
                    Save resume
                </button>
            </div>
        </ContentWrapper>
    );
};

export default SaveResume;