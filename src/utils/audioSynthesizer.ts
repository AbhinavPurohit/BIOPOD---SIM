/**
 * Synthesizes subtle, realistic hardware acoustics for BioPod:
 * - Airflow Fan pink-noise whisper
 * - Algae bioreactor micro-bubble effervescence
 * - Crisp tactile relay click on button toggles
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private fanGain: GainNode | null = null;
  private bubbleGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlayingFan = false;
  private bubbleInterval: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.2)), this.ctx.currentTime);
    }
  }

  public playClick() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context might be restricted
    }
  }

  public playBubblePop() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const freq = 700 + Math.random() * 500;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq + 400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.03 + Math.random() * 0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Audio context ignored
    }
  }

  public updateAcoustics(fanSpeedPct: number, pumpActive: boolean, soundEnabled: boolean) {
    if (!soundEnabled) {
      this.stopAcoustics();
      return;
    }

    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Start bubbling timer if pump is active
      if (pumpActive && !this.bubbleInterval) {
        this.bubbleInterval = window.setInterval(() => {
          if (Math.random() > 0.4) {
            this.playBubblePop();
          }
        }, 180);
      } else if (!pumpActive && this.bubbleInterval) {
        window.clearInterval(this.bubbleInterval);
        this.bubbleInterval = null;
      }
    } catch {
      // ignore
    }
  }

  public stopAcoustics() {
    if (this.bubbleInterval) {
      window.clearInterval(this.bubbleInterval);
      this.bubbleInterval = null;
    }
  }
}

export const audioSynth = new AudioSynthesizer();
