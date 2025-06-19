export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'customer' | 'sale'
  createdAt: Date
  updatedAt?: Date | null
}
