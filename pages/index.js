import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { withAuth } from '../lib/withAuth'
import { subDays, startOfWeek, startOfMonth, startOfYear, isAfter, isBefore } from 'date-fns'
import { toDate } from 'date-fns-tz'
import { startOfDay, endOfDay } from 'date-fns'
import DatePicker from 'react-datepicker'
import PieChartPengeluaran from '../components/PieChartPengeluaran'
import EditModal from '../components/EditModal'
import { FaTrash, FaEdit } from 'react-icons/fa'
import 'react-datepicker/dist/react-datepicker.css'

function Dashboard() {
  const [isClient, setIsClient] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [filter, setFilter] = useState('today')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [selectedTx, setSelectedTx] = useState(null)
  const [editOpen, setEditOpen] = useState(false)

  const timeZone = 'Asia/Jakarta'

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const user_id = user?.id

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) return console.error(error)

    let start
    const now = new Date()

    switch (filter) {
      case 'today':
        start = startOfDay(now)
        break
      case 'week':
        start = startOfWeek(now)
        break
      case 'month':
        start = startOfMonth(now)
        break
      case 'year':
        start = startOfYear(now)
        break
      case 'custom':
        start = startDate
        break
      default:
        start = startOfDay(now)
    }

    const end = filter === 'custom' ? endDate : now
    const zonedStart = toDate(startOfDay(start), { timeZone })
    const zonedEnd = toDate(endOfDay(end), { timeZone })

    const filtered = data.filter((t) => {
      const created = new Date(t.created_at)
      return isAfter(created, zonedStart) && isBefore(created, zonedEnd)
    })

    setTransactions(filtered)

    const totalIncome = filtered
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0)

    const totalExpense = filtered
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)

    setIncome(totalIncome)
    setExpense(totalExpense)
  }

  useEffect(() => {
    fetchData()
  }, [filter, startDate, endDate])

  const formatRupiah = (num) =>
    num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })

  const now = new Date()

  const handleSaveEdit = async ({ amount, category, note, date }) => {
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: parseInt(amount),
        category,
        note,
        created_at: date.toISOString()
      })
      .eq('id', selectedTx.id)

    if (!error) {
      alert('Transaksi diperbarui!')
      setEditOpen(false)
      setSelectedTx(null)
      fetchData()
    } else {
      alert('Gagal update')
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Yakin ingin menghapus transaksi ini?')
    if (!confirm) return

    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (!error) {
      fetchData()
    } else {
      alert('Gagal hapus')
    }
  }

  if (!isClient) return null

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="mb-4 space-y-2">
        <label className="font-semibold">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded ml-2"
        >
          <option value="today">Hari Ini</option>
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
          <option value="year">Tahun Ini</option>
          <option value="custom">Custom Range</option>
        </select>

        <div className="text-sm text-gray-600">
          {filter === 'today' && `Tanggal: ${now.toLocaleDateString('id-ID')}`}
          {filter === 'week' && `Rentang: ${startOfWeek(now).toLocaleDateString('id-ID')} – ${now.toLocaleDateString('id-ID')}`}
          {filter === 'month' && `Bulan: ${now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`}
          {filter === 'year' && `Tahun: ${now.getFullYear()}`}
          {filter === 'custom' && (
            <span>
              Rentang: {startDate.toLocaleDateString('id-ID')} – {endDate.toLocaleDateString('id-ID')}
            </span>
          )}
        </div>

        {filter === 'custom' && (
          <div className="flex gap-4">
            <div>
              <label className="text-sm block">Dari:</label>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                maxDate={new Date()}
                className="p-2 border rounded"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <div>
              <label className="text-sm block">Sampai:</label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                minDate={startDate}
                maxDate={new Date()}
                className="p-2 border rounded"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm">Pemasukan</p>
          <p className="text-green-700 font-semibold">{formatRupiah(income)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm">Pengeluaran</p>
          <p className="text-red-700 font-semibold">{formatRupiah(expense)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm">Saldo</p>
          <p className="text-blue-700 font-semibold">{formatRupiah(income - expense)}</p>
        </div>
      </div>

      <div className="my-6">
        <h2 className="text-lg font-semibold mb-2">Distribusi Pengeluaran</h2>
        <PieChartPengeluaran data={transactions} />
      </div>

      <div className="mb-6 text-right">
        <a href="/input" className="text-blue-600 underline text-sm">+ Tambah Transaksi</a>
      </div>

      <h2 className="text-lg font-semibold mb-2">Histori Transaksi</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center mt-4">Tidak ada transaksi untuk filter ini.</p>
      ) : (
        <ul className="divide-y">
          {transactions.map((t) => (
            <li key={t.id} className="py-2 flex justify-between items-start">
              <div>
                <p className="font-medium">{t.category}</p>
                <p className="text-sm text-gray-600">{t.note}</p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatRupiah(t.amount)}
                </p>
                <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString('id-ID')}</p>
                <div className="flex justify-end gap-2 mt-1">
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => {
                      setSelectedTx(t)
                      setEditOpen(true)
                    }}
                  />
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDelete(t.id)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <EditModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setSelectedTx(null)
        }}
        transaction={selectedTx}
        onSave={handleSaveEdit}
      />
    </div>
  )
}

export default withAuth(Dashboard)
