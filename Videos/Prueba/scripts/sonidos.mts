// Sintetiza la música de ukelele y los efectos de sonido (todo generado aquí,
// sin archivos de terceros) y los guarda como WAV en ../audio.
// Uso (desde la raíz del proyecto): node Videos/Prueba/scripts/sonidos.mts
import {writeFileSync} from 'node:fs';
import path from 'node:path';

const SR = 44100;
const audioDir = path.join(import.meta.dirname, '..', 'audio');

// generador aleatorio con semilla, para que el resultado sea siempre igual
let seed = 12345;
const rand = () => {
	seed = (seed * 1664525 + 1013904223) >>> 0;
	return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;

const guardarWav = (nombre: string, data: Float32Array, gain = 1) => {
	let peak = 0;
	for (const v of data) peak = Math.max(peak, Math.abs(v));
	const norm = peak > 0 ? gain / peak : 0;
	const buf = Buffer.alloc(44 + data.length * 2);
	buf.write('RIFF', 0);
	buf.writeUInt32LE(36 + data.length * 2, 4);
	buf.write('WAVEfmt ', 8);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20);
	buf.writeUInt16LE(1, 22);
	buf.writeUInt32LE(SR, 24);
	buf.writeUInt32LE(SR * 2, 28);
	buf.writeUInt16LE(2, 32);
	buf.writeUInt16LE(16, 34);
	buf.write('data', 36);
	buf.writeUInt32LE(data.length * 2, 40);
	data.forEach((v, i) => {
		buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * norm)) * 32767), 44 + i * 2);
	});
	writeFileSync(path.join(audioDir, nombre), buf);
	console.log(`${nombre}: ${(data.length / SR).toFixed(2)}s`);
};

// filtro paso banda (biquad)
const bandpass = (freq: number, q: number) => {
	const w = (2 * Math.PI * freq) / SR;
	const alpha = Math.sin(w) / (2 * q);
	const a0 = 1 + alpha;
	const b0 = alpha / a0;
	const b2 = -alpha / a0;
	const a1 = (-2 * Math.cos(w)) / a0;
	const a2 = (1 - alpha) / a0;
	let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
	return (x: number) => {
		const y = b0 * x + b2 * x2 - a1 * y1 - a2 * y2;
		x2 = x1; x1 = x; y2 = y1; y1 = y;
		return y;
	};
};
const lowpass = (freq: number) => {
	const a = 1 - Math.exp((-2 * Math.PI * freq) / SR);
	let y = 0;
	return (x: number) => (y += a * (x - y));
};

// ---------- Música: ukelele (cuerda pulsada Karplus-Strong) ----------
const pulsar = (out: Float32Array, start: number, freq: number, vol: number, brillo: number) => {
	const n = Math.round(SR / freq);
	const ring = new Float32Array(n);
	const lp = lowpass(brillo);
	for (let i = 0; i < n; i++) ring[i] = lp(noise());
	const len = Math.min(out.length - start, SR * 2);
	let idx = 0;
	for (let i = 0; i < len; i++) {
		const next = (idx + 1) % n;
		const v = ring[idx];
		ring[idx] = 0.996 * 0.5 * (ring[idx] + ring[next]);
		idx = next;
		out[start + i] += v * vol;
	}
};

const nota = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);
// acordes de ukelele (cuerdas G4 C4 E4 A4)
const acordes: Record<string, number[]> = {
	C: [67, 60, 64, 72],
	G: [67, 62, 71, 74],
	Am: [69, 60, 64, 69],
	F: [69, 60, 65, 69],
};
const progresion = ['C', 'G', 'Am', 'F'];
const duracionMusica = 22;
const bpm = 112;
const beat = 60 / bpm;
const musica = new Float32Array(SR * duracionMusica);
// rasgueo: abajo, abajo, arriba, arriba, abajo, arriba (en corcheas)
const patron: [number, 'd' | 'u'][] = [[0, 'd'], [1, 'd'], [1.5, 'u'], [2.5, 'u'], [3, 'd'], [3.5, 'u']];
for (let compas = 0; compas * 4 * beat < duracionMusica; compas++) {
	const acorde = acordes[progresion[compas % progresion.length]];
	for (const [pos, dir] of patron) {
		const t0 = (compas * 4 + pos) * beat;
		const cuerdas = dir === 'd' ? acorde : [...acorde].reverse();
		cuerdas.forEach((m, k) => {
			const t = t0 + k * 0.012 + rand() * 0.004;
			const i = Math.round(t * SR);
			if (i < musica.length) pulsar(musica, i, nota(m), dir === 'd' ? 0.9 : 0.6, 3500);
		});
	}
	// nota de bajo suave en el primer tiempo
	const raiz = acorde[1] - 12;
	pulsar(musica, Math.round(compas * 4 * beat * SR), nota(raiz), 0.5, 1200);
}
// fundido de entrada y salida
for (let i = 0; i < musica.length; i++) {
	const t = i / SR;
	musica[i] *= Math.min(1, t / 0.5, (duracionMusica - t) / 1.5);
}
guardarWav('musica-ukelele.wav', musica, 0.8);

// ---------- Tiza raspando ----------
const tiza = new Float32Array(Math.round(SR * 2.4));
{
	const bp1 = bandpass(2600, 1.2);
	const bp2 = bandpass(5200, 2);
	let t = 0;
	// varios trazos cortos con pequeñas pausas
	while (t < 2.2) {
		const dur = 0.18 + rand() * 0.25;
		const s = Math.round(t * SR);
		const e = Math.min(tiza.length, Math.round((t + dur) * SR));
		const chirp = 8 + rand() * 14; // vibración de la tiza
		for (let i = s; i < e; i++) {
			const p = (i - s) / (e - s);
			const env = Math.sin(Math.PI * p) ** 0.6;
			const grano = 0.6 + 0.4 * Math.sin((2 * Math.PI * chirp * (i - s)) / SR) + 0.3 * noise();
			const x = noise();
			tiza[i] += (bp1(x) * 0.8 + bp2(x) * 0.4) * env * grano;
		}
		t += dur + 0.05 + rand() * 0.12;
	}
}
guardarWav('tiza.wav', tiza, 0.7);

// ---------- Borrador (barrido suave) ----------
const borrador = new Float32Array(Math.round(SR * 0.6));
{
	const bp = bandpass(900, 0.7);
	for (let i = 0; i < borrador.length; i++) {
		const p = i / borrador.length;
		const env = Math.sin(Math.PI * p) ** 1.5;
		borrador[i] = bp(noise()) * env * (0.7 + 0.3 * Math.sin(2 * Math.PI * 18 * p));
	}
}
guardarWav('borrador.wav', borrador, 0.6);

// ---------- Burbujas y efervescencia ----------
const burbujas = new Float32Array(Math.round(SR * 5));
{
	// burbujas: pequeños "blop" con tono ascendente
	for (let k = 0; k < 70; k++) {
		const t = Math.pow(rand(), 0.7) * 4.3;
		const s = Math.round(t * SR);
		const f0 = 300 + rand() * 900;
		const dur = 0.04 + rand() * 0.08;
		const n = Math.round(dur * SR);
		let fase = 0;
		const vol = 0.4 + rand() * 0.6;
		for (let i = 0; i < n && s + i < burbujas.length; i++) {
			const p = i / n;
			fase += (2 * Math.PI * f0 * (1 + 1.8 * p)) / SR;
			burbujas[s + i] += Math.sin(fase) * Math.exp(-5 * p) * vol;
		}
	}
	// efervescencia: siseo agudo con crepitar
	const bp = bandpass(6500, 0.8);
	for (let i = 0; i < burbujas.length; i++) {
		const t = i / SR;
		const env = Math.min(1, t / 0.15) * Math.max(0, 1 - t / 5) ** 0.8;
		const crepitar = rand() < 0.02 ? 3 : 1;
		burbujas[i] += bp(noise()) * 0.5 * env * crepitar;
	}
}
guardarWav('burbujas.wav', burbujas, 0.8);

// ---------- Aplausos de niño ----------
const aplausos = new Float32Array(Math.round(SR * 1.6));
{
	const bp = bandpass(1400, 0.9);
	for (let k = 0; k < 6; k++) {
		const s = Math.round((0.05 + k * 0.24 + rand() * 0.02) * SR);
		const n = Math.round(0.06 * SR);
		for (let i = 0; i < n && s + i < aplausos.length; i++) {
			aplausos[s + i] += bp(noise()) * Math.exp((-i / n) * 6);
		}
	}
}
guardarWav('aplausos.wav', aplausos, 0.7);
