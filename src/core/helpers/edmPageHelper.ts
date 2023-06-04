import DocumentsApi from "../api/documentsApi"
import apiDataHelper from "./apiDataHelper"

import { DocumentData, Document, DocumentTypes, ContractTypes } from "../types/documents"

class EdmPageHelper {
    private allDocumentListsNames: DocumentTypes[] = [
        DocumentTypes.INTERNAL_DOCS,
        DocumentTypes.INPUT_DOCS,
        DocumentTypes.ATTORNEY,
        DocumentTypes.CONTRACTS,
        DocumentTypes.CONTRACTS_ATTACHMENTS,
        DocumentTypes.OUT_DOCS,
        DocumentTypes.MANAGERIAL_DOCS,
        DocumentTypes.PROTOCOL,
    ]
    
    async getDocumentsFromDocumentType (documentType: DocumentTypes, from?: number, to?: number) {
        let result: DocumentData[] = []
        let allContracts

        switch (documentType) {
            case DocumentTypes.INPUT_DOCS:
                result = await DocumentsApi.getDocumentsListsItems(
                    process.env.INPUT_DOCS_LIST_ID, 
                    from, 
                    to
                )
                break
            case DocumentTypes.INTERNAL_DOCS:
                result = await DocumentsApi.getDocumentsListsItems(
                    process.env.INTERNAL_DOCS_LIST_ID, 
                    from, 
                    to
                )
                break
            case DocumentTypes.ATTORNEY:
                result = await DocumentsApi.getDocumentsListsItems(
                    process.env.ATTORNEY_LIST_ID, 
                    from, 
                    to
                )
                break
            case DocumentTypes.CONTRACTS:
                allContracts = await DocumentsApi.getDocumentsListsItems(
                    process.env.CONTRACTS_LIST_ID, 
                    from, 
                    to
                )
                result = allContracts.filter((contract) => {
                    return contract.data.lovContractDocType === ContractTypes.CONTRACT
                })
                break
            case DocumentTypes.CONTRACTS_ATTACHMENTS:
                allContracts = await DocumentsApi.getDocumentsListsItems(
                    process.env.CONTRACTS_LIST_ID, 
                    from, 
                    to
                )
                result = allContracts.filter((contract) => {
                    return contract.data.lovContractDocType === ContractTypes.CONTRACTS_ATTACHMENTS
                })
                break
            case DocumentTypes.OUT_DOCS:
                result = await DocumentsApi.getDocumentsListsItems(
                    process.env.OUT_DOCS_LIST_ID, 
                    from, 
                    to
                )
                break
            case DocumentTypes.MANAGERIAL_DOCS:
                result = await DocumentsApi.getDocumentsListsItems(
                    process.env.MANAGERIAL_DOCS_LIST_ID, 
                    from, 
                    to
                )
                break
            case DocumentTypes.PROTOCOL:
                result = await DocumentsApi.getDocumentsListsItems(
                    process.env.PROTOCOL_LIST_ID, 
                    from, 
                    to
                )
                break
        }

        return apiDataHelper.parseDocumentDataToDocument(result)
    }

    public getDocumentsFromListOfDocumentNames = async (
        documentListNames?: DocumentTypes[], 
        from?: number, 
        to?: number
    ): Promise<Document[]> => {
        const listNames = documentListNames && (documentListNames.length > 0) 
            ? documentListNames 
            : this.allDocumentListsNames
        const documents: Document[] = []
        return Promise.all(
            listNames.map(async (docType: DocumentTypes) => {
                return await this.getDocumentsFromDocumentType(docType, from, to)
            })
        ).then((resutlts) => {
            resutlts.forEach((result: Document[]) => {
                documents.push(...result)
            })
            return documents
        })
    }
}

export default new EdmPageHelper()