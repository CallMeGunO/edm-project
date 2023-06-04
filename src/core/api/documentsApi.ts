import PlatformApi from './platformApi'

import { DocumentData } from '../types/documents'

class DocumentsApi extends PlatformApi {
    static async getDocumentsListsItems(
        listId: string | undefined, 
        from?: number, 
        to?: number
    ): Promise<DocumentData[]> {
        if (listId === undefined) {
            return []
        } 
        let params = null
        if (from && to) {
            params = {
                filters: {
                    type: 'and',
                    operator: 'and',
                    operands: [
                        {
                            type: 'gt',
                            leftOperand: {
                                type: 'field',
                                field: {
                                    type: 'Number',
                                    spFieldName: 'dtCreated'
                                }
                            },
                            rightOperand: {
                                type: 'value',
                                value: from
                            }
                        },
                        {
                            type: 'lt',
                            leftOperand: {
                                type: 'field',
                                field: {
                                    type: 'Number',
                                    spFieldName: 'dtCreated'
                                }
                            },
                            rightOperand: {
                                type: 'value',
                                value: to
                            }
                        }
                    ]
                },
                sorting: null,
                paging: { page: 0, rowsPerPage: 500, enableNext: true }
            }
        }
        const response = this.getListItems(listId, params)
        return response
    }
}

export default DocumentsApi
