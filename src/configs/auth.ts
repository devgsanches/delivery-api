interface AuthConfig {
  jwt: {
    secret: string
    expiresIn: string
  }
}

export const authConfig: AuthConfig = {
  jwt: {
    secret: process.env.AUTH_SECRET || 'default',
    expiresIn: '1d',
  },
}
