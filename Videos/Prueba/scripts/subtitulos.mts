// Mide con Whisper (en la GPU, en local) cuándo se dice cada palabra de cada
// narración y lo guarda en audio/subtitulos.json en formato Caption de Remotion.
// Uso (desde la raíz del proyecto): node Videos/Prueba/scripts/subtitulos.mts
import {registerMediabunnyServer} from '@mediabunny/server';
import {
	WHISPER_WEBGPU_SAMPLE_RATE,
	canUseWhisperWebGpu,
	disposeWhisperModel,
	downloadWhisperModel,
	loadWhisperModel,
	toCaptions,
	transcribe,
} from '@remotion/whisper-webgpu';
import {
	ALL_FORMATS,
	Conversion,
	FilePathSource,
	Input,
	NullTarget,
	Output,
	WavOutputFormat,
} from 'mediabunny';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';

registerMediabunnyServer();

const audioDir = path.join(import.meta.dirname, '..', 'audio');
const archivos = [1, 2, 3, 4, 5].map((n) => `narracion-${n}.wav`);

const support = await canUseWhisperWebGpu();
if (!support.supported) {
	throw new Error(support.detailedReason);
}

const decodificar = async (archivo: string) => {
	const chunks: {startFrame: number; waveform: Float32Array}[] = [];
	const input = new Input({
		formats: ALL_FORMATS,
		source: new FilePathSource(archivo),
	});
	const audioTrack = await input.getPrimaryAudioTrack();
	if (audioTrack === null) {
		throw new Error(`${archivo} no tiene pista de audio`);
	}
	const conversion = await Conversion.init({
		input,
		output: new Output({format: new WavOutputFormat(), target: new NullTarget()}),
		video: {discard: true},
		audio: (track) => {
			if (track.id !== audioTrack.id) {
				return {discard: true};
			}
			return {
				codec: 'pcm-f32',
				forceTranscode: true,
				numberOfChannels: 1,
				sampleFormat: 'f32',
				sampleRate: WHISPER_WEBGPU_SAMPLE_RATE,
				process: (sample) => {
					const waveform = new Float32Array(
						sample.allocationSize({format: 'f32', planeIndex: 0}) /
							Float32Array.BYTES_PER_ELEMENT,
					);
					sample.copyTo(waveform, {format: 'f32', planeIndex: 0});
					chunks.push({
						startFrame: Math.round(sample.timestamp * WHISPER_WEBGPU_SAMPLE_RATE),
						waveform,
					});
					return sample;
				},
			};
		},
	});
	if (!conversion.isValid) {
		throw new Error(`No se pudo decodificar ${archivo}`);
	}
	await conversion.execute();
	input.dispose?.();

	const length = chunks.reduce(
		(max, c) => Math.max(max, c.startFrame + c.waveform.length),
		0,
	);
	const out = new Float32Array(length);
	for (const c of chunks) {
		out.set(c.waveform.subarray(0, Math.min(c.waveform.length, length - c.startFrame)), Math.max(0, c.startFrame));
	}
	return out;
};

const model = 'small';
await downloadWhisperModel({model});
await loadWhisperModel({model});

const resultado: Record<string, unknown> = {};
for (const archivo of archivos) {
	const channelWaveform = await decodificar(path.join(audioDir, archivo));
	const transcription = await transcribe({channelWaveform, model, language: 'es'});
	const {captions} = toCaptions({whisperWebGpuOutput: transcription});
	resultado[archivo] = captions;
	console.log(
		archivo,
		captions.map((c) => `${c.text.trim()}@${c.startMs}-${c.endMs}`).join(' '),
	);
}
await disposeWhisperModel({model});

await writeFile(
	path.join(audioDir, 'subtitulos.json'),
	JSON.stringify(resultado, null, 2),
);
