declare global {
    namespace NodeJS {
        interface ProcessEnv {
            INTERNAL_DOCS_LIST_ID?: string
            INPUT_DOCS_LIST_ID?: string
            ATTORNEY_LIST_ID?: string
            CONTRACTS_LIST_ID?: string
            OUT_DOCS_LIST_ID?: string 
            MANAGERIAL_DOCS_LIST_ID?: string
            PROTOCOL_LIST_ID?: string
            COUNTERPARTIES_DICT_ID?: string
        }
    }
}

export {}