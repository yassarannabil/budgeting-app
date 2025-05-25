import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function InputPage() {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [time, setTime] = useState(new Date())

  const categories = [
    'food', 'transport', 'entertainment', 'shopping',
    'bills', 'salary', 'others'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const { data: { user } } = await supabase.auth.getUser()
    const user_id = user?.id
  
    if (!user_id) {
      alert('Harap login terlebih dahulu.')
      return
    }
  
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      time.getHours(),
      time.getMinutes()
    )
  
    const { error } = await supabase.from('transactions').insert([
      {
        user_id,
        type,
        category,
        amount: parseInt(amount),
        note,
        created_at: date.toISOString()
      }
    ])
  
    if (error) {
      alert('Gagal menyimpan transaksi.')
    } else {
      alert('Transaksi berhasil disimpan!')
      setAmount('')
      setCategory('')
      setNote('')
      setSelectedDate(new Date())
      setTime(new Date())
    }
  }  

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Input Transaksi</h1>

      <div className="flex gap-4 mb-4">
        <button
          className={`w-full p-2 rounded ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          className={`w-full p-2 rounded ${type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setType('income')}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Catatan / Keterangan"
          className="w-full p-2 border rounded"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-4">
          <div>
            <label className="block text-sm mb-1">Tanggal:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="p-2 border rounded"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Waktu:</label>
            <DatePicker
              selected={time}
              onChange={(time) => setTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="Jam"
              dateFormat="HH:mm"
              className="p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Simpan Transaksi
        </button>
        <button
            className="text-sm underline text-red-600 mb-4"
            onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = '/auth'
            }}
        >
            Logout
        </button>
      </form>
    </div>
  )
}

import { withAuth } from '../lib/withAuth'
export default withAuth(InputPage)
