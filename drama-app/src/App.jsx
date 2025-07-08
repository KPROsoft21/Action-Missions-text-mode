import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Zap, Target, Swords, RotateCcw, Users, Flame } from 'lucide-react'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('setup') // 'setup', 'playing', 'results'
  const [userNames, setUserNames] = useState({
    main: '',
    friend1: '',
    friend2: '',
    friend3: '',
    friend4: ''
  })
  const [selectedSetting, setSelectedSetting] = useState('')
  const [customSetting, setCustomSetting] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [storyBeats, setStoryBeats] = useState([])
  const [currentChoices, setCurrentChoices] = useState([])
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [dramaMeter, setDramaMeter] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [storyComplete, setStoryComplete] = useState(false)

  const settings = [
    { id: 'military_base', name: 'Military Base', icon: '🪖', description: 'Tactical warfare and betrayal' },
    { id: 'zombie_apocalypse', name: 'Zombie Apocalypse', icon: '🧟', description: 'Survival and tough choices' },
    { id: 'space_station', name: 'Space Station', icon: '🚀', description: 'Cosmic conflicts and sabotage' },
    { id: 'underground_fight_club', name: 'Fight Club', icon: '🥊', description: 'Underground combat arena' },
    { id: 'heist_crew', name: 'Heist Crew', icon: '💰', description: 'High-stakes criminal operations' },
    { id: 'spy_agency', name: 'Spy Agency', icon: '🕵️', description: 'Espionage and double agents' },
    { id: 'custom', name: 'Custom Setting', icon: '✏️', description: 'Create your own scenario' }
  ]

  const personalityTags = [
    'Ruthless', 'Strategic', 'Reckless', 'Loyal', 'Backstabber',
    'Hot-Headed', 'Cold-Blooded', 'Heroic', 'Paranoid', 'Fearless'
  ]

  const generateRandomNames = () => {
    const names = ['Phoenix', 'Viper', 'Storm', 'Blade', 'Raven', 'Steel', 'Ghost', 'Titan', 'Fury', 'Shadow']
    const shuffled = [...names].sort(() => Math.random() - 0.5)
    setUserNames({
      main: shuffled[0],
      friend1: shuffled[1],
      friend2: shuffled[2],
      friend3: shuffled[3],
      friend4: shuffled[4]
    })
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const startDrama = async () => {
    setIsLoading(true)
    try {
      const finalSetting = selectedSetting === 'custom' ? customSetting : selectedSetting
      
      const response = await fetch('/api/story/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characters: userNames,
          setting: finalSetting,
          personality_tags: selectedTags
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start story')
      }

      const data = await response.json()
      
      setSessionId(data.session_id)
      setStoryBeats([data.story_beat])
      setCurrentChoices(data.choices)
      setDramaMeter(data.drama_level)
      setGameState('playing')
    } catch (error) {
      console.error('Error starting story:', error)
      alert('Failed to start story. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const makeChoice = async (choice) => {
    setSelectedChoice(choice)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/story/choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          choice_id: choice.id,
          choice_text: choice.text
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process choice')
      }

      const data = await response.json()
      
      // Add new story beat after a delay for dramatic effect
      setTimeout(() => {
        setStoryBeats(prev => [...prev, data.story_beat])
        setCurrentChoices(data.choices)
        setDramaMeter(data.drama_level)
        setStoryComplete(data.story_complete)
        setSelectedChoice(null)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Error making choice:', error)
      alert('Failed to process choice. Please try again.')
      setSelectedChoice(null)
      setIsLoading(false)
    }
  }

  const resetGame = () => {
    setGameState('setup')
    setUserNames({ main: '', friend1: '', friend2: '', friend3: '', friend4: '' })
    setSelectedSetting('')
    setCustomSetting('')
    setSelectedTags([])
    setSessionId(null)
    setStoryBeats([])
    setCurrentChoices([])
    setSelectedChoice(null)
    setDramaMeter(0)
    setStoryComplete(false)
  }

  const getDramaMeterColor = () => {
    if (dramaMeter < 30) return 'bg-blue-500'
    if (dramaMeter < 70) return 'bg-orange-500'
    return 'bg-red-600'
  }

  const getDramaMeterLabel = () => {
    if (dramaMeter < 30) return 'Tactical'
    if (dramaMeter < 70) return 'Intense'
    return 'EXPLOSIVE'
  }

  const isFormValid = () => {
    const hasMainName = userNames.main.trim() !== ''
    const hasSetting = selectedSetting !== ''
    const hasCustomSetting = selectedSetting !== 'custom' || customSetting.trim() !== ''
    return hasMainName && hasSetting && hasCustomSetting
  }

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Zap className="text-yellow-400" />
              Action Drama Generator
              <Target className="text-red-500" />
            </h1>
            <p className="text-gray-300">High-stakes drama. Intense choices. Epic consequences.</p>
          </div>

          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="text-blue-400" />
                Assemble Your Squad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="main-name" className="text-gray-200">Your Codename</Label>
                <Input
                  id="main-name"
                  placeholder="Enter your codename"
                  value={userNames.main}
                  onChange={(e) => setUserNames(prev => ({ ...prev, main: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(num => (
                  <div key={num}>
                    <Label htmlFor={`friend-${num}`} className="text-gray-200">Squad Member {num}</Label>
                    <Input
                      id={`friend-${num}`}
                      placeholder={`Member ${num} codename`}
                      value={userNames[`friend${num}`]}
                      onChange={(e) => setUserNames(prev => ({ ...prev, [`friend${num}`]: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                onClick={generateRandomNames}
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Generate Random Codenames
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Choose Your Battleground</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {settings.map(setting => (
                  <Card 
                    key={setting.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedSetting === setting.id 
                        ? 'ring-2 ring-yellow-400 bg-gray-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setSelectedSetting(setting.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{setting.icon}</div>
                      <div className="font-semibold text-white">{setting.name}</div>
                      <div className="text-sm text-gray-300">{setting.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedSetting === 'custom' && (
                <div className="mt-4">
                  <Label htmlFor="custom-setting" className="text-gray-200">Describe Your Custom Setting</Label>
                  <Textarea
                    id="custom-setting"
                    placeholder="Describe your custom scenario (e.g., 'Underground racing circuit', 'Corporate espionage firm', 'Post-apocalyptic wasteland')"
                    value={customSetting}
                    onChange={(e) => setCustomSetting(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 mt-2"
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Combat Traits (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {personalityTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer hover:scale-105 transition-transform ${
                      selectedTags.includes(tag)
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={startDrama}
            disabled={!isFormValid() || isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 text-lg"
          >
            {isLoading ? 'Initiating Mission...' : '⚡ LAUNCH MISSION ⚡'}
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {/* Header */}
        <div className="bg-gray-800 shadow-lg p-4 sticky top-0 z-10 border-b border-gray-700">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Mission Feed</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="text-red-500" />
                <div className="w-24">
                  <Progress value={dramaMeter} className="h-2" />
                </div>
                <span className="text-sm font-semibold text-white">{getDramaMeterLabel()}</span>
              </div>
              <Button variant="outline" size="sm" onClick={resetGame} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Story Feed */}
          {storyBeats.map(beat => (
            <Card key={beat.id} className="bg-gray-800 shadow-lg border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {beat.character[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{beat.character}</div>
                    <div className="text-sm text-gray-400">{beat.timestamp}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 mb-4">{beat.content}</p>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">{beat.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Swords className="w-4 h-4" />
                    <span className="text-sm">{beat.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Share Intel</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Choice Selection */}
          {currentChoices.length > 0 && !storyComplete && (
            <Card className="bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-dashed border-yellow-400">
              <CardHeader>
                <CardTitle className="text-center text-white">What's your move?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentChoices.map(choice => (
                  <Button
                    key={choice.id}
                    variant={selectedChoice?.id === choice.id ? "default" : "outline"}
                    className={`w-full text-left justify-start h-auto p-4 ${
                      selectedChoice?.id === choice.id
                        ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                        : 'border-gray-600 text-gray-200 hover:bg-gray-700'
                    }`}
                    onClick={() => makeChoice(choice)}
                    disabled={selectedChoice !== null || isLoading}
                  >
                    <div>
                      <div className="font-semibold">{choice.text}</div>
                      <div className="text-sm opacity-70">{choice.preview}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {(selectedChoice || isLoading) && (
            <div className="text-center text-gray-400">
              <div className="animate-pulse">Processing tactical response...</div>
            </div>
          )}

          {/* Story Complete */}
          {storyComplete && (
            <Card className="bg-gradient-to-r from-green-800 to-blue-800 border-2 border-green-400">
              <CardHeader>
                <CardTitle className="text-center text-white">🎯 Mission Complete! 🎯</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-200">Your tactical operation has reached its conclusion! Final intensity level: <strong className="text-yellow-400">{dramaMeter}/100</strong></p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={resetGame} variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-700">
                    New Mission
                  </Button>
                  <Button 
                    onClick={() => {
                      const storyText = storyBeats.map(beat => `${beat.character}: ${beat.content}`).join('\n\n')
                      navigator.clipboard.writeText(storyText)
                      alert('Mission report copied to clipboard!')
                    }}
                    className="bg-yellow-400 text-black hover:bg-yellow-300"
                  >
                    Share Intel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default App

