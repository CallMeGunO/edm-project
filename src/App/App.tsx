import React from 'react'
import EDMPage from '../pages/EDMPage/EDMPage'
import { initializeApp } from 'firebase/app'
import FirebaseContext from '../core/contexts/FirebaseContext'

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
}

const app = initializeApp(firebaseConfig)

const App: React.FC = () => {
    return (
        <div>
            <FirebaseContext.Provider value={{ app: app }}>
                <EDMPage />
            </FirebaseContext.Provider>
        </div>
    )
}

export default App
