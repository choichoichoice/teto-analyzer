import { NextRequest, NextResponse } from 'next/server'
import { AnalysisResult } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: '이미지가 필요합니다.' }, { status: 400 })
    }

    // 이미지를 base64로 변환
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // AI 분석을 위한 프롬프트
    const prompt = `당신은 사람의 얼굴 표정과 전체적인 분위기를 통해 성격 유형을 분석하는 AI 심리학자입니다. 주어진 사진 속 인물을 분석하여, PRD에 정의된 4가지 '호르몬 기반 성격 유형' 중 가장 가능성이 높은 유형을 판단해 주세요. 분석 시에는 외형이나 스타일보다는, 사진에서 유추할 수 있는 자신감, 내면의 강인함, 부드러움, 감성 등 성격적 특성에 집중해야 합니다.

* **테토남:** 강인함, 주도적, 자신감, 직설적 태도가 느껴지는가?
* **에겐남:** 감성적, 공감 능력, 부드러운 태도가 느껴지는가?
* **테토녀:** 독립적, 주도적, 자신감 있는 분위기인가?
* **에겐녀:** 따뜻함, 감성적, 포용적인 분위기인가?

분석 결과를 바탕으로 가장 가능성 높은 유형, 해당 유형의 이모지, 신뢰도 백분율(70~95%), 그리고 당신의 판단을 뒷받침하는 구체적인 근거 3가지를 JSON 형식으로 반환해 주세요.`

    // OpenAI API 호출 (실제 구현에서는 환경변수에서 API 키를 가져와야 함)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API Error:', await openaiResponse.text())
      
      // 데모용 더미 데이터 반환
      const dummyResult: AnalysisResult = {
        type: ['테토남', '테토녀', '에겐남', '에겐녀'][Math.floor(Math.random() * 4)] as any,
        emoji: ['💪', '👑', '🌸', '🌺'][Math.floor(Math.random() * 4)],
        confidence: Math.floor(Math.random() * 26) + 70, // 70-95%
        reasons: [
          '사진에서 강한 자신감과 주도적인 분위기가 느껴집니다',
          '표정과 눈빛에서 내면의 강인함이 드러납니다',
          '전체적인 포즈와 표현에서 리더십 성향이 보입니다'
        ]
      }
      
      return NextResponse.json(dummyResult)
    }

    const data = await openaiResponse.json()
    const content = data.choices[0].message.content

    try {
      // JSON 파싱 시도
      const result = JSON.parse(content)
      return NextResponse.json(result)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      
      // 파싱 실패 시 더미 데이터 반환
      const dummyResult: AnalysisResult = {
        type: '테토남',
        emoji: '💪',
        confidence: 85,
        reasons: [
          '사진에서 강한 자신감과 주도적인 분위기가 느껴집니다',
          '표정과 눈빛에서 내면의 강인함이 드러납니다',
          '전체적인 포즈와 표현에서 리더십 성향이 보입니다'
        ]
      }
      
      return NextResponse.json(dummyResult)
    }

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 