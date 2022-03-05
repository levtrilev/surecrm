import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentProdCategIdState, currentProdCategState, newProdCategDefault, newProdCategState, openEditModalProdCategState, prodCategQuery, prodCategsQuery } from './data/prodCategState';
import { openProdCategSelectorState } from './data/prodCategState';
import SelectorBody from '../../shared/SelectorBody';
import ProdCategEdit from './ProdCategEdit';

let editmodeText = '';

export function ProdCategSelector() {
    const dialogHeading = 'Select a Product Category';
    const [openProdCategSelector, setOpenProdCategSelector] = useRecoilState(openProdCategSelectorState);
    const items = useRecoilValue(prodCategsQuery) as ProductCategoryType[];
    const setCurrentProdCategId = useSetRecoilState(currentProdCategIdState);
    const setCurrentProdCateg = useSetRecoilState(currentProdCategState);
    const openSelector = openProdCategSelector;
    const closeSelector = () => setOpenProdCategSelector(false);

    const [newProdCateg, setNewProdCateg] = useRecoilState(newProdCategState);
    const [openEditModalProdCateg, setOpenEditModalProdCateg] = useRecoilState(openEditModalProdCategState);
    let prodCategToOpen = useRecoilValue(prodCategQuery);

    const takeItem = (id: number) => {
        setCurrentProdCategId(id);
        const item = items.find(x => x.id === id) as ProductCategoryType;
        setCurrentProdCateg(item);
        setTimeout(() => {
            setOpenProdCategSelector(false);
        }, 300);
    }
    // This is copy_paste from ProdCategGrid 
    // (except using of names: items, setOpenEditModalProdCateg), sorry
    const editProdCategAction = (id: number) => {
        if (id === 0) {
            setNewProdCateg(newProdCategDefault);
            setCurrentProdCategId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentProdCategId(id);
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
                prodCateg={prodCategToOpen ? prodCategToOpen : newProdCateg}
                modalState={openEditModalProdCateg}
                setFromParrent={setOpenEditModalProdCateg}
                editmodeText={editmodeText}
            /> : <></>}
        </>
    );
}
