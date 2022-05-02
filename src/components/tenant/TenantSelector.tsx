import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentTenantIdState, tenantsQuery, 
    newTenantDefault, newTenantState, 
    openEditModalTenantState } from './data/tenantState';
import { openTenantSelectorState } from './data/tenantState';
import TenantEdit from './TenantEdit';
import SelectorBodySearch from '../../shared/SelectorBodySearch';

let editmodeText = '';

interface Props {
    editContext: string;
    enableDruggableParent: () => void;
}
export const TenantSelector: React.FC<Props> = ({editContext, enableDruggableParent}) => {
    const dialogHeading = 'Select a Tenant';
    const [openTenantSelector, setOpenTenantSelector] = useRecoilState(openTenantSelectorState);
    const items = useRecoilValue(tenantsQuery);
    const setCurrentTenantId = useSetRecoilState(currentTenantIdState(editContext));
    const setEditTenantId = useSetRecoilState(currentTenantIdState('TenantSelector'));

    const [openEditModalTenant, setOpenEditModalTenant] = useRecoilState(openEditModalTenantState);
    const setNewTenant = useSetRecoilState(newTenantState);

    const openSelector = openTenantSelector;
    const closeSelector = () => {
        setOpenTenantSelector(false);
        enableDruggableParent();
    }

    const takeItem = (id: number) => {
        setCurrentTenantId(id);        
        setTimeout(() => {
            setOpenTenantSelector(false);
        }, 300);
    };

    const editTenantAction = (id: number) => {
        if (id === 0) {
            setNewTenant(newTenantDefault);
            setEditTenantId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setEditTenantId(id);
            const tenant = items.find(x => x.id === id) as TenantType;
            setNewTenant(tenant);
        }
        setOpenEditModalTenant(true);
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
            {openEditModalTenant ? <TenantEdit
                modalState={openEditModalTenant}
                setFromParrent={setOpenEditModalTenant}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}
        </>
    );
}
