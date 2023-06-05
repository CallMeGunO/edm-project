import React, { useContext, useState } from 'react'
import ReportCreationForm from '../../views/ReportCreationForm/ReportCreationForm'
import ReportResult from '../../views/ReportResult/ReportResult'
import edmPageHelper from '../../core/helpers/edmPageHelper'

import { Document, DocumentTypes } from '../../core/types/documents'

import styles from './EDMPage.css'
import FirebaseContext from '../../core/contexts/FirebaseContext'
import { getFirestore } from 'firebase/firestore/lite'

export const defaultFormData = {
    creationPeriod: [],
    documentType: [],
    user: [],
    status: [],
    counterParties: [],
    groupBy: '',
}

const allDocumentTypes = [DocumentTypes.CONTRACT, DocumentTypes.DOCUMENT, DocumentTypes.PROTOCOL]

const EDMPage: React.FC = () => {
    const [formData, setFormData] = useState<Record<string, any>>(defaultFormData)
    const [documents, setDocuments] = useState<Document[]>()
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [fileName, setFileName] = useState<string>()

    const { app } = useContext(FirebaseContext)
    const db = getFirestore(app)

    const onFinishHandler = async () => {
        setIsLoadingData(true)

        const from = structuredClone(formData.creationPeriod[0])
        const to = structuredClone(formData.creationPeriod[1])
        to.setDate(to.getDate() + 1)

        setFileName(
            `Отчет за период ${formData.creationPeriod[0].getDate()}.${
                formData.creationPeriod[0].getMonth() + 1
            }.${formData.creationPeriod[0].getFullYear()}-${formData.creationPeriod[1].getDate()}.${
                formData.creationPeriod[1].getMonth() + 1
            }.${formData.creationPeriod[1].getFullYear()}.xlsx`
        )
        edmPageHelper.getDocuments(db, from.getTime(), to.getTime()).then((response) => {
            setDocuments(response)

            setIsLoadingData(false)
        })
    }

    return (
        <div className={styles.edmPageContainer}>
            <ReportCreationForm
                formData={formData}
                setFormData={setFormData}
                onFinishHandler={onFinishHandler}
                isLoadingData={isLoadingData}
            />
            {documents && !isLoadingData && (
                <ReportResult
                    documents={documents}
                    docTypes={formData?.documentType.length === 0 ? allDocumentTypes : formData?.documentType}
                    users={formData?.user}
                    statuses={formData?.status}
                    counterParties={formData?.counterParties}
                    groupBy={formData?.groupBy}
                    fileName={fileName}
                />
            )}
        </div>
    )
}

export default EDMPage
