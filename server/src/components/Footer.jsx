import React from 'react'
import { FaHeart } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-24 text-center text-sm text-gray-600">
      <p>
        Created with lots of love{' '}
        <FaHeart className="inline text-red-500 mb-1" /> by{' '}
        <a
          href="mailto:himanigarg998@gmail.com"
          className="text-blue-600 hover:underline"
        >
          Himanigarg
        </a>
        <span> & </span>
        <a
          href="mailto:bajpaikrati59@gmail.com"
          className="text-blue-600 hover:underline"
        >
          Krati Bajpai
        </a>
      </p>
    </footer>
  )
}

export default Footer
