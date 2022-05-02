import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentUserIdState, usersQuery, newUserDefault, newUserState, openEditModalUserState } from './data/userState';
import { openUserSelectorState } from './data/userState';
import { currentCustCategIdState } from '../customerCategory/data/customerCategState';
import UserEdit from './UserEdit';
import SelectorBodySearch from '../../shared/SelectorBodySearch';

let editmodeText = '';

interface Props {
    editContext: string;
    enableDruggableParent: () => void;
}
export const UserSelector: React.FC<Props> = ({ editContext, enableDruggableParent }): JSX.Element => {
    const dialogHeading = 'Select User';
    const [openUserSelector, setOpenUserSelector] = useRecoilState(openUserSelectorState);
    const items = useRecoilValue(usersQuery) as UserType[];
    const openSelector = openUserSelector;

    const closeSelector = () => {
        setOpenUserSelector(false);
        enableDruggableParent();
    }

    const setNewUser = useSetRecoilState(newUserState);
    const setCurrentUserId = useSetRecoilState(currentUserIdState(editContext));
    const setCurrentUserTenantId = useSetRecoilState(currentCustCategIdState(editContext));
    const [openEditModalCustomer, setOpenEditModalCustomer] = useRecoilState(openEditModalUserState);

    // This is copy_paste from CustomersGrid 
    // (except using of names: items, setOpenEditModalCustomer), sorry
    const editCustomerAction = (id: number): void => {
        if (id === 0) {
            setNewUser(newUserDefault);
            setCurrentUserId(0);
            setCurrentUserTenantId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentUserId(id);
            const user = items.find(x => x.id === id) as UserFullType;
            setNewUser(fullUserToUser(user));
            setCurrentUserTenantId(user.tenant_id);
        }
        setOpenEditModalCustomer(true);
    };
    const fullUserToUser = (user: UserFullType): UserType => {
        let { tenants, ...newUser } = user;
        return (newUser);
    };
    const takeItem = (id: number): void => {
        setCurrentUserId(id);
        setTimeout(() => {
            setOpenUserSelector(false);
        }, 300);
    }
    return (
        <>
            <SelectorBodySearch
                items={items}
                dialogHeading={dialogHeading}
                openSelector={openSelector}
                closeSelector={closeSelector}
                takeItem={takeItem}
                editItem={editCustomerAction}
                editContext={editContext}
            />
            {openEditModalCustomer ? <UserEdit
                modalState={openEditModalCustomer}
                setFromParrent={setOpenEditModalCustomer}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}
        </>
    );
}
