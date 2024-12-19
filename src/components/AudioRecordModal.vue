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
        <div class="waveform-container" :class="{
          'recording': isRecording && !isPaused,
          'paused': isPaused,
          'stopped': !isRecording
        }">
          <div class="recording-status" v-if="isRecording" :class="{ 'paused-status': isPaused }">
            <span class="blink">
              {{ isPaused ? 'PAUSED' : 'RECORDING' }}
            </span>
          </div>
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
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  
  const props = defineProps({
    modelValue: Boolean
  })
  
  const emit = defineEmits(['update:modelValue', 'submit'])
  
  const selectedDevice = ref(localStorage.getItem('lastAudioDevice') || '')
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
  let currentStream = null
  
  // Get available audio devices
  const getAudioDevices = async (stream) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const filteredDevices = devices.filter(device => device.kind === 'audioinput')
      audioDevices.value = filteredDevices
    } catch (error) {
      console.error('Error getting audio devices:', error)
    }
  }
  
  // Activate microphone
  const activateMicrophone = async () => {
    try {
      currentStream = await navigator.mediaDevices.getUserMedia({ 
        audio: { deviceId: selectedDevice.value || undefined } 
      })
      await getAudioDevices(currentStream)
      
      // Initialize audio context and analyser here
      audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(currentStream)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      
      // Start drawing the waveform
      drawWaveform()
      
      // Check if saved device still exists
      const savedDevice = selectedDevice.value
      if (savedDevice && !audioDevices.value.some(device => device.deviceId === savedDevice)) {
        selectedDevice.value = ''
        localStorage.removeItem('lastAudioDevice')
      }
    } catch (error) {
      console.error('Error activating microphone:', error)
    }
  }
  
  // Deactivate microphone
  const deactivateMicrophone = () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop())
      currentStream = null
    }
  }
  
  // Start recording
  const startRecording = async () => {
    try {
      // Stop existing stream if it exists
      if (currentStream) {
        deactivateMicrophone()
      }
      
      // Get new stream with selected device
      currentStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDevice.value }
      })
      
      // Reinitialize audio context and analyser
      audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(currentStream)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
  
      // Set up media recorder
      mediaRecorder = new MediaRecorder(currentStream)
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
  
      ctx.clearRect(0, 0, canvas.width, canvas.height)
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
      recordingTime.value += 0.01
    }, 10)
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const centisecs = Math.floor((seconds * 100) % 100)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`
  }
  
  // Handle close
  const handleClose = () => {
    if (isRecording.value) {
      stopRecording()
    }
    deactivateMicrophone()
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
    isRecording.value = false
    isPaused.value = false
    recordingTime.value = 0
    audioBlob.value = null
    audioChunks = []
  }
    
  onBeforeUnmount(() => {
    if (isRecording.value) {
      stopRecording()
    }
    deactivateMicrophone()
    audioContext?.close()
  })
  
  // Watch for modal open/close
  watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
      // Modal opens
      await activateMicrophone()
    } else {
      // Modal closes
      deactivateMicrophone()
    }
  })
  
  // Sauvegarder le device ID quand il change
  watch(selectedDevice, (newValue) => {
    if (newValue) {
      localStorage.setItem('lastAudioDevice', newValue)
    }
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
    position: relative;
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
    position: relative;
    border-radius: 4px;
    margin: 1rem 0;
    padding: 10px;
    transition: background-color 0.3s ease;
  }
  
  .waveform-container.stopped {
    background-color: #f5f5f5;
  }
  
  .waveform-container.recording {
    background-color: rgba(220, 53, 69, 0.1); /* Rouge léger pour l'enregistrement */
  }
  
  .waveform-container.paused {
    background-color: rgba(255, 193, 7, 0.1); /* Jaune léger pour la pause */
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
  
  .recording-status {
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: bold;
    color: #dc3545;
    z-index: 1;
  }
  
  .recording-status.paused-status {
    color: #ffc107; /* Couleur jaune */
  }
  
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
  
  .blink {
    animation: blink 1s step-start infinite;
  }
  </style>