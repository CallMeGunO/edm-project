import React, { useEffect, useState } from 'react'
import { ApexOptions } from 'apexcharts'
import ReactApexChart from 'react-apexcharts'

import styles from './RadialDiagram.css'

interface RadialDiagramProps {
    title?: string
    series: number[]
    categories: string[]
}

const RadialDiagram: React.FC<RadialDiagramProps> = ({ title, series, categories }) => {
    const [options, setOptions] = useState<ApexOptions>()

    useEffect(() => {
        setOptions({
            chart: {
                type: 'pie',
                width: 550,
            },
            labels: categories,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 450,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        })
    }, [categories])

    return (
        <div>
            {title && <div className={styles.title}>{title}</div>}
            {options && <ReactApexChart series={series} options={options} type="pie" width={550} />}
        </div>
    )
}

export default RadialDiagram
