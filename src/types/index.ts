export type PersonalityType = '테토남' | '테토녀' | '에겐남' | '에겐녀'

export interface AnalysisResult {
  type: PersonalityType
  emoji: string
  confidence: number
  reasons: string[]
}

export interface DevelopmentTip {
  title: string
  tips: string[]
  shoppingKeywords: string[]
}

export interface User {
  id: string
  email: string
  created_at: string
}

export interface AnalysisHistory {
  id: string
  user_id: string
  image_url: string
  result: AnalysisResult
  created_at: string
} 