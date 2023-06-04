enum DocumentTypes {
    INTERNAL_DOCS = 'Внутренние документы',
    INPUT_DOCS = 'Входящие документы',
    ATTORNEY = 'Доверенности',
    CONTRACTS = 'Договоры',
    CONTRACTS_ATTACHMENTS = 'Приложения к договорам',
    OUT_DOCS = 'Исходящие документы',
    MANAGERIAL_DOCS = 'ОРД',
    PROTOCOL = 'Протоколы',
    UNPROVIDED = ''
}

enum GroupBy {
    DOC_TYPE = 'Тип документа',
    DEPARTMENT = 'Подразделение исполнителя',
    STATUS = 'Статус',
    STATE = 'Состояние',
    COUNTER_PARTY = 'Контрагент',
}

enum ContractTypes {
    CONTRACT = 'Договор',
    CONTRACTS_ATTACHMENTS = 'Приложение к договору'
}

interface Department {
    displayName: string
    href: string 
    id: string
    title: string
    type: string
}

interface CounterParty {
    data: {
        strTitle: string
    }
    displayName: string
}

interface DocumentData {
    entityId: string
    data: {
        dtCreated: number
        orgPerformerUnit: Department[]
        orgRegistrarUnit: Department[]
        lovStatus: string
        lovValidityState?: string
        lupCounterparty?: CounterParty[]
        numTotalAmount?: number
        lovContractDocType?: string
        strTitle: string
    }
}

interface Document {
    docDepartment: string
    docType: DocumentTypes
    docStatus: string
    docState?: string
    docCounterParty?: string
    docSumm?: number | string
}

export {
    DocumentTypes, 
    Department, 
    DocumentData, 
    Document, 
    GroupBy, 
    ContractTypes
}