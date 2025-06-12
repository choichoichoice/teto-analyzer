import { NextRequest, NextResponse } from 'next/server'
import { DevelopmentTip, PersonalityType } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { type }: { type: PersonalityType } = await request.json()

    if (!type) {
      return NextResponse.json({ error: '성격 유형이 필요합니다.' }, { status: 400 })
    }

    // AI 팁 생성을 위한 프롬프트
    const prompt = `사용자의 분석 유형은 '${type}'입니다. 당신은 재치있는 라이프 코치 AI입니다.
'${type}' 유형이 가진 핵심 강점(예: 테토남의 '주도력', 에겐녀의 '공감 능력')을 더욱 발전시킬 수 있는, 재미있고 실용적인 '호르몬 발전 팁'을 생성해 주세요. 이것은 의학적 조언이 아닌, 성격 발전을 위한 즐거운 제안입니다.

결과는 다음 내용을 포함하는 JSON 형식이어야 합니다:
1. 사용자의 흥미를 끄는 재치 있는 제목.
2. 각 유형의 강점을 강화하는 구체적인 팁 2~3개 (이모지 포함).
3. 해당 유형의 사람이 관심을 가질 만한 쇼핑 키워드 3개 (예: 테토남 -> '리더십 관련 서적', 에겐녀 -> '아로마 오일').`

    // OpenAI API 호출
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API Error:', await openaiResponse.text())
      
      // 데모용 더미 데이터 반환
      const dummyTips = getDummyTips(type)
      return NextResponse.json(dummyTips)
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
      const dummyTips = getDummyTips(type)
      return NextResponse.json(dummyTips)
    }

  } catch (error) {
    console.error('Tips error:', error)
    return NextResponse.json(
      { error: '팁 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

function getDummyTips(type: PersonalityType): DevelopmentTip {
  const tipsMap: Record<PersonalityType, DevelopmentTip> = {
    '테토남': {
      title: '💪 당신의 리더십을 더욱 빛나게 하는 방법',
      tips: [
        '🎯 목표 설정과 달성: 매주 도전적인 목표를 세우고 체계적으로 달성해보세요',
        '💬 커뮤니케이션 스킬: 강한 리더십에 따뜻함을 더해 팀원들과의 관계를 개선하세요',
        '🏋️‍♂️ 신체 단련: 규칙적인 운동으로 내면의 강인함을 외적으로도 표현하세요'
      ],
      shoppingKeywords: ['리더십 서적', '운동 기구', '비즈니스 수트']
    },
    '테토녀': {
      title: '👑 독립적인 여성의 자신감 업그레이드',
      tips: [
        '💼 커리어 발전: 새로운 도전과 기회를 적극적으로 찾아 자신의 영역을 넓혀보세요',
        '✨ 스타일링: 자신만의 개성있는 스타일로 내면의 강함을 표현하세요',
        '🗣️ 네트워킹: 같은 가치관을 가진 사람들과의 네트워크를 구축하세요'
      ],
      shoppingKeywords: ['파워 수트', '자기계발서', '프리미엄 액세서리']
    },
    '에겐남': {
      title: '🌸 섬세한 감성의 매력을 발산하는 법',
      tips: [
        '🎨 예술 활동: 그림, 음악, 글쓰기 등을 통해 풍부한 감성을 표현해보세요',
        '🤝 공감 능력 활용: 상담이나 멘토링을 통해 타인을 도우며 성취감을 느껴보세요',
        '🧘‍♂️ 마음챙김: 명상이나 요가로 내면의 평화와 안정감을 키워보세요'
      ],
      shoppingKeywords: ['아트 용품', '요가 매트', '감성 도서']
    },
    '에겐녀': {
      title: '🌺 따뜻한 마음의 힐링 파워 극대화',
      tips: [
        '🌿 자연과의 교감: 가드닝이나 산책을 통해 자연에서 에너지를 충전하세요',
        '💕 관계 맺기: 진정성 있는 대화와 공감으로 깊은 인간관계를 만들어보세요',
        '🍯 셀프케어: 아로마테라피나 스파 등으로 자신을 아끼고 돌보는 시간을 가져보세요'
      ],
      shoppingKeywords: ['아로마 오일', '플랜트 용품', '스킨케어 제품']
    }
  }

  return tipsMap[type]
} 