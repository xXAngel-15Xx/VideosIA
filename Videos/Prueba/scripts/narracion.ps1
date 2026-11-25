# Genera la narración (un WAV por escena) con la voz española de Windows.
# Los tiempos de cada palabra NO salen de aquí (los de Windows no son fiables):
# se miden después sobre el audio con scripts/subtitulos.mts (Whisper).
#
# Uso: powershell -ExecutionPolicy Bypass -File Videos\Prueba\scripts\narracion.ps1

Add-Type -AssemblyName System.Speech

$root = Split-Path -Parent $PSScriptRoot
$audioDir = Join-Path $root 'audio'
New-Item -ItemType Directory -Force $audioDir | Out-Null

# rate: velocidad de la voz (-10 a 10; 0 = normal, negativo = más lento)
$lineas = @(
  @{ id = 1; rate = -1; texto = '¡Hola! Hoy vamos a hacer un volcán.' },
  @{ id = 2; rate = 1;  texto = 'Necesitas una botella, plastilina, bicarbonato y vinagre.' },
  @{ id = 3; rate = 0;  texto = 'Primero, cubre la botella con plastilina.' },
  @{ id = 4; rate = 1;  texto = 'Luego, agrega bicarbonato y colorante.' },
  @{ id = 5; rate = -2; texto = '¡Echa el vinagre y… erupción!' }
)

foreach ($l in $lineas) {
  $wav = Join-Path $audioDir ("narracion-{0}.wav" -f $l.id)
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoice('Microsoft Helena Desktop')
  $synth.Rate = $l.rate
  $synth.SetOutputToWaveFile($wav)
  # pitch un poco más agudo para un tono más alegre
  $synth.SpeakSsml("<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='es-ES'><prosody pitch='+12%'>$($l.texto)</prosody></speak>")
  $synth.SetOutputToNull()
  $synth.Dispose()
  $dur = ((Get-Item $wav).Length - 44) / (22050 * 2)
  Write-Host ("Escena {0}: {1:N2}s  {2}" -f $l.id, $dur, $l.texto)
}
