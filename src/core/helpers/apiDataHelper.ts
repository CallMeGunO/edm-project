import { Document, DocumentData, DocumentTypes, ContractTypes } from "../types/documents"

interface ListField {
    fieldName: string
    restriction: {
        listOfValuesStatic: string[]
    }
}

interface ListData {
    id: string
    entityMetadata: {
        fields: ListField[]
    }
}

class ApiDataHelper {
    private allListIds = [
        process.env.INTERNAL_DOCS_LIST_ID,
        process.env.INPUT_DOCS_LIST_ID,
        process.env.ATTORNEY_LIST_ID,
        process.env.CONTRACTS_LIST_ID,
        process.env.OUT_DOCS_LIST_ID,
        process.env.MANAGERIAL_DOCS_LIST_ID,
        process.env.PROTOCOL_LIST_ID,
    ]

    parseDocumentDataToDocument(documents: DocumentData[]): Document[] {
        const getDepartment = (document: DocumentData): string => {
            return document.entityId === process.env.INPUT_DOCS_LIST_ID 
                ? document.data.orgRegistrarUnit[0].title
                : document.data.orgPerformerUnit[0].title
        }

        const getDocType = (document: DocumentData): DocumentTypes => {
            switch (document.entityId) {
                case process.env.INTERNAL_DOCS_LIST_ID:
                    return DocumentTypes.INTERNAL_DOCS
                case process.env.INPUT_DOCS_LIST_ID:
                    return DocumentTypes.INPUT_DOCS
                case process.env.ATTORNEY_LIST_ID:
                    return DocumentTypes.ATTORNEY
                case process.env.CONTRACTS_LIST_ID:
                    return document.data.lovContractDocType === ContractTypes.CONTRACT
                        ? DocumentTypes.CONTRACTS
                        : DocumentTypes.CONTRACTS_ATTACHMENTS
                case process.env.OUT_DOCS_LIST_ID:
                    return DocumentTypes.OUT_DOCS
                case process.env.MANAGERIAL_DOCS_LIST_ID:
                    return DocumentTypes.MANAGERIAL_DOCS
                case process.env.PROTOCOL_LIST_ID:
                    return DocumentTypes.PROTOCOL
                default:
                    return DocumentTypes.UNPROVIDED
            }
        }

        const getDocState = (document: DocumentData): string | undefined => {
            if (
                document.entityId === process.env.CONTRACTS_LIST_ID || 
                document.entityId === process.env.MANAGERIAL_DOCS_LIST_ID || 
                document.entityId === process.env.ATTORNEY_LIST_ID
            ) {
                return document.data.lovValidityState
            }
            return '-'
        }

        const getCounterParty = (document: DocumentData): string | undefined => {
            if (document.entityId === process.env.CONTRACTS_LIST_ID && document.data.lupCounterparty) {
                return document.data.lupCounterparty[0].data.strTitle
            }
            return '-'
        }

        const getSumm = (document: DocumentData): string | number | undefined => {
            if (
                document.entityId === process.env.CONTRACTS_LIST_ID && 
                document.data.lovContractDocType === 'Договор'
            ) {
                return document.data?.numTotalAmount || 0
            }
            return '-'
        }

        const mappedData = documents.map((document): Document => {
            return {
                docDepartment: getDepartment(document),
                docType: getDocType(document),
                docStatus: document.data.lovStatus,
                docState: getDocState(document),
                docCounterParty: getCounterParty(document),
                docSumm: getSumm(document)
            }
        }).sort((a, b) => a.docDepartment.localeCompare(b.docDepartment))

        return mappedData
    }

    getDocumentsTypes(documents: Document[]): DocumentTypes[] {
        return Array.from(new Set(documents.map((document) => document.docType)))
    }

    getAvailableValuesOfFieldFromList(lists: ListData[], fieldName: string): Set<string> {
        const edmLists = lists.filter((list) => {
            return this.allListIds.includes(list.id)
        })

        const docStates: string[] = []

        edmLists.forEach((list) => {
            const docStateField = list.entityMetadata.fields.find(
                (field) => field.fieldName === fieldName
            )
            if (docStateField) {
                docStates.push(...docStateField.restriction.listOfValuesStatic)
            }
        })

        return new Set(docStates)
    }
}

export default new ApiDataHelper()