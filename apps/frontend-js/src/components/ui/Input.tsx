import { type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: Props) {
  return (
    <input
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-400 placeholder:font-normal ${className}`}
      {...props}
    />
  )
}
