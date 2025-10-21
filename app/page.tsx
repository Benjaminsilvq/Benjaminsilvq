import { AuthManager } from "@/components/auth/auth-manager"
import { BankingInterface } from "@/components/banking-interface"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <AuthManager>
        <BankingInterface />
      </AuthManager>
    </main>
  )
}
