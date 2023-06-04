import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/App'
import { initializeIcons } from '@fluentui/font-icons-mdl2'

import 'rsuite/dist/rsuite.min.css'
import './indexStaticStyles.css'

initializeIcons()

const ConfiguredApp = () => <App />
ReactDOM.render(<ConfiguredApp />, document.getElementById('edmpage'))
