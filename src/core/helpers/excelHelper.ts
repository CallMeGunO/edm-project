import { utils, writeFileXLSX } from 'xlsx'
import { GroupBy } from '../types/documents'
import { TableGroup } from '../../views/ReportResult/ReportResult'

type ExcelCell = number | string
type ExcellRow = ExcelCell[]

enum HeaderCellNames {
    USER = 'Пользователь',
    DOCUMENT_TYPE = 'Тип документа',
    STATUS = 'Статус',
    COUNTERPARTY = 'Контрагент',
    TOTAL = 'Всего',
    NONE = '-'
}

class ExcelHelper {
    private getColumnNameByTableColumnName(tableColumnName: string): HeaderCellNames {
        switch (tableColumnName) {
            case 'user':
                return HeaderCellNames.USER
            case 'type':
                return HeaderCellNames.DOCUMENT_TYPE
            case 'status':
                return HeaderCellNames.STATUS
            case 'counterParty':
                return HeaderCellNames.COUNTERPARTY
            case 'total':
                return HeaderCellNames.TOTAL
            default:
                return HeaderCellNames.NONE
        }
    }


    private parseTableRowDataToMatrixOfExcelCells(
        tableGroups: TableGroup, 
        displayedColumns: Record<string, boolean>,
        groupBy?: GroupBy,
    ): ExcellRow[] {
        const result: ExcellRow[] = []
        let arrayRowData: ExcellRow

        Object.entries(tableGroups).forEach(([groupName, tableRows]) => {
            if (groupName !== 'noGroup') {
                result.push([groupName])
            }

            tableRows.forEach((tableRow) => {
                arrayRowData = []

                Object.entries(tableRow).forEach(([cellName, cellValue]) => {
                    switch(groupBy) {
                        case GroupBy.DOC_TYPE:
                            if (cellName !== 'type' && displayedColumns[cellName]) {
                                arrayRowData.push(cellValue)
                            }
                            break
                        case GroupBy.USER:
                            if (cellName !== 'user' && displayedColumns[cellName]) {
                                arrayRowData.push(cellValue)
                            }
                            break
                        case GroupBy.STATUS:
                            if (cellName !== 'status' && displayedColumns[cellName]) {
                                arrayRowData.push(cellValue)
                            }
                            break
                        case GroupBy.COUNTER_PARTY:
                            if (cellName !== 'counterParty' && displayedColumns[cellName]) {
                                arrayRowData.push(cellValue)
                            }
                            break
                        default:
                            if (displayedColumns[cellName]) {
                                arrayRowData.push(cellValue)
                            }
                            break
                    }
                })

                result.push(arrayRowData)
            })
        })

        return result
    }

    private getColumnsArray(displayedColumns: Record<string, boolean>, groupBy?: GroupBy): ExcellRow {
        const result: ExcellRow = []
        Object.entries(displayedColumns).forEach(([columnName, isColumnDisplayed]) => {
            switch (groupBy) {
                case GroupBy.DOC_TYPE:
                    if (columnName === 'type') {
                        break
                    }
                    if (isColumnDisplayed) {
                        result.push(this.getColumnNameByTableColumnName(columnName))
                    }
                    break
                case GroupBy.USER:
                    if (columnName === 'user') {
                        break
                    }
                    if (isColumnDisplayed) {
                        result.push(this.getColumnNameByTableColumnName(columnName))
                    }
                    break
                case GroupBy.STATUS:
                    if (columnName === 'status') {
                        break
                    }
                    if (isColumnDisplayed) {
                        result.push(this.getColumnNameByTableColumnName(columnName))
                    }
                    break
                case GroupBy.COUNTER_PARTY:
                    if (columnName === 'counterParties') {
                        break
                    }
                    if (isColumnDisplayed) {
                        result.push(this.getColumnNameByTableColumnName(columnName))
                    }
                    break
                default:
                    if (isColumnDisplayed) {
                        result.push(this.getColumnNameByTableColumnName(columnName))
                    }
                    break
            }
        })

        return result
    }

    exportTableRowDataAsExcelFile(
        tableGroups: TableGroup,
        fileName: string,
        displayedColumns: Record<string, boolean>,
        groupBy?: GroupBy
    ) {
        const excelCells = this.parseTableRowDataToMatrixOfExcelCells(tableGroups, displayedColumns, groupBy)
        excelCells.unshift(this.getColumnsArray(displayedColumns, groupBy))

        const workbook = utils.book_new()
        const worksheet = utils.aoa_to_sheet(excelCells)
        utils.book_append_sheet(workbook, worksheet)

        writeFileXLSX(workbook, fileName)
    }
}

export default new ExcelHelper()