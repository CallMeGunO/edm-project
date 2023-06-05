import { FirebaseApp } from 'firebase/app'
import { createContext } from 'react'

interface FirebaseContextProps {
    app: FirebaseApp
}

const defaultState: FirebaseContextProps = {
    app: {
        name: 'default',
        options: {},
        automaticDataCollectionEnabled: false,
    }
}

const FirebaseContext = createContext<FirebaseContextProps>(defaultState)

export default FirebaseContext