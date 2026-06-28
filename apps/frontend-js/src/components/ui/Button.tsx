import { type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const base = 'rounded-full font-semibold transition-all duration-150 active:scale-95 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed'

const variants = {
  primary:   'bg-gray-900 text-white hover:bg-gray-700',
  secondary: 'border border-gray-200 text-gray-500 font-medium hover:bg-gray-50',
}

const sizes = {
  sm: 'py-1.5 px-4 text-sm',
  md: 'py-2.5 px-5',
  lg: 'py-3 px-6 text-base',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
