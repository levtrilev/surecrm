import * as React from 'react';
import { putUpdatedSection, postNewSection } from './data/sectionDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { currentSectionIdState, sectionQuery, sectionsQuery, newSectionState } from './data/sectionState'
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { useEffect } from 'react';
import { SectionFormDialog } from './SectionFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const SectionEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }) => {
        const [currentSectionId, setCurrentSectionId] = useRecoilState(currentSectionIdState(outerEditContext));

    const localEditContext: string = 'Section.' + currentSectionId;
    
    const refreshSections = useRecoilRefresher_UNSTABLE(sectionsQuery);
    const refreshSection = useRecoilRefresher_UNSTABLE(sectionQuery(outerEditContext));

    const [newSection, setNewSection] = useRecoilState(newSectionState);

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));

    const handleClose = () => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        } else {
            setFromParrent(false);
        }
    };

    const updateSection = async () => {
        if (newSection.id === 0) {
            let newSectionId = await postNewSection(newSection);
            setCurrentSectionId(newSectionId);
            setNewSection({ ...newSection, id: newSectionId });
        } else {
            await putUpdatedSection(newSection);
        }
        setIsModified(false);
        setTimeout(refreshSections, 300);
        setTimeout(refreshSection, 300);
    };

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateSection();
            setYesNoCancel('neutral');
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setYesNoCancel('neutral');
            setFromParrent(false);
        } else {
            setYesNoCancel('neutral');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);
    return (
        <div>
            <SectionFormDialog
                updateSection={updateSection}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentSectionId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default SectionEdit;
