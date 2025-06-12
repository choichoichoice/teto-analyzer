'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { Brain, User, LogOut } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)

    if (configured) {
      // 현재 사용자 확인
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user)
      })

      // 인증 상태 변화 감지
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut()
    }
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">테토-에겐 분석기</span>
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              홈
            </Link>
            <Link 
              href="/analyze" 
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              분석하기
            </Link>
            {isConfigured && user && (
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                대시보드
              </Link>
            )}
          </nav>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {!isConfigured ? (
              <div className="text-sm text-gray-500">
                데모 모드
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/auth/login" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>로그인</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                >
                  <Link href="/auth/signup">회원가입</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 