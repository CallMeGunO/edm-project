import React, { useState, useEffect, ReactNode, useContext } from 'react'
import { Icon } from '@fluentui/react'
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite'
import { DocumentTypes, GroupBy } from '../types/documents'
import FirebaseContext from '../contexts/FirebaseContext'

export interface DropdownItem {
    label: string | ReactNode
    value: string
}

const useReportCreationForm = () => {
    const documentTypeData: DropdownItem[] = [
        {
            label: (
                <>
                    <Icon iconName="Inbox" /> Документ
                </>
            ),
            value: DocumentTypes.DOCUMENT,
        },
        {
            label: (
                <>
                    <Icon iconName="VerifiedBrand" /> Договор
                </>
            ),
            value: DocumentTypes.CONTRACT,
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
        Пользователь: {
            label: GroupBy.USER,
            value: GroupBy.USER,
        },
        Статус: {
            label: GroupBy.STATUS,
            value: GroupBy.STATUS,
        },
        Контрагент: {
            label: GroupBy.COUNTER_PARTY,
            value: GroupBy.COUNTER_PARTY,
        },
    }

    const [usersData, setUsersData] = useState<DropdownItem[]>()
    const [statusData, setStatusData] = useState<DropdownItem[]>()
    const [counterPartiesData, setCounterPartiesData] = useState<DropdownItem[]>()

    const { app } = useContext(FirebaseContext)
    const db = getFirestore(app)

    useEffect(() => {
        const firebaseFetch = async () => {
            const users = collection(db, 'users')
            const usersSnapshot = await getDocs(users)
            const usersItems = usersSnapshot.docs.map((doc) => {
                const data = doc.data()
                return { label: data.title, value: data.title }
            })
            setUsersData(usersItems)

            const status = collection(db, 'status')
            const statusSnapshot = await getDocs(status)
            const statusItems = statusSnapshot.docs.map((doc) => {
                const data = doc.data()
                return { label: data.title, value: data.title }
            })
            setStatusData(statusItems)

            const counterParty = collection(db, 'counterParty')
            const counterPartySnapshot = await getDocs(counterParty)
            const counterPartyItems = counterPartySnapshot.docs.map((doc) => {
                const data = doc.data()
                return { label: data.title, value: data.title }
            })
            setCounterPartiesData(counterPartyItems)
        }
        firebaseFetch()
    }, [])

    return {
        documentTypeData,
        usersData,
        statusData,
        counterPartiesData,
        groupByData,
    }
}

export default useReportCreationForm
