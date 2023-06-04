import React, { useState, useEffect, ReactNode } from 'react'
import DocumentsApi from '../api/documentsApi'
import DepartmentsApi from '../api/departmentsApi'
import { Icon } from '@fluentui/react'

import { DocumentTypes, GroupBy } from '../types/documents'
import apiDataHelper from '../helpers/apiDataHelper'

export interface DropdownItem {
    label: string | ReactNode
    value: string
}

enum ListOfValuesFields {
    STATES = 'lovValidityState',
    STATUSES = 'lovStatus',
}

const useReportCreationForm = () => {
    const documentTypeData: DropdownItem[] = [
        {
            label: (
                <>
                    <Icon iconName="Inbox" /> Входящий документ
                </>
            ),
            value: DocumentTypes.INPUT_DOCS,
        },
        {
            label: (
                <>
                    <Icon iconName="PageLock" /> Внутренний документ
                </>
            ),
            value: DocumentTypes.INTERNAL_DOCS,
        },
        {
            label: (
                <>
                    <Icon iconName="VerifiedBrand" /> Доверенность
                </>
            ),
            value: DocumentTypes.ATTORNEY,
        },
        {
            label: (
                <>
                    <Icon iconName="Commitments" /> Договор
                </>
            ),
            value: DocumentTypes.CONTRACTS,
        },
        {
            label: (
                <>
                    <Icon iconName="Commitments" /> Приложение к договору
                </>
            ),
            value: DocumentTypes.CONTRACTS_ATTACHMENTS,
        },
        {
            label: (
                <>
                    <Icon iconName="Mail" /> Исходящий документ
                </>
            ),
            value: DocumentTypes.OUT_DOCS,
        },
        {
            label: (
                <>
                    <Icon iconName="Script" /> ОРД
                </>
            ),
            value: DocumentTypes.MANAGERIAL_DOCS,
        },
        {
            label: (
                <>
                    <Icon iconName="CheckList" /> Протокол
                </>
            ),
            value: DocumentTypes.PROTOCOL,
        },
    ]

    const groupByData: Record<GroupBy, DropdownItem> = {
        'Тип документа': {
            label: GroupBy.DOC_TYPE,
            value: GroupBy.DOC_TYPE,
        },
        'Подразделение исполнителя': {
            label: GroupBy.DEPARTMENT,
            value: GroupBy.DEPARTMENT,
        },
        Статус: {
            label: GroupBy.STATUS,
            value: GroupBy.STATUS,
        },
        Состояние: {
            label: GroupBy.STATE,
            value: GroupBy.STATE,
        },
        Контрагент: {
            label: GroupBy.COUNTER_PARTY,
            value: GroupBy.COUNTER_PARTY,
        },
    }

    const [departmentsData, setDepartmentsData] = useState<DropdownItem[]>()
    const [docStatusData, setDocStatusData] = useState<DropdownItem[]>()
    const [docStateData, setDocStateData] = useState<DropdownItem[]>()
    const [counterPartiesData, setCounterpartiesData] = useState<DropdownItem[]>()

    useEffect(() => {
        const fetchData = async () => {
            const counterPartiesItems = await DocumentsApi.getDocumentsListsItems(process.env.COUNTERPARTIES_DICT_ID)
            const departmentsItems = await DepartmentsApi.getDepartments()
            const ldapDepartmentsItems = await DepartmentsApi.getLdapDepartments()
            const allDeaprtmentsItems = [...departmentsItems, ...ldapDepartmentsItems]
            const uniqueDepartmentsItems = Array.from(new Set(allDeaprtmentsItems.map((item) => item.displayName)))
            const listsData = await DocumentsApi.getEntityLists()

            const mappedCounterPartiesItems = counterPartiesItems.map((item) => {
                return { label: item.data.strTitle, value: item.data.strTitle }
            })
            const mappedDepartmentsItems = uniqueDepartmentsItems.map((item) => {
                return { label: item, value: item }
            })
            const mappedStates = Array.from(
                apiDataHelper.getAvailableValuesOfFieldFromList(listsData, ListOfValuesFields.STATES)
            ).map((state) => {
                return { label: state, value: state }
            })
            const mappedStatuses = Array.from(
                apiDataHelper.getAvailableValuesOfFieldFromList(listsData, ListOfValuesFields.STATUSES)
            ).map((status) => {
                return { label: status, value: status }
            })

            setCounterpartiesData(mappedCounterPartiesItems)
            setDepartmentsData(mappedDepartmentsItems)
            setDocStateData(mappedStates)
            setDocStatusData(mappedStatuses)
        }
        fetchData()
    }, [])

    return {
        documentTypeData,
        departmentsData,
        docStatusData,
        docStateData,
        groupByData,
        counterPartiesData,
    }
}

export default useReportCreationForm
