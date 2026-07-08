import { OpenSidePanelProps } from './OpenSidePanel.types';
import useOpenSidePanelHook from './OpenSidePanel.hooks';

const OpenSidePanel = ({ }: OpenSidePanelProps) => {
    const { openSidePanel } = useOpenSidePanelHook()

    return (
        <button type="button" onClick={openSidePanel} className="bg-blue-500 text-white p-2 rounded-md">
            Open side panel
        </button>
    );
};

export default OpenSidePanel;