import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSectionIdState, sectionsQuery, 
    newSectionDefault, newSectionState, 
    openEditModalSectionState } from './data/sectionState';
import { openSectionSelectorState } from './data/sectionState';
import SectionEdit from './SectionEdit';
import SelectorBodySearch from '../../shared/SelectorBodySearch';

let editmodeText = '';

interface Props {
    editContext: string;
    enableDruggableParent: () => void;
}
export const TenantSelector: React.FC<Props> = ({editContext, enableDruggableParent}) => {
    const dialogHeading = 'Выберите раздел';
    const [openSectionSelector, setOpenSectionSelector] = useRecoilState(openSectionSelectorState);
    const items = useRecoilValue(sectionsQuery);
    const setCurrentSectionId = useSetRecoilState(currentSectionIdState(editContext));
    const setEditSectionId = useSetRecoilState(currentSectionIdState('SectionSelector'));

    const [openEditModalSection, setOpenEditModalSection] = useRecoilState(openEditModalSectionState);
    const setNewSection = useSetRecoilState(newSectionState);

    const openSelector = openSectionSelector;
    const closeSelector = () => {
        setOpenSectionSelector(false);
        enableDruggableParent();
    }

    const takeItem = (id: number) => {
        setCurrentSectionId(id);        
        setTimeout(() => {
            setOpenSectionSelector(false);
        }, 300);
    };

    const editTenantAction = (id: number) => {
        if (id === 0) {
            setNewSection(newSectionDefault);
            setEditSectionId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setEditSectionId(id);
            const section = items.find(x => x.id === id) as SectionType;
            setNewSection(section);
        }
        setOpenEditModalSection(true);
    };
    return (
        <>
            <SelectorBodySearch
                items={items}
                dialogHeading={dialogHeading}
                openSelector={openSelector}
                closeSelector={closeSelector}
                takeItem={takeItem}
                editItem={editTenantAction}
                editContext={editContext}
            />
            {openEditModalSection ? <SectionEdit
                modalState={openEditModalSection}
                setFromParrent={setOpenEditModalSection}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}
        </>
    );
}
