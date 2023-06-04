import React, { Dispatch, SetStateAction, useState } from 'react'
import {
    CheckPicker,
    DateRangePicker,
    Form,
    InputPicker,
    ButtonToolbar,
    Button,
    Loader,
    Whisper,
    Popover,
    Checkbox,
    CustomProvider,
} from 'rsuite'
import { defaultFormData } from '../../pages/EDMPage/EDMPage'
import useReportCreationForm, { DropdownItem } from '../../core/hooks/useReportCreationForm'
import { subDays } from 'date-fns'

import ru_RU from 'rsuite/locales/ru_RU'
import { DocumentTypes, GroupBy } from '../../core/types/documents'

import styles from './ReportCreationForm.css'
import './ReportCreationFormStaticStyles.css'

interface ReportCreationFormProps {
    formData: Record<string, any>
    setFormData: Dispatch<SetStateAction<Record<string, any>>>
    onFinishHandler: () => void
    isLoadingData?: boolean
}

const ReportCreationForm: React.FC<ReportCreationFormProps> = ({ formData, setFormData, onFinishHandler, isLoadingData }) => {
    const NecessarilyFieldPopover = <Popover>Обязательно поле</Popover>

    const { documentTypeData, departmentsData, docStateData, docStatusData, counterPartiesData, groupByData } =
        useReportCreationForm()

    const [documentTypes, setDocumentTypes] = useState<string[]>([])

    const [departments, setDepartments] = useState<string[]>([])
    const allDepartments = departmentsData?.map((department) => department.value) || []

    const [docStatuses, setDocStatuses] = useState<string[]>([])
    const allDocStatuses = docStatusData?.map((docStatus) => docStatus.value) || []

    const [docStates, setDocStates] = useState<string[]>([])

    const [counterParties, setCounterParties] = useState<string[]>([])
    const allCounterParties = counterPartiesData?.map((counterParty) => counterParty.value) || []

    const getGroupByData = () => {
        const newGroupData: DropdownItem[] = [groupByData[GroupBy.DOC_TYPE]]
        if (formData?.department?.length > 0) {
            newGroupData.push(groupByData[GroupBy.DEPARTMENT])
        }
        if (formData?.status?.length > 0) {
            newGroupData.push(groupByData[GroupBy.STATUS])
        }
        if (formData?.state?.length > 0) {
            newGroupData.push(groupByData[GroupBy.STATE])
        }
        if (formData?.counterParties?.length > 0) {
            newGroupData.push(groupByData[GroupBy.COUNTER_PARTY])
        }
        return newGroupData
    }

    const handleCheckDepartmentsAll = (_: unknown, checked: boolean) => {
        const value = checked ? allDepartments : []
        setDepartments(value)
        setFormData({ ...formData, department: value })
    }

    const handleCheckDocStatusesAll = (_: unknown, checked: boolean) => {
        const value = checked ? allDocStatuses : []
        setDocStatuses(value)
        setFormData({ ...formData, status: value })
    }

    const handleCheckCounterPartiesAll = (_: unknown, checked: boolean) => {
        const value = checked ? allCounterParties : []
        setCounterParties(value)
        setFormData({ ...formData, counterParties: value })
    }

    const clearHandler = () => {
        setFormData(defaultFormData)
        setDocumentTypes([])
        setDepartments([])
        setDocStatuses([])
        setCounterParties([])
        setDocStates([])
    }

    const checkGroupByCaseAndClear = (group: GroupBy) => {
        if (formData.groupBy === group) {
            formData.groupBy = undefined
        }
    }

    const handleSelectedDocumentTypesChanged = (values: string[]) => {
        if (!values.includes(DocumentTypes.CONTRACTS || DocumentTypes.CONTRACTS_ATTACHMENTS)) {
            setCounterParties([])
            formData.counterParties = []
            checkGroupByCaseAndClear(GroupBy.COUNTER_PARTY)
        }

        if (
            !values.includes(DocumentTypes.CONTRACTS) ||
            !values.includes(DocumentTypes.CONTRACTS_ATTACHMENTS) ||
            !values.includes(DocumentTypes.MANAGERIAL_DOCS) ||
            !values.includes(DocumentTypes.ATTORNEY)
        ) {
            setDocStates([])
            formData.state = []
            checkGroupByCaseAndClear(GroupBy.STATE)
        }
        setDocumentTypes(values)
        setFormData({ ...formData, documentType: values })
    }

    return (
        <div className={styles.reportFormContainer}>
            {isLoadingData && (
                <div className={styles.loaderMask}>
                    <Loader size="lg" />
                </div>
            )}
            <CustomProvider locale={ru_RU}>
                <Form
                    onChange={(value) => {
                        console.table(value)
                        setFormData({
                            ...value,
                            documentType: documentTypes,
                            department: departments,
                            status: docStatuses,
                            state: docStates,
                            counterParties: counterParties,
                        })
                    }}
                    formValue={formData}
                    formDefaultValue={defaultFormData}
                    classPrefix="report-creation-form"
                >
                    <Form.Group controlId="creationPeriod">
                        <Form.ControlLabel classPrefix="report-creation-form-label">
                            Период создания
                            <Whisper placement="auto" trigger="hover" speaker={NecessarilyFieldPopover}>
                                <span className={styles.activeText}>*</span>
                            </Whisper>
                        </Form.ControlLabel>
                        <Form.Control
                            isoWeek={true}
                            classPrefix="report-creation-form-control"
                            name="creationPeriod"
                            accepter={DateRangePicker}
                            format="dd.MM.yyyy"
                            ranges={[
                                {
                                    label: 'Последние 7 дней',
                                    value: [subDays(new Date(), 6), new Date()],
                                },
                                {
                                    label: 'Последние 30 дней',
                                    value: [subDays(new Date(), 29), new Date()],
                                },
                            ]}
                            placeholder="Период создания"
                            character="-"
                        />
                    </Form.Group>
                    <Form.Group controlId="documentType">
                        <Form.ControlLabel classPrefix="report-creation-form-label">Тип документа</Form.ControlLabel>
                        <Form.Control
                            classPrefix="report-creation-form-control"
                            name="documentType"
                            accepter={CheckPicker}
                            data={documentTypeData}
                            value={documentTypes}
                            onChange={(value) => {
                                handleSelectedDocumentTypesChanged(value)
                            }}
                        />
                    </Form.Group>
                    <Form.Group controlId="department">
                        <Form.ControlLabel classPrefix="report-creation-form-label">Подразделение</Form.ControlLabel>
                        {departmentsData ? (
                            <Form.Control
                                classPrefix="report-creation-form-control"
                                name="department"
                                accepter={CheckPicker}
                                data={departmentsData}
                                value={departments}
                                onChange={(value) => {
                                    setDepartments(value)
                                    if (value.length === 0) {
                                        checkGroupByCaseAndClear(GroupBy.DEPARTMENT)
                                    }
                                    setFormData({ ...formData, department: value })
                                }}
                                renderExtraFooter={() => (
                                    <div>
                                        <Checkbox
                                            indeterminate={departments.length > 0 && departments.length < allDepartments.length}
                                            checked={departments.length === allDepartments?.length}
                                            onChange={handleCheckDepartmentsAll}
                                        >
                                            Выбрать все
                                        </Checkbox>
                                    </div>
                                )}
                            />
                        ) : (
                            <Loader />
                        )}
                    </Form.Group>
                    <Form.Group controlId="status">
                        <Form.ControlLabel classPrefix="report-creation-form-label">Статус</Form.ControlLabel>
                        {docStatusData ? (
                            <Form.Control
                                classPrefix="report-creation-form-control"
                                name="status"
                                accepter={CheckPicker}
                                data={docStatusData}
                                value={docStatuses}
                                onChange={(value) => {
                                    setDocStatuses(value)
                                    if (value.length === 0) {
                                        checkGroupByCaseAndClear(GroupBy.STATUS)
                                    }
                                    setFormData({ ...formData, status: value })
                                }}
                                renderExtraFooter={() => (
                                    <div>
                                        <Checkbox
                                            indeterminate={docStatuses.length > 0 && docStatuses.length < allDocStatuses.length}
                                            checked={docStatuses.length === allDocStatuses?.length}
                                            onChange={handleCheckDocStatusesAll}
                                        >
                                            Выбрать все
                                        </Checkbox>
                                    </div>
                                )}
                            />
                        ) : (
                            <Loader />
                        )}
                    </Form.Group>
                    {(formData?.documentType?.includes(DocumentTypes.CONTRACTS) ||
                        formData?.documentType?.includes(DocumentTypes.CONTRACTS_ATTACHMENTS) ||
                        formData?.documentType?.includes(DocumentTypes.MANAGERIAL_DOCS) ||
                        formData?.documentType?.includes(DocumentTypes.ATTORNEY)) && (
                        <>
                            <Form.Group controlId="state">
                                <Form.ControlLabel classPrefix="report-creation-form-label">Состояние</Form.ControlLabel>
                                {docStateData ? (
                                    <Form.Control
                                        classPrefix="report-creation-form-control"
                                        name="state"
                                        accepter={CheckPicker}
                                        data={docStateData}
                                        value={docStates}
                                        onChange={(value) => {
                                            setDocStates(value)
                                            if (value.length === 0) {
                                                checkGroupByCaseAndClear(GroupBy.STATE)
                                            }
                                            setFormData({ ...formData, state: value })
                                        }}
                                    />
                                ) : (
                                    <Loader />
                                )}
                            </Form.Group>
                        </>
                    )}
                    {(formData?.documentType?.includes(DocumentTypes.CONTRACTS) ||
                        formData?.documentType?.includes(DocumentTypes.CONTRACTS_ATTACHMENTS)) && (
                        <>
                            <Form.Group controlId="counterParties">
                                <Form.ControlLabel classPrefix="report-creation-form-label">Контрагент</Form.ControlLabel>
                                {counterPartiesData ? (
                                    <Form.Control
                                        classPrefix="report-creation-form-control"
                                        name="counterParties"
                                        accepter={CheckPicker}
                                        data={counterPartiesData}
                                        value={counterParties}
                                        onChange={(value) => {
                                            setCounterParties(value)
                                            if (value.length === 0) {
                                                checkGroupByCaseAndClear(GroupBy.COUNTER_PARTY)
                                            }
                                            setFormData({ ...formData, counterParties: value })
                                        }}
                                        renderExtraFooter={() => (
                                            <div>
                                                <Checkbox
                                                    indeterminate={
                                                        counterParties.length > 0 &&
                                                        counterParties.length < allCounterParties.length
                                                    }
                                                    checked={counterParties.length === allCounterParties?.length}
                                                    onChange={handleCheckCounterPartiesAll}
                                                >
                                                    Выбрать все
                                                </Checkbox>
                                            </div>
                                        )}
                                    />
                                ) : (
                                    <Loader />
                                )}
                            </Form.Group>
                        </>
                    )}
                    <Form.Group controlId="groupBy">
                        <Form.ControlLabel classPrefix="report-creation-form-label">Группировать по</Form.ControlLabel>
                        <Form.Control
                            classPrefix="report-creation-form-control"
                            name="groupBy"
                            creatable
                            accepter={InputPicker}
                            data={getGroupByData()}
                        />
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button
                                appearance="primary"
                                onClick={onFinishHandler}
                                disabled={formData?.creationPeriod?.length === 0}
                            >
                                Сформировать отчет
                            </Button>
                            <Button onClick={clearHandler}>Сбросить</Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </CustomProvider>
        </div>
    )
}

export default ReportCreationForm
