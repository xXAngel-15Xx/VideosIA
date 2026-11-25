import React from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Karaoke} from './Karaoke';
import {Pizarra} from './Pizarra';
import {Escena1, Escena2, Escena3, Escena4, Escena5} from './Escenas';
import narracion1 from './audio/narracion-1.wav';
import narracion2 from './audio/narracion-2.wav';
import narracion3 from './audio/narracion-3.wav';
import narracion4 from './audio/narracion-4.wav';
import narracion5 from './audio/narracion-5.wav';
import musica from './audio/musica-ukelele.wav';
import tiza from './audio/tiza.wav';
import borrador from './audio/borrador.wav';
import burbujas from './audio/burbujas.wav';
import aplausos from './audio/aplausos.wav';

// Duración de cada escena en segundos (se ajustó a lo que dura cada narración)
export const DURACIONES = [4, 5, 4, 3.4, 5];
const BORRADO = 12; // frames que dura el borrado entre escenas
const RETRASO_VOZ = 6; // frames entre el inicio de la escena y la narración

// Borra el contenido de la escena con un borrador al final
const Borrable: React.FC<{readonly duracion: number; readonly children: React.ReactNode}> = ({
	duracion,
	children,
}) => {
	const frame = useCurrentFrame();
	const inicio = duracion - BORRADO;
	const p = interpolate(frame, [inicio, duracion], [-15, 115], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const borrando = frame >= inicio;
	const mascara = `linear-gradient(to right, transparent ${p - 14}%, black ${p}%)`;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={borrando ? {maskImage: mascara, WebkitMaskImage: mascara} : undefined}>
				{children}
			</AbsoluteFill>
			{borrando ? (
				<div
					style={{
						position: 'absolute',
						left: (p / 100) * 1080 - 70,
						top: 900 + 650 * Math.sin((frame - inicio) * 1.4),
						width: 130,
						height: 250,
						borderRadius: 14,
						rotate: '8deg',
						background: 'linear-gradient(to right, #b98352 0 65%, #6f6f6f 65% 100%)',
						boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
					}}
				/>
			) : null}
		</AbsoluteFill>
	);
};

export const VolcanVideo: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	const [d1, d2, d3, d4, d5] = DURACIONES.map((s) => Math.round(s * fps));
	const inicio2 = d1;
	const inicio3 = inicio2 + d2;
	const inicio4 = inicio3 + d3;
	const inicio5 = inicio4 + d4;

	return (
		<AbsoluteFill>
			<Pizarra />

			<Sequence name="1 · ¡Hagamos un volcán!" from={0} durationInFrames={d1}>
				<Borrable duracion={d1}>
					<Escena1 />
					<Sequence name="Subtítulos 1" from={RETRASO_VOZ}>
						<Karaoke
							palabras={[
								{text: '¡Hola!', startMs: 320, endMs: 1300, timestampMs: 810, confidence: null},
								{text: ' Hoy', startMs: 1520, endMs: 1800, timestampMs: 1660, confidence: null},
								{text: ' vamos', startMs: 1800, endMs: 1980, timestampMs: 1890, confidence: null},
								{text: ' a', startMs: 1980, endMs: 2220, timestampMs: 2100, confidence: null},
								{text: ' hacer', startMs: 2220, endMs: 2340, timestampMs: 2280, confidence: null},
								{text: ' un', startMs: 2340, endMs: 2520, timestampMs: 2430, confidence: null},
								{text: ' volcán.', startMs: 2520, endMs: 3300, timestampMs: 2660, confidence: null},
							]}
						/>
					</Sequence>
				</Borrable>
				<Audio name="Narración 1" src={narracion1} from={RETRASO_VOZ} />
				<Audio name="Tiza 1" src={tiza} from={4} durationInFrames={90} loop volume={0.22} />
				<Audio name="Borrador 1" src={borrador} from={d1 - BORRADO} volume={0.4} />
			</Sequence>

			<Sequence name="2 · Materiales" from={inicio2} durationInFrames={d2}>
				<Borrable duracion={d2}>
					<Escena2 />
					<Sequence name="Subtítulos 2" from={RETRASO_VOZ}>
						<Karaoke
							palabras={[
								{text: 'Necesitas', startMs: 240, endMs: 780, timestampMs: 510, confidence: null},
								{text: ' una', startMs: 780, endMs: 980, timestampMs: 880, confidence: null},
								{text: ' botella,', startMs: 980, endMs: 1600, timestampMs: 1290, confidence: null},
								{text: ' plastilina,', startMs: 1840, endMs: 2560, timestampMs: 2200, confidence: null},
								{text: ' bicarbonato', startMs: 2680, endMs: 3240, timestampMs: 2960, confidence: null},
								{text: ' y', startMs: 3240, endMs: 3360, timestampMs: 3300, confidence: null},
								{text: ' vinagre.', startMs: 3360, endMs: 4100, timestampMs: 3480, confidence: null},
							]}
						/>
					</Sequence>
				</Borrable>
				<Audio name="Narración 2" src={narracion2} from={RETRASO_VOZ} />
				<Audio name="Tiza 2" src={tiza} from={12} durationInFrames={124} loop volume={0.2} />
				<Audio name="Borrador 2" src={borrador} from={d2 - BORRADO} volume={0.4} />
			</Sequence>

			<Sequence name="3 · Paso 1" from={inicio3} durationInFrames={d3}>
				<Borrable duracion={d3}>
					<Escena3 />
					<Sequence name="Subtítulos 3" from={RETRASO_VOZ}>
						<Karaoke
							palabras={[
								{text: 'Primero,', startMs: 460, endMs: 1160, timestampMs: 810, confidence: null},
								{text: ' cubre', startMs: 1420, endMs: 1620, timestampMs: 1520, confidence: null},
								{text: ' la', startMs: 1620, endMs: 1800, timestampMs: 1710, confidence: null},
								{text: ' botella', startMs: 1800, endMs: 2200, timestampMs: 2000, confidence: null},
								{text: ' con', startMs: 2200, endMs: 2440, timestampMs: 2320, confidence: null},
								{text: ' plastilina.', startMs: 2440, endMs: 3400, timestampMs: 2720, confidence: null},
							]}
						/>
					</Sequence>
				</Borrable>
				<Audio name="Narración 3" src={narracion3} from={RETRASO_VOZ} />
				<Audio name="Tiza 3" src={tiza} from={8} durationInFrames={82} loop volume={0.22} />
				<Audio name="Borrador 3" src={borrador} from={d3 - BORRADO} volume={0.4} />
			</Sequence>

			<Sequence name="4 · Paso 2" from={inicio4} durationInFrames={d4}>
				<Borrable duracion={d4}>
					<Escena4 />
					<Sequence name="Subtítulos 4" from={RETRASO_VOZ}>
						<Karaoke
							palabras={[
								{text: 'Luego,', startMs: 360, endMs: 820, timestampMs: 590, confidence: null},
								{text: ' agrega', startMs: 980, endMs: 1240, timestampMs: 1110, confidence: null},
								{text: ' bicarbonato', startMs: 1240, endMs: 1840, timestampMs: 1540, confidence: null},
								{text: ' y', startMs: 1840, endMs: 2000, timestampMs: 1920, confidence: null},
								{text: ' colorante.', startMs: 2000, endMs: 2900, timestampMs: 2160, confidence: null},
							]}
						/>
					</Sequence>
				</Borrable>
				<Audio name="Narración 4" src={narracion4} from={RETRASO_VOZ} />
				<Audio name="Tiza 4" src={tiza} from={0} durationInFrames={24} volume={0.2} />
				<Audio name="Borrador 4" src={borrador} from={d4 - BORRADO} volume={0.4} />
			</Sequence>

			<Sequence name="5 · ¡Erupción!" from={inicio5} durationInFrames={d5}>
				<Escena5 />
				<Sequence name="Subtítulos 5" from={RETRASO_VOZ}>
					<Karaoke
						palabras={[
							{text: '¡Echa', startMs: 320, endMs: 540, timestampMs: 430, confidence: null},
							{text: ' el', startMs: 540, endMs: 720, timestampMs: 630, confidence: null},
							{text: ' vinagre', startMs: 720, endMs: 1200, timestampMs: 960, confidence: null},
							{text: ' y…', startMs: 1200, endMs: 1660, timestampMs: 1420, confidence: null},
							{text: ' ¡erupción!', startMs: 1860, endMs: 3000, timestampMs: 1930, confidence: null},
						]}
					/>
				</Sequence>
				<Audio name="Narración 5" src={narracion5} from={RETRASO_VOZ} />
				<Audio name="Tiza 5" src={tiza} from={0} durationInFrames={16} volume={0.2} />
				<Audio name="Burbujas" src={burbujas} from={52} volume={0.55} />
				<Audio name="Tiza niño" src={tiza} from={68} durationInFrames={24} volume={0.18} />
				<Audio name="Aplausos" src={aplausos} from={94} volume={0.5} />
				<Audio name="Aplausos 2" src={aplausos} from={130} durationInFrames={20} volume={0.35} />
			</Sequence>

			<Audio
				name="Música ukelele"
				src={musica}
				volume={(f) =>
					interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 0.18, 0.18, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					})
				}
			/>
		</AbsoluteFill>
	);
};
