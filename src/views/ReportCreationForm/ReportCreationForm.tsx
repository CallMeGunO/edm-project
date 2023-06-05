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

    const {
        documentTypeData,
        usersData,
        statusData,
        counterPartiesData: counterPartiesData,
        groupByData,
    } = useReportCreationForm()

    const [documentTypes, setDocumentTypes] = useState<string[]>([])

    const [users, setUsers] = useState<string[]>([])
    const allUsers = usersData?.map((user) => user.value) || []

    const [statuses, setStatuses] = useState<string[]>([])
    const allStatuses = statusData?.map((status) => status.value) || []

    const [counterParties, setCounterParties] = useState<string[]>([])
    const allCounterParties = counterPartiesData?.map((counterParty) => counterParty.value) || []

    const getGroupByData = () => {
        const newGroupData: DropdownItem[] = [groupByData[GroupBy.DOC_TYPE]]
        if (formData?.user?.length > 0) {
            newGroupData.push(groupByData[GroupBy.USER])
        }
        if (formData?.status?.length > 0) {
            newGroupData.push(groupByData[GroupBy.STATUS])
        }
        if (formData?.counterParties?.length > 0) {
            newGroupData.push(groupByData[GroupBy.COUNTER_PARTY])
        }
        return newGroupData
    }

    const handleSelectedDocumentTypesChanged = (values: string[]) => {
        if (!values.includes(DocumentTypes.CONTRACT)) {
            setCounterParties([])
            formData.counterParties = []
            checkGroupByCaseAndClear(GroupBy.COUNTER_PARTY)
        }
        setDocumentTypes(values)
        setFormData({ ...formData, documentType: values })
    }

    const handleCheckUsersAll = (_: unknown, checked: boolean) => {
        const value = checked ? allUsers : []
        setUsers(value)
        setFormData({ ...formData, user: value })
    }

    const handleCheckDocStatusesAll = (_: unknown, checked: boolean) => {
        const value = checked ? allStatuses : []
        setStatuses(value)
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
        setUsers([])
        setStatuses([])
        setCounterParties([])
    }

    const checkGroupByCaseAndClear = (group: GroupBy) => {
        if (formData.groupBy === group) {
            formData.groupBy = undefined
        }
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
                            user: users,
                            status: statuses,
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
                    <Form.Group controlId="user">
                        <Form.ControlLabel classPrefix="report-creation-form-label">Пользователь</Form.ControlLabel>
                        {usersData ? (
                            <Form.Control
                                classPrefix="report-creation-form-control"
                                name="user"
                                accepter={CheckPicker}
                                data={usersData}
                                value={users}
                                onChange={(value) => {
                                    setUsers(value)
                                    if (value.length === 0) {
                                        checkGroupByCaseAndClear(GroupBy.USER)
                                    }
                                    setFormData({ ...formData, user: value })
                                }}
                                renderExtraFooter={() => (
                                    <div>
                                        <Checkbox
                                            indeterminate={users.length > 0 && users.length < allUsers.length}
                                            checked={users.length === allUsers?.length}
                                            onChange={handleCheckUsersAll}
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
                        {statusData ? (
                            <Form.Control
                                classPrefix="report-creation-form-control"
                                name="status"
                                accepter={CheckPicker}
                                data={statusData}
                                value={statuses}
                                onChange={(value) => {
                                    setStatuses(value)
                                    if (value.length === 0) {
                                        checkGroupByCaseAndClear(GroupBy.STATUS)
                                    }
                                    setFormData({ ...formData, status: value })
                                }}
                                renderExtraFooter={() => (
                                    <div>
                                        <Checkbox
                                            indeterminate={statuses.length > 0 && statuses.length < allStatuses.length}
                                            checked={statuses.length === allStatuses?.length}
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
                    {formData?.documentType?.includes(DocumentTypes.CONTRACT) && (
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
