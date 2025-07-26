
import './App.css'
import './index.css'
import { FiUser, FiSearch } from "react-icons/fi";
import { BsBell, BsCalendarEvent } from "react-icons/bs";


function App() {

  return (
    <>
      <div className="min-h-screen bg-[#f3f5f9] p-6 font-sans text-[#1f1f1f]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xl font-bold text-[#1c1c1e] flex items-center gap-2">
          <BsBell className="text-indigo-600" /> App Atlas
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              className="w-60 pl-10 pr-3 py-2 rounded-xl bg-white shadow-sm"
              placeholder="Search"
            />
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            <FiUser className="text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Event Coordination */}
        <div className="col-span-1 bg-white p-4 rounded-2xl shadow">
          <div className="space-y-2">
            <div className="font-medium text-sm text-gray-500 flex items-center gap-1">
              <BsCalendarEvent /> Event Coordination
            </div>
            <div className="text-lg font-semibold text-gray-800">Sion Canpses</div>
            <div className="text-xs text-gray-400">Motistemos</div>
            <div className="text-sm mt-3">10nip</div>
            <button className="w-full mt-4 rounded-xl border border-gray-300 py-2 text-sm">More</button>
          </div>
        </div>

        {/* Notification Card */}
        <div className="col-span-1 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl shadow p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xs font-bold">S</div>
              <span className="text-sm font-medium">Subopise</span>
            </div>
            <span className="text-xs">SAT</span>
          </div>
          <h2 className="text-xl font-bold mt-4 mb-1">Notification</h2>
          <div className="text-sm space-y-1">
            <p>Eusent</p>
            <p>Proessor Statur</p>
            <p>Absent</p>
          </div>
          <button className="mt-4 w-full bg-white text-indigo-600 font-semibold hover:bg-gray-200 rounded-xl py-2">
            Present
          </button>
        </div>

        {/* Notification Details */}
        <div className="col-span-2 grid grid-cols-2 gap-5">
          <div className="rounded-2xl p-4 shadow bg-white">
            <h3 className="text-md font-semibold mb-2">Real Time Upatus</h3>
            <p className="text-sm text-gray-600">Real deur stams incho present</p>
            <div className="mt-2 flex gap-2">
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Present</span>
              <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs">Absent</span>
            </div>
          </div>

          <div className="rounded-2xl p-4 shadow bg-white">
            <h3 className="text-md font-semibold mb-2">Attendance</h3>
            <p className="text-sm text-gray-600">Real deand Flodeshand Redents Lecturs</p>
          </div>
        </div>

        {/* Stuotion */}
        <div className="col-span-1 bg-white p-4 rounded-2xl shadow">
          <h3 className="text-md font-semibold mb-3">Stuotion</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Euents</li>
            <li>Attendance</li>
            <li>Attendent</li>
          </ul>
          <button className="mt-4 w-full bg-indigo-600 text-white rounded-xl py-2 text-sm">Subreens</button>
        </div>

        {/* Timetable */}
        <div className="col-span-2 bg-white p-4 rounded-2xl shadow">
          <h3 className="text-md font-semibold mb-4">Timetable</h3>
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium">Professor</p>
              <p className="text-xs text-gray-500">20 m</p>
            </div>
            <div>
              <p className="text-sm font-medium">Proswsisce</p>
              <p className="text-xs text-gray-500">10 m</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-span-1 bg-white p-4 rounded-2xl shadow">
          <h3 className="text-md font-semibold mb-2">Notifications</h3>
          <p className="text-sm text-gray-500">More</p>
        </div>
      </div>
    </div>
      
    </>
  )
}

export default App
