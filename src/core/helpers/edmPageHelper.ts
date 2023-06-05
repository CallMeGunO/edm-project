import { Document } from "../types/documents"
import { Firestore, collection, getDocs } from "firebase/firestore/lite"

class EdmPageHelper {
    public getDocuments = async (db: Firestore,  from: number, to: number): Promise<Document[]> => {
        const documents = collection(db, 'documents')
        const documentsSnapshot = await getDocs(documents)
        const documentsItems = documentsSnapshot.docs.map((doc) => doc.data() as Document)
        return documentsItems.filter((doc) => doc.created > from && doc.created < to)
    }
}

export default new EdmPageHelper()