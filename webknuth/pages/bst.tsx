import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Dataset } from '../lib/types'
import BSTTree from '../components/BSTTree'

export default function BSTPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [selected, setSelected] = useState<Dataset | null>(null)

  useEffect(() => {
    const fetchDatasets = async () => {
      const q = query(collection(db, 'datasets'), where('tipo', '==', 'bst'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dataset[]
      setDatasets(data)
    }

    fetchDatasets()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Árvore Binária de Busca (BST)
        </h1>

        {!selected ? (
          <div>
            <p className="mb-4 text-gray-700 text-lg text-center">Escolha um conjunto para visualizar:</p>
            <ul className="space-y-3">
              {datasets.map(ds => (
                <li key={ds.id} className="text-center">
                  <button
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    onClick={() => setSelected(ds)}
                  >
                    {ds.label} → [{ds.data.join(', ')}]
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">{selected.label}</h2>
              <p className="text-sm text-gray-500">[{selected.data.join(', ')}]</p>
            </div>

            <div className="flex justify-center overflow-auto">
              <BSTTree values={selected.data} />
            </div>

            <div className="text-center">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => setSelected(null)}
              >
                Limpar Visualização
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
