import React from 'react'
import ReactApexChart from 'react-apexcharts'

import styles from './HorizontalBar.css'
import { ApexOptions } from 'apexcharts'

interface HorizontalBarProps {
    title?: string
    series: number[]
    categories: string[]
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ title, series, categories }) => {
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            },
        },
        xaxis: {
            categories: categories,
        },
        legend: {},
    }

    return (
        <div>
            {title && <div className={styles.title}>{title}</div>}
            <ReactApexChart series={[{ data: series, name: 'Всего' }]} options={options} type="bar" height={350} />
        </div>
    )
}

export default HorizontalBar
