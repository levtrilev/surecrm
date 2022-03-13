import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentProdCategIdState, newProdCategDefault, newProdCategState, openEditModalProdCategState, prodCategQuery, prodCategsQuery } from './data/prodCategState';
import { openProdCategSelectorState } from './data/prodCategState';
import SelectorBody from '../../shared/SelectorBody';
import ProdCategEdit from './ProdCategEdit';

let editmodeText = '';

interface Props {
    editContext: string;
    enableDruggableParent: () => void;
}
    export const ProdCategSelector: React.FC<Props> = ({editContext, enableDruggableParent}) => {
    const dialogHeading = 'Select a Product Category';
    const [openProdCategSelector, setOpenProdCategSelector] = useRecoilState(openProdCategSelectorState);
    const items = useRecoilValue(prodCategsQuery) as ProductCategoryType[];
    const setCurrentProdCategId = useSetRecoilState(currentProdCategIdState(editContext));
    const setEditProdCategId = useSetRecoilState(currentProdCategIdState('self'));

    const [openEditModalProdCateg, setOpenEditModalProdCateg] = useRecoilState(openEditModalProdCategState);
    let prodCategToEdit = useRecoilValue(prodCategQuery('self'));
    const [newProdCateg, setNewProdCateg] = useRecoilState(newProdCategState);

    const openSelector = openProdCategSelector;
    const closeSelector = () => {
        setOpenProdCategSelector(false);
        enableDruggableParent();
    }

    const takeItem = (id: number) => {
        setCurrentProdCategId(id);
        // const item = items.find(x => x.id === id) as ProductCategoryType;
        // setCurrentProdCateg(item);
        setTimeout(() => {
            setOpenProdCategSelector(false);
        }, 300);
    }
    // This is copy_paste from ProdCategGrid 
    // (except using of names: items, setOpenEditModalProdCateg), sorry
    const editProdCategAction = (id: number) => {
        if (id === 0) {
            setNewProdCateg(newProdCategDefault);
            setEditProdCategId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setEditProdCategId(id);
            const prodCateg = items.find(x => x.id === id) as ProductCategoryType;
            setNewProdCateg(prodCateg);
        }
        setOpenEditModalProdCateg(true);
    };
    return (
        <>
            <SelectorBody
                items={items}
                dialogHeading={dialogHeading}
                openSelector={openSelector}
                closeSelector={closeSelector}
                takeItem={takeItem}
                editItem={editProdCategAction}
            />
            {openEditModalProdCateg ? <ProdCategEdit
                prodCateg={prodCategToEdit ? prodCategToEdit : newProdCateg}
                modalState={openEditModalProdCateg}
                setFromParrent={setOpenEditModalProdCateg}
                editmodeText={editmodeText}
                editContext={editContext}
            /> : <></>}
        </>
    );
}
