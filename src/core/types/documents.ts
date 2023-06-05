enum DocumentTypes {
    DOCUMENT = 'Документ',
    CONTRACT = 'Договор',
    PROTOCOL = 'Протокол',
    UNPROVIDED = '',
}

enum GroupBy {
    DOC_TYPE = 'Тип документа',
    USER = 'Пользователь',
    STATUS = 'Статус',
    COUNTER_PARTY = 'Контрагент',
}

interface Document {
    created: number
    type: DocumentTypes
    user: string
    status: string
    counterParty?: string
}

export {
    DocumentTypes, 
    Document, 
    GroupBy, 
}