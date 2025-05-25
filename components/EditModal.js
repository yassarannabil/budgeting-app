import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function EditModal({ open, onClose, transaction, onSave }) {
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount)
      setCategory(transaction.category)
      setNote(transaction.note || '')
      setDate(new Date(transaction.created_at))
    }
  }, [transaction])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Edit Transaksi</h2>

        <input
          type="number"
          className="w-full mb-2 p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nominal"
        />

        <input
          type="text"
          className="w-full mb-2 p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kategori"
        />

        <input
          type="text"
          className="w-full mb-2 p-2 border rounded"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Catatan"
        />

        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          showTimeSelect
          className="w-full mb-4 p-2 border rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
          <button
            onClick={() => {
              if (!amount || isNaN(amount)) {
                alert("Nominal tidak valid!")
                return
              }
              onSave({ amount, category, note, date })
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}