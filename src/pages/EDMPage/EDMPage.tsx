import React, { useState } from 'react'
import ReportCreationForm from '../../views/ReportCreationForm/ReportCreationForm'
import ReportResult from '../../views/ReportResult/ReportResult'
import apiDataHelper from '../../core/helpers/apiDataHelper'
import edmPageHelper from '../../core/helpers/edmPageHelper'

import { Document, DocumentTypes } from '../../core/types/documents'

import styles from './EDMPage.css'

export const defaultFormData = {
    creationPeriod: [],
    documentType: [],
    department: [],
    status: [],
    state: [],
    counterParties: [],
    groupBy: '',
}

const EDMPage: React.FC = () => {
    const [formData, setFormData] = useState<Record<string, any>>(defaultFormData)
    const [documents, setDocuments] = useState<Document[]>()
    const [documentTypes, setDocumentTypes] = useState<DocumentTypes[]>([])
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [fileName, setFileName] = useState<string>()

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
        edmPageHelper
            .getDocumentsFromListOfDocumentNames(formData?.documentType, from.getTime(), to.getTime())
            .then((response) => {
                const documentTypes = apiDataHelper.getDocumentsTypes(response)
                setDocumentTypes(documentTypes)
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
                    docTypes={documentTypes}
                    docDepartments={formData?.department}
                    docStatuses={formData?.status}
                    docStates={formData?.state}
                    docCounterParties={formData?.counterParties}
                    groupBy={formData?.groupBy}
                    fileName={fileName}
                />
            )}
        </div>
    )
}

export default EDMPage
