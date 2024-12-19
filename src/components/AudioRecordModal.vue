<template>
    <div v-if="modelValue" class="modal-overlay" @click="handleClose">
      <div class="modal-content" @click.stop>
        <h3>Record Audio</h3>
        
        <!-- Device Selection -->
        <select v-model="selectedDevice" :disabled="isRecording" class="device-select">
          <option value="">Select input device...</option>
          <option v-for="device in audioDevices" :key="device.deviceId" :value="device.deviceId">
            {{ device.label }}
          </option>
        </select>
  
        <!-- Waveform Canvas -->
        <div class="waveform-container">
          <canvas ref="waveformCanvas" width="500" height="100"></canvas>
        </div>
  
        <!-- Timer -->
        <div class="timer">{{ formatTime(recordingTime) }}</div>
  
        <!-- Controls -->
        <div class="controls">
          <button 
            v-if="!isRecording" 
            @click="startRecording" 
            :disabled="!selectedDevice"
            class="record-btn"
          >
            Start Recording
          </button>
          <template v-else>
            <button 
              v-if="!isPaused" 
              @click="pauseRecording" 
              class="pause-btn"
            >
              Pause
            </button>
            <button 
              v-else 
              @click="resumeRecording" 
              class="resume-btn"
            >
              Resume
            </button>
            <button 
              @click="stopRecording" 
              class="stop-btn"
            >
              Stop
            </button>
          </template>
        </div>
  
        <!-- Buttons -->
        <div class="modal-buttons">
          <button @click="handleClose">Cancel</button>
          <button 
            @click="handleSubmit" 
            :disabled="!audioBlob" 
            class="submit-btn"
          >
            Add Recording
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  
  const props = defineProps({
    modelValue: Boolean
  })
  
  const emit = defineEmits(['update:modelValue', 'submit'])
  
  const selectedDevice = ref('')
  const audioDevices = ref([])
  const isRecording = ref(false)
  const isPaused = ref(false)
  const recordingTime = ref(0)
  const audioBlob = ref(null)
  const waveformCanvas = ref(null)
  
  let mediaRecorder = null
  let audioContext = null
  let analyser = null
  let animationFrame = null
  let recordingInterval = null
  let audioChunks = []
  
  // Get available audio devices
  const getAudioDevices = async () => {
    try {
      // First request microphone access to trigger permission prompt
      await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Now enumerate devices - this will include labels
      const devices = await navigator.mediaDevices.enumerateDevices()
      console.log('audio-devices :', devices)
      const filteredDevices = devices.filter(device => device.kind === 'audioinput')
      console.log('filtered-audio-devices :', filteredDevices)
      audioDevices.value = filteredDevices
    } catch (error) {
      console.error('Error getting audio devices:', error)
    }
  }
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDevice.value }
      })
      
      // Set up audio context and analyser
      audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
  
      // Set up media recorder
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }
  
      mediaRecorder.onstop = () => {
        audioBlob.value = new Blob(audioChunks, { type: 'audio/wav' })
      }
  
      // Start recording
      mediaRecorder.start()
      isRecording.value = true
      startTimer()
      drawWaveform()
  
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }
  
  // Pause recording
  const pauseRecording = () => {
    mediaRecorder?.pause()
    isPaused.value = true
    clearInterval(recordingInterval)
  }
  
  // Resume recording
  const resumeRecording = () => {
    mediaRecorder?.resume()
    isPaused.value = false
    startTimer()
  }
  
  // Stop recording
  const stopRecording = () => {
    mediaRecorder?.stop()
    isRecording.value = false
    isPaused.value = false
    clearInterval(recordingInterval)
    cancelAnimationFrame(animationFrame)
  }
  
  // Draw waveform
  const drawWaveform = () => {
    const canvas = waveformCanvas.value
    const ctx = canvas.getContext('2d')
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
  
    const draw = () => {
      animationFrame = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray)
  
      ctx.fillStyle = 'rgb(200, 200, 200)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.beginPath()
  
      const sliceWidth = canvas.width * 1.0 / bufferLength
      let x = 0
  
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = v * canvas.height / 2
  
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
  
        x += sliceWidth
      }
  
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }
  
    draw()
  }
  
  // Timer functions
  const startTimer = () => {
    recordingInterval = setInterval(() => {
      recordingTime.value++
    }, 1000)
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // Handle close
  const handleClose = () => {
    if (isRecording.value) {
      stopRecording()
    }
    emit('update:modelValue', false)
    resetState()
  }
  
  // Handle submit
  const handleSubmit = () => {
    if (audioBlob.value) {
      emit('submit', audioBlob.value)
      emit('update:modelValue', false)
      resetState()
    }
  }
  
  // Reset state
  const resetState = () => {
    selectedDevice.value = ''
    isRecording.value = false
    isPaused.value = false
    recordingTime.value = 0
    audioBlob.value = null
    audioChunks = []
  }
  
  // Lifecycle hooks
  onMounted(() => {
    getAudioDevices()
  })
  
  onBeforeUnmount(() => {
    if (isRecording.value) {
      stopRecording()
    }
    audioContext?.close()
  })
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    min-width: 500px;
    max-width: 90%;
  }
  
  .device-select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .waveform-container {
    background-color: #f5f5f5;
    border-radius: 4px;
    margin: 1rem 0;
    padding: 10px;
  }
  
  .timer {
    text-align: center;
    font-size: 1.5rem;
    font-family: monospace;
    margin: 1rem 0;
  }
  
  .controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .record-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .pause-btn {
    background-color: #ffc107;
    color: black;
  }
  
  .resume-btn {
    background-color: #28a745;
    color: white;
  }
  
  .stop-btn {
    background-color: #6c757d;
    color: white;
  }
  
  .submit-btn {
    background-color: #007bff;
    color: white;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>