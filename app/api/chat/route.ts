import { NextRequest } from "next/server"

type ChatRequestBody = {
  message?: string
  language?: string
  location?: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
}

type Scenario = {
  matches: (input: string) => boolean
  response: string
  sources: string[]
}

const SCENARIOS: Scenario[] = [
  {
    matches: (input) => /언제/.test(input) && /지어/.test(input),
    response:
      "경복궁은 1395년, 조선 태조 이성계가 한양에 새 수도를 정하면서 함께 조성한 조선 왕조의 정궁입니다.\\n\\n" +
      "- 건립 연도: 1395년 (태조 4년)\\n" +
      "- 건립자: 조선 태조 이성계\\n" +
      "- 의미: 새 왕조의 번영과 안녕을 기원하며 지은 궁궐\\n\\n" +
      "임진왜란으로 대부분 소실되었다가 1867년(고종 4년) 중건되었고, 20세기 말부터는 문화재청 주도로 복원 사업이 진행되어 오늘날의 모습을 되찾게 되었습니다.",
    sources: ["문화재청", "한국관광공사", "궁궐복원연구소"],
  },
  {
    matches: (input) => input.includes("근정전") && (/건축/.test(input) || /특징/.test(input)),
    response:
      "근정전은 경복궁의 정전으로, 국왕이 조회와 공식 의식을 집행하던 공간입니다.\\n\\n" +
      "주요 건축 특징은 다음과 같습니다.\\n" +
      "1. 팔작지붕의 중층 구조로 위엄을 강조했습니다.\\n" +
      "2. 2층 월대와 계단은 왕권의 격식을 상징합니다.\\n" +
      "3. 내부 천장에는 왕권과 번영을 기원하는 금빛 용 문양이 장식되어 있습니다.\\n" +
      "4. 단청은 오방색을 활용해 잡귀를 막고 건물을 보호하는 의미를 담았습니다.",
    sources: ["한국전통건축학회", "문화재청"],
  },
  {
    matches: (input) => input.includes("수문장") && (input.includes("교대식") || input.includes("시간")),
    response:
      "경복궁 수문장 교대식은 조선시대 궁궐 수비 의식을 재현한 대표적인 퍼포먼스입니다.\\n\\n" +
      "- 장소: 광화문 앞\\n" +
      "- 평일: 10:00, 13:00, 15:00 (3회)\\n" +
      "- 주말: 10:00, 11:00, 13:00, 14:00, 15:00 (5회)\\n" +
      "- 소요 시간: 약 20분\\n\\n" +
      "기상 상황이나 행사 일정에 따라 변동될 수 있으니, 방문 전 문화재청 공지나 경복궁 관리소 안내를 확인하는 것이 좋습니다.",
    sources: ["문화재청", "한국문화재재단"],
  },
]

const DEFAULT_SOURCE = ["K-Docent 지식 베이스"]

const encoder = new TextEncoder()

function buildResponseText(message: string, location?: string) {
  const trimmed = message.trim()
  const lower = trimmed.toLowerCase()

  const scenario = SCENARIOS.find((item) => item.matches(trimmed))
  if (scenario) {
    return { text: scenario.response, sources: scenario.sources }
  }

  const promptSummary = trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed
  const locationLine = location ? `\n\n질문 위치: ${location}` : ""

  const genericText =
    `좋은 질문이에요! "${promptSummary}"에 대해 알려드릴게요.\n\n` +
    "현재는 사전 학습된 문화 해설을 기반으로 안내하고 있으며, 더 깊은 정보가 필요하다면 관련 전시 해설자료나 문화재청 발간물을 함께 참고해 보시면 좋아요." +
    locationLine

  return { text: genericText, sources: DEFAULT_SOURCE }
}

async function streamText(text: string, sources: string[]): Promise<ReadableStream<Uint8Array>> {
  const chunkSize = 90
  const delay = 80

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let i = 0; i < text.length; i += chunkSize) {
          const chunk = text.slice(i, i + chunkSize)
          controller.enqueue(encoder.encode(chunk))
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        if (sources.length) {
          controller.enqueue(encoder.encode(`\n[SOURCES]${sources.join("|")}`))
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody | null
    const message = body?.message?.trim()

    if (!message) {
      return new Response("message is required", { status: 400 })
    }

    const language = body?.language ?? "ko"
    const location = body?.location

    const { text, sources } = buildResponseText(message, location)

    const preface = language === "ko"
      ? "도슨트가 생각을 정리하고 있어요...\n\n"
      : "The docent is preparing an answer...\n\n"

    const stream = await streamText(preface + text, sources)

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    })
  } catch (error) {
    console.error("Chat API error", error)
    return new Response("internal error", { status: 500 })
  }
}
