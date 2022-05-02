import * as React from 'react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { DataGrid, GridColDef, GridEvents, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { useGridApiRef, useGridApiEventHandler } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';
import { currentSectionIdState, newSectionDefault, newSectionState, sectionsFullQuery } from './data/sectionState';
import { deleteSection } from './data/sectionDao';
import SectionEdit from './SectionEdit';
import { currentTenantIdState } from '../tenant/data/tenantState';

let editmodeText = '';
let editContext = 'SectionGrid';

export default function SectionsGrid(): JSX.Element {

    const sections = useRecoilValue(sectionsFullQuery);
    const refreshSections = useRecoilRefresher_UNSTABLE(sectionsFullQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const [currentSectionId, setCurrentSectionId] = useRecoilState(currentSectionIdState(editContext));
    const setCurrentTenantId = useSetRecoilState(currentTenantIdState(editContext));
    const setNewSection = useSetRecoilState(newSectionState);

    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    const fullSectionToSection = (section: SectionFullType): SectionType => {
        let { tenants, ...newSection } = section;
        return (newSection);
    };
    const editSectionAction = (id: number): void => {
        if (id === 0) {
            setNewSection(newSectionDefault);
            setCurrentSectionId(0);
            setCurrentTenantId(0);
            editmodeText = 'создание нового';
        } else {
            editmodeText = 'редактирование';
            setCurrentSectionId(id);
            const section = sections.find(x => x.id === id) as SectionFullType;
            setCurrentTenantId(section.tenant_id);
            setNewSection(fullSectionToSection(section as SectionFullType));
        }
        setOpenEditModal(true);
    };
    const copySectionAction = (id: number): void => {
        editmodeText = 'копирование';
        const section = sections.find(x => x.id === id) as SectionFullType;
        setNewSection({ ...fullSectionToSection(section), 'id': 0 });
        setCurrentTenantId(section.tenant_id);
        setOpenEditModal(true);
    };
    const deleteSectionAction = (id: number): void => {
        setShowYesCancelDialog(true);
        setCurrentSectionId(id);
        setTimeout(refreshSections, 300);
    };
    function getTenant(params: GridValueGetterParams<any, any>): string {
        return `${params.row.tenants?.name || ''}`;
    };
    const sectionColumns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 60,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    {params.id}
                </strong>
            ),
        },
        {
            field: 'name',
            headerName: 'Раздел',
            width: 300,
            editable: false,
        },
        {
            field: 'tenant_id',
            headerName: 'tenant_id',
            width: 100,
            editable: false,
        },
        {
            field: 'tenant',
            type: 'string',
            headerName: 'Tenant',
            width: 120,
            editable: false,
            valueGetter: getTenant,
        },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 130,
            editable: false,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    <IconButton size="medium" onClick={() => editSectionAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteSectionAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copySectionAction(params.id as number)}>
                        <ContentCopyIcon />
                    </IconButton>
                </strong>
            ),
        },
    ];

    useGridApiEventHandler(useGridApiRef(), GridEvents.rowClick);

    useEffect(() => {
        if (yesCancel) {
            deleteSection(currentSectionId);
            setTimeout(refreshSections, 300);
            setYesCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSectionId, yesCancel]);

    return (
        <>
            <div style={{ height: 630, width: "99%", margin: "50px 4px 4px 4px" }}>
                <TopDocsButtons
                    id={0}
                    refreshAction={refreshSections}
                    deleteAction={() => { }}
                    createNewAction={() => editSectionAction(0)}
                    copyAction={() => { }}
                />
                <DataGrid rowHeight={32}
                    // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                    rows={sections}
                    columns={sectionColumns}
                    pageSize={16}
                    rowsPerPageOptions={[16]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowClick={(params, event, details) => { }}
                />
                {showYesCancelDialog ? <YesCancelDialog
                    questionToConfirm={`Удалить раздел (id = ${currentSectionId}) ?`}
                    modalState={showYesCancelDialog}
                    setFromParrent={setShowYesCancelDialog}
                    editContext={editContext}
                /> : <></>}
                {openEditModal ? <SectionEdit
                    modalState={openEditModal}
                    setFromParrent={setOpenEditModal}
                    editmodeText={editmodeText}
                    outerEditContext={editContext}
                /> : <></>}
            </div>
        </>
    );
}
