'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Camera, Loader2, Share2, RefreshCw, TrendingUp } from 'lucide-react'
import { AnalysisResult, DevelopmentTip } from '@/types'
import Image from 'next/image'

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [developmentTips, setDevelopmentTips] = useState<DevelopmentTip | null>(null)
  const [isLoadingTips, setIsLoadingTips] = useState(false)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setAnalysisResult(null)
      setDevelopmentTips(null)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('분석에 실패했습니다.')
      }

      const result: AnalysisResult = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGetTips = async () => {
    if (!analysisResult) return

    setIsLoadingTips(true)
    try {
      const response = await fetch('/api/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: analysisResult.type }),
      })

      if (!response.ok) {
        throw new Error('팁 로딩에 실패했습니다.')
      }

      const tips: DevelopmentTip = await response.json()
      setDevelopmentTips(tips)
    } catch (error) {
      console.error('Tips error:', error)
      alert('팁 로딩 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoadingTips(false)
    }
  }

  const handleShare = async () => {
    if (!analysisResult) return

    const shareText = `테토-에겐 분석 결과: ${analysisResult.type} ${analysisResult.emoji} (신뢰도 ${analysisResult.confidence}%)`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '테토-에겐 분석 결과',
          text: shareText,
          url: window.location.href,
        })
      } catch (error) {
        console.log('공유가 취소되었습니다.')
      }
    } else {
      // Fallback: 클립보드에 복사
      navigator.clipboard.writeText(shareText)
      alert('결과가 클립보드에 복사되었습니다!')
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setAnalysisResult(null)
    setDevelopmentTips(null)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case '테토남': return 'border-blue-400 bg-blue-50'
      case '테토녀': return 'border-pink-400 bg-pink-50'
      case '에겐남': return 'border-purple-400 bg-purple-50'
      case '에겐녀': return 'border-rose-400 bg-rose-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            테토-에겐 성격 분석
          </h1>
          <p className="text-xl text-gray-600">
            사진을 업로드하여 AI가 분석하는 당신의 성격 유형을 확인해보세요
          </p>
        </div>

        {/* 이미지 업로드 섹션 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>사진 업로드</span>
            </CardTitle>
            <CardDescription>
              얼굴이 잘 보이는 사진을 업로드해주세요. 정면 사진이 가장 정확한 분석 결과를 제공합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="mt-2"
                  >
                    다른 사진 선택
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG 또는 JPEG (최대 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                </label>
              )}

              {selectedImage && !analysisResult && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      분석 시작하기
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 분석 결과 섹션 */}
        {analysisResult && (
          <Card className={`mb-8 border-2 ${getTypeColor(analysisResult.type)}`}>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                분석 결과
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{analysisResult.emoji}</div>
                <h2 className="text-3xl font-bold mb-2">{analysisResult.type}</h2>
                <p className="text-lg text-gray-600 mb-4">
                  신뢰도: {analysisResult.confidence}%
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">분석 근거:</h3>
                <ul className="space-y-2">
                  {analysisResult.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  onClick={handleGetTips}
                  disabled={isLoadingTips}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoadingTips ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      로딩 중...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      호르몬 발전 팁 보기
                    </>
                  )}
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  결과 공유하기
                </Button>
                <Button onClick={handleReset} variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  다시 분석하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 발전 팁 섹션 */}
        {developmentTips && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>{developmentTips.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">발전 팁:</h3>
                  <ul className="space-y-2">
                    {developmentTips.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">추천 상품 키워드:</h3>
                  <div className="flex flex-wrap gap-2">
                    {developmentTips.shoppingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 