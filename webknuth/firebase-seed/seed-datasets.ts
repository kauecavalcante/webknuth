
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const conjuntos = [
  { label: 'Conjunto 01', data: [5, 3, 8, 1, 4], tipo: 'bst' },
  { label: 'Conjunto 02', data: [10, 9, 8, 7, 6], tipo: 'lista' },
  { label: 'Conjunto 03', data: [23, 42, 4, 16, 8], tipo: 'hash' },
  { label: 'Conjunto 04', data: [2, 7, 11, 3, 5], tipo: 'bst' },
  { label: 'Conjunto 05', data: [33, 18, 14, 21, 30], tipo: 'avl' },
  { label: 'Conjunto 06', data: [1, 2, 3, 4, 5], tipo: 'lista' },
  { label: 'Conjunto 07', data: [100, 90, 80, 70, 60], tipo: 'hash' },
  { label: 'Conjunto 08', data: [9, 1, 6, 3, 7], tipo: 'bst' },
  { label: 'Conjunto 09', data: [55, 40, 65, 30, 50], tipo: 'avl' },
  { label: 'Conjunto 10', data: [13, 21, 34, 55, 89], tipo: 'lista' },
  { label: 'Conjunto 11', data: [17, 4, 6, 10, 2], tipo: 'hash' },
  { label: 'Conjunto 12', data: [10, 5, 15, 3, 7], tipo: 'bst' },
  { label: 'Conjunto 13', data: [25, 20, 30, 10, 22], tipo: 'avl' },
  { label: 'Conjunto 14', data: [6, 7, 8, 9, 10], tipo: 'lista' },
  { label: 'Conjunto 15', data: [70, 40, 50, 90, 20], tipo: 'bst' },
  { label: 'Conjunto 16', data: [3, 6, 9, 12, 15], tipo: 'lista' },
  { label: 'Conjunto 17', data: [7, 2, 9, 4, 1], tipo: 'bst' },
  { label: 'Conjunto 18', data: [40, 30, 50, 60, 20], tipo: 'avl' },
  { label: 'Conjunto 19', data: [5, 10, 15, 20, 25], tipo: 'lista' },
  { label: 'Conjunto 20', data: [12, 22, 32, 42, 52], tipo: 'hash' },
  { label: 'Conjunto 21', data: [60, 50, 70, 40, 80], tipo: 'bst' },
  { label: 'Conjunto 22', data: [1, 4, 9, 16, 25], tipo: 'lista' },
  { label: 'Conjunto 23', data: [11, 13, 17, 19, 23], tipo: 'bst' },
  { label: 'Conjunto 24', data: [2, 4, 6, 8, 10], tipo: 'lista' },
  { label: 'Conjunto 25', data: [100, 200, 300, 400, 500], tipo: 'hash' },
  { label: 'Conjunto 26', data: [90, 60, 30, 20, 10], tipo: 'avl' },
  { label: 'Conjunto 27', data: [8, 6, 4, 2, 0], tipo: 'lista' },
  { label: 'Conjunto 28', data: [12, 14, 16, 18, 20], tipo: 'bst' },
  { label: 'Conjunto 29', data: [19, 7, 5, 2, 1], tipo: 'avl' },
  { label: 'Conjunto 30', data: [3, 1, 4, 1, 5], tipo: 'hash' },
  { label: 'Conjunto 31', data: [100, 50, 25, 75, 150], tipo: 'bst' },
  { label: 'Conjunto 32', data: [33, 66, 99, 132, 165], tipo: 'lista' },
  { label: 'Conjunto 33', data: [18, 36, 72, 144, 288], tipo: 'hash' },
  { label: 'Conjunto 34', data: [8, 9, 10, 11, 12], tipo: 'lista' },
  { label: 'Conjunto 35', data: [7, 14, 21, 28, 35], tipo: 'avl' },
  { label: 'Conjunto 36', data: [15, 10, 5, 20, 25], tipo: 'bst' },
  { label: 'Conjunto 37', data: [44, 55, 66, 77, 88], tipo: 'hash' },
  { label: 'Conjunto 38', data: [5, 6, 7, 8, 9], tipo: 'lista' },
  { label: 'Conjunto 39', data: [3, 7, 11, 15, 19], tipo: 'bst' },
  { label: 'Conjunto 40', data: [2, 3, 5, 7, 11], tipo: 'avl' },
]

const seed = async () => {
  for (const item of conjuntos) {
    await addDoc(collection(db, 'datasets'), item)
    console.log(`Inserido: ${item.label}`)
  }
  console.log('inseridos com sucesso!')
}

seed()
