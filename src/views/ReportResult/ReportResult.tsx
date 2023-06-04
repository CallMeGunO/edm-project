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
    docDepartments?: string[]
    docStatuses?: string[]
    docStates?: string[]
    docCounterParties?: string[]
    groupBy?: GroupBy
    fileName?: string
}

interface Filter {
    docType: string
    docDepartment?: string
    docStatus?: string
    docState?: string
    docCounterParty?: string
}

export type TableGroup = Record<string, TableRowData[]>

const ReportResult: React.FC<ReportResultProps> = ({
    documents,
    docTypes,
    docDepartments = [],
    docStatuses = [],
    docStates = [],
    docCounterParties = [],
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
        if (document.docType !== filter.docType) {
            result = false
        }
        if (filter.docDepartment && document.docDepartment !== filter.docDepartment) {
            result = false
        }
        if (filter.docStatus && document.docStatus !== filter.docStatus) {
            result = false
        }
        if (filter.docState && document.docState !== filter.docState) {
            result = false
        }
        if (filter.docCounterParty && document.docCounterParty !== filter.docCounterParty) {
            result = false
        }
        return result
    }

    useEffect(() => {
        const newTableGroups: TableGroup = {}
        const newTableRowData: TableRowData[] = []

        const newOptionalColumns: Record<string, boolean> = {
            documentType: groupBy !== GroupBy.DOC_TYPE,
            department: docDepartments.length !== 0 && groupBy !== GroupBy.DEPARTMENT,
            status: docStatuses.length !== 0 && groupBy !== GroupBy.STATUS,
            state: docStates.length !== 0 && groupBy !== GroupBy.STATE,
            counterParty: docCounterParties.length !== 0 && groupBy !== GroupBy.COUNTER_PARTY,
            summ: docTypes.includes(DocumentTypes.CONTRACTS),
            total: true,
        }

        let filter: Filter
        const filterDepartments = docDepartments.length === 0 ? ['-'] : docDepartments
        const filterStatuses = docStatuses.length === 0 ? ['-'] : docStatuses
        const filterStates = docStates.length === 0 ? ['-'] : docStates
        const filterCounterParties = docCounterParties.length === 0 ? ['-'] : docCounterParties

        let documentsAmount = 0

        docTypes.forEach((docType) => {
            filterDepartments.forEach((department) => {
                filterStatuses.forEach((status) => {
                    filterStates.forEach((state) => {
                        filterCounterParties.forEach((counterParty) => {
                            filter = {
                                docType: docType,
                                docDepartment: department === '-' ? undefined : department,
                                docStatus: status === '-' ? undefined : status,
                                docState: state === '-' ? undefined : state,
                                docCounterParty: counterParty === '-' ? undefined : counterParty,
                            }

                            const filteredDocs = documents.filter((document) => compareDocs(document, filter))
                            if (filteredDocs.length > 0) {
                                newTableRowData.push({
                                    documentType: docType,
                                    department: department,
                                    status: status,
                                    state: state,
                                    counterParty: counterParty,
                                    summ:
                                        docType === DocumentTypes.CONTRACTS
                                            ? filteredDocs.reduce(
                                                  (prev, current) =>
                                                      (prev += current.docSumm === '-' ? 0 : Number(current.docSumm)),
                                                  0
                                              )
                                            : '-',
                                    total: filteredDocs.length,
                                })

                                documentsAmount += filteredDocs.length
                            }
                        })
                    })
                })
            })
        })

        setTableRowData(newTableRowData)
        setTotalDocumentsAmount(`Всего: ${documentsAmount}`)

        newTableRowData.forEach((row) => {
            switch (groupBy) {
                case GroupBy.DOC_TYPE:
                    if (newTableGroups[row.documentType]) {
                        newTableGroups[row.documentType].push(row)
                    } else {
                        newTableGroups[row.documentType] = [row]
                    }
                    break
                case GroupBy.DEPARTMENT:
                    if (newTableGroups[row.department]) {
                        newTableGroups[row.department].push(row)
                    } else {
                        newTableGroups[row.department] = [row]
                    }
                    break
                case GroupBy.STATUS:
                    if (newTableGroups[row.status]) {
                        newTableGroups[row.status].push(row)
                    } else {
                        newTableGroups[row.status] = [row]
                    }
                    break
                case GroupBy.STATE:
                    if (newTableGroups[row.state]) {
                        newTableGroups[row.state].push(row)
                    } else {
                        newTableGroups[row.state] = [row]
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
                        documentType: DocumentTypes.UNPROVIDED,
                        department: '',
                        state: '',
                        status: '',
                        total: totalDocumentsAmount,
                    },
                ]}
            />
            <HorizontalBar
                title="Статистика документов по типам"
                {...graphDataHelper.getNonAxisGraphPropsFromTableGroups(docTypes, tableRowData, 'documentType')}
            />
            {docStatuses.length > 0 && (
                <RadialDiagram
                    title="Диаграмма статусов"
                    {...graphDataHelper.getNonAxisGraphPropsFromTableGroups(docStatuses, tableRowData, 'status')}
                />
            )}
        </div>
    ) : (
        <div className={styles.noDocumentsFound}>Отсутствуют данные по указанным параметрам</div>
    )
}

export default ReportResult
