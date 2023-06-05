import React, { useEffect, useState } from 'react'
import { DocumentTypes } from '../../core/types/documents'
import { Table, TableProps } from 'rsuite'

export interface TableRowData {
    type: DocumentTypes
    user: string
    status: string
    counterParty?: string
    total: number | string
}

export enum DisplayMode {
    HEADER = 'header',
    BODY = 'body',
    FOOTER = 'footer',
}

interface DocumentsTableProps {
    tableData?: TableRowData[]
    displayedColumns: Record<string, boolean>
    displayMode?: DisplayMode
}

type AdditionalTableProps = Pick<
    TableProps<TableRowData, unknown>,
    'height' | 'headerHeight' | 'renderEmpty' | 'autoHeight' | 'showHeader' | 'data'
>

const DocumentsTable: React.FC<DocumentsTableProps> = ({ tableData, displayedColumns, displayMode }) => {
    const [additionalProps, setAdditionalProps] = useState<AdditionalTableProps>()

    useEffect(() => {
        switch (displayMode) {
            case DisplayMode.HEADER:
                setAdditionalProps({
                    height: 50,
                    headerHeight: 50,
                    renderEmpty: () => <></>,
                })
                break
            case DisplayMode.BODY:
                setAdditionalProps({
                    autoHeight: true,
                    showHeader: false,
                })
                break
            case DisplayMode.FOOTER:
                setAdditionalProps({
                    autoHeight: true,
                    showHeader: false,
                })
                break
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = () => {
        switch (displayMode) {
            case DisplayMode.BODY:
                return tableData
            case DisplayMode.FOOTER:
                return tableData
            case DisplayMode.HEADER:
                return undefined
        }
    }

    return (
        <Table cellBordered={false} bordered={false} data={getData()} {...additionalProps}>
            {displayedColumns.user && (
                <Table.Column width={300}>
                    <Table.HeaderCell>Пользователь</Table.HeaderCell>
                    <Table.Cell dataKey="user" />
                </Table.Column>
            )}
            {displayedColumns.type && (
                <Table.Column width={200}>
                    <Table.HeaderCell>Тип документа</Table.HeaderCell>
                    <Table.Cell dataKey="type" />
                </Table.Column>
            )}
            {displayedColumns.status && (
                <Table.Column width={150}>
                    <Table.HeaderCell>Статус</Table.HeaderCell>
                    <Table.Cell dataKey="status" />
                </Table.Column>
            )}
            {displayedColumns.counterParty && (
                <Table.Column width={200}>
                    <Table.HeaderCell>Контрагент</Table.HeaderCell>
                    <Table.Cell dataKey="counterParty" />
                </Table.Column>
            )}
            <Table.Column flexGrow={1}>
                <Table.HeaderCell>Всего</Table.HeaderCell>
                <Table.Cell dataKey="total" />
            </Table.Column>
        </Table>
    )
}

export default DocumentsTable
