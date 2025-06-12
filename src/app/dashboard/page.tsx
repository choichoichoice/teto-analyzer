'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Brain, Calendar, TrendingUp, User, Camera } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { AnalysisHistory } from '@/types'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
        window.location.href = '/auth/login'
        return
      }

      setUser(user)
      // TODO: 분석 히스토리 로드 (현재는 데모 데이터)
      loadAnalysisHistory(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalysisHistory = async (userId: string) => {
    // TODO: 실제 데이터베이스에서 히스토리 로드
    // 현재는 데모 데이터 사용
    const demoHistory: AnalysisHistory[] = [
      {
        id: '1',
        user_id: userId,
        image_url: '/demo-image-1.jpg',
        result: {
          type: '테토남',
          emoji: '💪',
          confidence: 87,
          reasons: ['강한 자신감이 느껴집니다', '주도적인 분위기입니다', '리더십이 보입니다']
        },
        created_at: new Date(Date.now() - 86400000 * 2).toISOString() // 2일 전
      },
      {
        id: '2',
        user_id: userId,
        image_url: '/demo-image-2.jpg',
        result: {
          type: '에겐녀',
          emoji: '🌺',
          confidence: 92,
          reasons: ['따뜻한 미소가 인상적입니다', '부드러운 분위기입니다', '공감 능력이 높아 보입니다']
        },
        created_at: new Date(Date.now() - 86400000 * 7).toISOString() // 1주일 전
      },
    ]
    
    setAnalysisHistory(demoHistory)
  }

  const getTypeStats = () => {
    const typeCount = analysisHistory.reduce((acc, item) => {
      acc[item.result.type] = (acc[item.result.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return typeCount
  }

  const getMostFrequentType = () => {
    const typeStats = getTypeStats()
    const entries = Object.entries(typeStats)
    if (entries.length === 0) return null
    
    return entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center min-h-96">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    )
  }

  const mostFrequentType = getMostFrequentType()
  const typeStats = getTypeStats()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            안녕하세요, {user?.email}님!
          </h1>
          <p className="text-xl text-gray-600">
            당신의 테토-에겐 분석 기록을 확인해보세요
          </p>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 분석 횟수</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysisHistory.length}</div>
              <p className="text-xs text-muted-foreground">
                지금까지 진행된 분석
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">가장 많은 유형</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostFrequentType || '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                {mostFrequentType ? `${typeStats[mostFrequentType]}회 분석됨` : '분석 기록 없음'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 신뢰도</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysisHistory.length > 0 
                  ? Math.round(analysisHistory.reduce((sum, item) => sum + item.result.confidence, 0) / analysisHistory.length)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                분석 정확도
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">최근 분석</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysisHistory.length > 0 
                  ? new Date(analysisHistory[0].created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
                  : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                마지막 분석일
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 분석 히스토리 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>분석 히스토리</CardTitle>
            <CardDescription>
              지금까지의 모든 분석 결과를 확인할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisHistory.length > 0 ? (
              <div className="space-y-4">
                {analysisHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{item.result.emoji}</div>
                      <div>
                        <h3 className="font-semibold">{item.result.type}</h3>
                        <p className="text-sm text-gray-600">
                          신뢰도: {item.result.confidence}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-2">
                        주요 특징:
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs">
                        {item.result.reasons[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  아직 분석 기록이 없습니다
                </h3>
                <p className="text-gray-600 mb-6">
                  첫 번째 성격 분석을 시작해보세요!
                </p>
                <Button asChild>
                  <Link href="/analyze">
                    첫 분석 시작하기
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/analyze" className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>새 분석하기</span>
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 