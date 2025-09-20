"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus, Download, FileText } from "lucide-react"
import { adminAPI } from "@/lib/api/client"
import type { CreateHeritageRequest } from "@/lib/api/types"

type HeritageData = CreateHeritageRequest

export default function AdminPage() {
  const [formData, setFormData] = useState<HeritageData>({
    name: '',
    description: '',
    latitude: 0,
    longitude: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedData, setUploadedData] = useState<HeritageData[]>([])

  // 단일 데이터 입력 처리
  const handleInputChange = (field: keyof HeritageData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 단일 데이터 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await adminAPI.createHeritage(formData)

      if (response.status === 'success') {
        alert(`문화재 데이터가 성공적으로 저장되었습니다. (ID: ${response.data.content_id})`)

        // 폼 초기화
        setFormData({
          name: '',
          description: '',
          latitude: 0,
          longitude: 0
        })
      } else {
        throw new Error('저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('데이터 저장 실패:', error)
      alert('데이터 저장에 실패했습니다. 오류를 확인해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 파일 업로드 처리
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        let data: HeritageData[] = []

        if (file.name.endsWith('.json')) {
          // JSON 파일 처리
          const jsonData = JSON.parse(content)
          data = Array.isArray(jsonData) ? jsonData : [jsonData]
        } else if (file.name.endsWith('.csv')) {
          // CSV 파일 처리
          const lines = content.split('\n').filter(line => line.trim())
          const headers = lines[0].split(',').map(h => h.trim())

          data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim())
            return {
              name: values[0] || '',
              description: values[1] || '',
              latitude: parseFloat(values[2]) || 0,
              longitude: parseFloat(values[3]) || 0
            }
          })
        }

        setUploadedData(data)
        console.log('업로드된 데이터:', data)
      } catch (error) {
        console.error('파일 파싱 실패:', error)
        alert('파일 형식이 올바르지 않습니다.')
      }
    }
    reader.readAsText(file)
  }

  // 업로드된 데이터 일괄 저장
  const handleBulkSubmit = async () => {
    if (uploadedData.length === 0) {
      alert('업로드된 데이터가 없습니다.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await adminAPI.bulkCreateHeritage({
        heritage_data: uploadedData
      })

      if (response.status === 'success') {
        const { created_count, failed_items } = response.data

        if (failed_items && failed_items.length > 0) {
          alert(`${created_count}개 저장 완료, ${failed_items.length}개 실패. 실패한 항목을 확인해주세요.`)
          console.error('실패한 항목들:', failed_items)
        } else {
          alert(`${created_count}개의 문화재 데이터가 모두 성공적으로 저장되었습니다.`)
        }

        setUploadedData([])
      } else {
        throw new Error('일괄 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('일괄 저장 실패:', error)
      alert('일괄 저장에 실패했습니다. 오류를 확인해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 샘플 데이터 다운로드
  const downloadSample = (format: 'json' | 'csv') => {
    const sampleData = [
      {
        name: "경복궁",
        description: "조선 왕조의 정궁으로 1395년에 창건된 궁궐",
        latitude: 37.5796,
        longitude: 126.9770
      },
      {
        name: "불국사",
        description: "경주에 위치한 대한민국의 대표적인 불교 사찰",
        latitude: 35.7898,
        longitude: 129.3320
      }
    ]

    let content: string
    let filename: string
    let mimeType: string

    if (format === 'json') {
      content = JSON.stringify(sampleData, null, 2)
      filename = 'heritage_sample.json'
      mimeType = 'application/json'
    } else {
      const csvHeader = 'name,description,latitude,longitude'
      const csvRows = sampleData.map(item =>
        `"${item.name}","${item.description}",${item.latitude},${item.longitude}`
      )
      content = [csvHeader, ...csvRows].join('\n')
      filename = 'heritage_sample.csv'
      mimeType = 'text/csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">문화재 관리 어드민</h1>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              단일 입력
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              파일 업로드
            </TabsTrigger>
          </TabsList>

          {/* 단일 데이터 입력 탭 */}
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>문화재 정보 입력</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">문화재명 *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="예: 경복궁"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="latitude">위도 *</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                        placeholder="예: 37.5796"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="longitude">경도 *</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                        placeholder="예: 126.9770"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">설명 *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="문화재에 대한 상세 설명을 입력하세요"
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '저장 중...' : '문화재 정보 저장'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 파일 업로드 탭 */}
          <TabsContent value="bulk">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>파일 업로드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      JSON 또는 CSV 파일 업로드
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      파일을 선택하거나 드래그해서 업로드하세요
                    </p>
                    <Input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileUpload}
                      className="max-w-xs"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => downloadSample('json')}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      JSON 샘플 다운로드
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadSample('csv')}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      CSV 샘플 다운로드
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 업로드된 데이터 미리보기 */}
              {uploadedData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>업로드된 데이터 미리보기 ({uploadedData.length}개)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">문화재명</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">설명</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">위도</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">경도</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedData.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.latitude}</td>
                              <td className="border border-gray-300 px-4 py-2">{item.longitude}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Button
                      onClick={handleBulkSubmit}
                      className="w-full mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? '저장 중...' : `${uploadedData.length}개 데이터 일괄 저장`}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}