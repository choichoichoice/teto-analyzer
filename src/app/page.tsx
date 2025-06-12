import Image from "next/image";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Brain, Users, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              사진으로 알아보는 
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                테토-에겐 분석기
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              당신의 사진을 AI가 분석하여 테토남, 테토녀, 에겐남, 에겐녀 중<br />
              어떤 성격 유형에 가까운지 알려드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                asChild
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto"
              >
                <Link href="/analyze" className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>지금 분석하기</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4 h-auto"
              >
                <Link href="/about">서비스 소개</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              왜 테토-에겐 분석기인가요?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI 기술을 활용한 정확한 분석으로 당신의 숨겨진 성격을 발견해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">AI 정밀 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  고도화된 AI 기술로 얼굴 표정과 분위기를 종합적으로 분석하여 
                  정확한 성격 유형을 판단합니다
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">4가지 유형</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  테토남, 테토녀, 에겐남, 에겐녀의 4가지 호르몬 기반 성격 유형으로 
                  구분하여 자세한 분석 결과를 제공합니다
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">맞춤 추천</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  분석 결과를 바탕으로 당신의 강점을 더욱 발전시킬 수 있는 
                  개인화된 상품과 팁을 추천해드립니다
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 성격 유형 소개 섹션 */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              4가지 성격 유형을 알아보세요
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              각 유형마다 고유한 특성과 매력이 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">💪</div>
                <CardTitle className="text-blue-600">테토남</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  주도적이고 자신감 있는 성향. 강인함과 직설적인 태도가 특징인 남성 유형
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 hover:border-pink-400 transition-colors">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">👑</div>
                <CardTitle className="text-pink-600">테토녀</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  독립적이고 주도적인 연애 스타일을 가진 여성. 강한 의지력이 특징
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🌸</div>
                <CardTitle className="text-purple-600">에겐남</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  감성적이고 공감 능력이 뛰어난 남성. 부드럽고 섬세한 감정 표현이 특징
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-rose-200 hover:border-rose-400 transition-colors">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">🌺</div>
                <CardTitle className="text-rose-600">에겐녀</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  부드럽고 감성적인 여성. 공감과 안정감을 중시하는 따뜻한 성향
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 당신의 성격 유형을 알아보세요!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            단 한 장의 사진으로 숨겨진 성격과 강점을 발견하고, 
            맞춤형 발전 방향을 찾아보세요.
          </p>
          <Button 
            size="lg" 
            asChild
            className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto"
          >
            <Link href="/analyze" className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>무료 분석 시작하기</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
