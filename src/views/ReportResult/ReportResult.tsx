import React, { ReactNode, useEffect, useState } from 'react'
import DocumentsTable, { DisplayMode, TableRowData } from '../../components/DocumentsTable/DocumentsTable'

import { Document, DocumentTypes, GroupBy } from '../../core/types/documents'

import styles from './ReportResult.css'
import HorizontalBar from '../../components/HorizontalBar/HorizontalBar'
import graphDataHelper from '../../core/helpers/graphDataHelper'
import RadialDiagram from '../../components/RadialDiagram/RadialDiagram'
import { Button } from 'rsuite'
import excelHelper from '../../core/helpers/excelHelper'

interface ReportResultProps {
    documents: Document[]
    docTypes: DocumentTypes[]
    users?: string[]
    statuses?: string[]
    counterParties?: string[]
    groupBy?: GroupBy
    fileName?: string
}

interface Filter {
    type: string
    user?: string
    status?: string
    counterParty?: string
}

export type TableGroup = Record<string, TableRowData[]>

const ReportResult: React.FC<ReportResultProps> = ({
    documents,
    docTypes,
    users = [],
    statuses = [],
    counterParties = [],
    groupBy,
    fileName,
}) => {
    const [tableGroups, setTableGroups] = useState<TableGroup>({})
    const [tableRowData, setTableRowData] = useState<TableRowData[]>([])
    const [displayedColumns, setDisplayedColumns] = useState<Record<string, boolean>>({})
    const [isAnyData, setIsAnyData] = useState<boolean>(true)
    const [totalDocumentsAmount, setTotalDocumentsAmount] = useState<string>('Всего: ')

    const compareDocs = (document: Document, filter: Filter) => {
        let result = true
        if (document.type !== filter.type) {
            result = false
        }
        if (filter.user && document.user !== filter.user) {
            result = false
        }
        if (filter.status && document.status !== filter.status) {
            result = false
        }
        if (filter.counterParty && document.counterParty !== filter.counterParty) {
            result = false
        }
        return result
    }

    useEffect(() => {
        const newTableGroups: TableGroup = {}
        const newTableRowData: TableRowData[] = []

        const newOptionalColumns: Record<string, boolean> = {
            type: groupBy !== GroupBy.DOC_TYPE,
            user: users.length !== 0 && groupBy !== GroupBy.USER,
            status: statuses.length !== 0 && groupBy !== GroupBy.STATUS,
            counterParty: counterParties.length !== 0 && groupBy !== GroupBy.COUNTER_PARTY,
            total: true,
        }

        let filter: Filter
        const filterUsers = users.length === 0 ? ['-'] : users
        const filterStatuses = statuses.length === 0 ? ['-'] : statuses
        const filterCounterParties = counterParties.length === 0 ? ['-'] : counterParties

        let documentsAmount = 0

        docTypes.forEach((docType) => {
            filterUsers.forEach((user) => {
                filterStatuses.forEach((status) => {
                    filterCounterParties.forEach((counterParty) => {
                        filter = {
                            type: docType,
                            user: user === '-' ? undefined : user,
                            status: status === '-' ? undefined : status,
                            counterParty: counterParty === '-' ? undefined : counterParty,
                        }

                        const filteredDocs = documents.filter((document) => compareDocs(document, filter))
                        if (filteredDocs.length > 0) {
                            newTableRowData.push({
                                type: docType,
                                user: user,
                                status: status,
                                counterParty: counterParty,
                                total: filteredDocs.length,
                            })

                            documentsAmount += filteredDocs.length
                        }
                    })
                })
            })
        })

        setTableRowData(newTableRowData)
        setTotalDocumentsAmount(`Всего: ${documentsAmount}`)

        newTableRowData.forEach((row) => {
            switch (groupBy) {
                case GroupBy.DOC_TYPE:
                    if (newTableGroups[row.type]) {
                        newTableGroups[row.type].push(row)
                    } else {
                        newTableGroups[row.type] = [row]
                    }
                    break
                case GroupBy.USER:
                    if (newTableGroups[row.user]) {
                        newTableGroups[row.user].push(row)
                    } else {
                        newTableGroups[row.user] = [row]
                    }
                    break
                case GroupBy.STATUS:
                    if (newTableGroups[row.status]) {
                        newTableGroups[row.status].push(row)
                    } else {
                        newTableGroups[row.status] = [row]
                    }
                    break
                case GroupBy.COUNTER_PARTY:
                    if (row.counterParty) {
                        if (newTableGroups[row.counterParty]) {
                            newTableGroups[row.counterParty].push(row)
                        } else {
                            newTableGroups[row.counterParty] = [row]
                        }
                    }
                    break
                default:
                    if (newTableGroups.noGroup) {
                        newTableGroups.noGroup.push(row)
                    } else {
                        newTableGroups.noGroup = [row]
                    }
                    break
            }
        })

        setTableGroups(newTableGroups)
        setIsAnyData(Object.values(newTableGroups).length !== 0)
        setDisplayedColumns(newOptionalColumns)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documents])

    const mapGroupsToTables = (tableGroups: TableGroup): ReactNode => {
        return Object.entries(tableGroups).map(([key, value]) => {
            return (
                <div key={key}>
                    {key !== 'noGroup' && <div className={styles.groupHeader}>{key}</div>}
                    <DocumentsTable tableData={value} displayedColumns={displayedColumns} displayMode={DisplayMode.BODY} />
                </div>
            )
        })
    }

    const excelExportHandler = () => {
        excelHelper.exportTableRowDataAsExcelFile(tableGroups, fileName || 'file.xlsx', displayedColumns, groupBy)
    }

    return isAnyData ? (
        <div>
            <Button appearance="primary" onClick={excelExportHandler} className={styles.exportExcelButton}>
                Экспортировать в EXCEL
            </Button>
            <DocumentsTable displayedColumns={displayedColumns} displayMode={DisplayMode.HEADER} />
            {mapGroupsToTables(tableGroups)}
            <DocumentsTable
                displayedColumns={displayedColumns}
                displayMode={DisplayMode.FOOTER}
                tableData={[
                    {
                        type: DocumentTypes.UNPROVIDED,
                        user: '',
                        status: '',
                        total: totalDocumentsAmount,
                    },
                ]}
            />
            <HorizontalBar
                title="Статистика документов по типам"
                {...graphDataHelper.getNonAxisGraphPropsFromTableGroups(docTypes, tableRowData, 'type')}
            />
            {statuses.length > 0 && (
                <RadialDiagram
                    title="Диаграмма статусов"
                    {...graphDataHelper.getNonAxisGraphPropsFromTableGroups(statuses, tableRowData, 'status')}
                />
            )}
        </div>
    ) : (
        <div className={styles.noDocumentsFound}>Отсутствуют данные по указанным параметрам</div>
    )
}

export default ReportResult
