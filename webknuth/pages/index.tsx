import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Dataset } from '../lib/types'


export default function Home() {
  const [datasets, setDatasets] = useState<Dataset[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'datasets'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dataset[]
      setDatasets(data)
    }

    fetchData()
  }, [])

  return (
    <main style={{ padding: 20 }}>
      <h1 className="text-2xl font-bold mb-6">Conjuntos:</h1>
      {datasets.length > 0 ? (
        <ul>
          {datasets.map((d) => (
            <li key={d.id}>
              <strong>{d.label}</strong> ({d.tipo}): {JSON.stringify(d.data)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Carregando dados...</p>
      )}
    </main>
  )
}
