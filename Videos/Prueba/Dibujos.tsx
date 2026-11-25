import React from 'react';
import {circulo, COLOR, Rayado, Trazo} from './Tiza';

// Dibujos de tiza reutilizables. Cada uno se dibuja trazo a trazo a partir
// del frame `inicio` y tarda `d` frames. Coordenadas locales centradas en (0, 0).

type DibujoProps = {readonly inicio: number; readonly d?: number};

// ---------- Volcán (caja local 0..620 x 0..446) ----------
export const VOLCAN = {
	cuerpo: 'M0 440 C70 300 150 140 200 30 Q310 0 420 30 C470 140 550 300 620 440 Z',
	crater: 'M200 30 Q310 70 420 30',
	suelo: 'M-70 446 L690 446',
	lava: 'M212 38 Q228 92 246 60 Q262 112 282 56 Q302 102 322 58 Q346 122 366 56 Q386 96 408 40',
};

export const Volcan: React.FC<
	DibujoProps & {readonly id: string; readonly cara?: boolean; readonly color?: string}
> = ({inicio, d = 50, id, cara = false, color = COLOR.marron}) => (
	<>
		<Trazo d={VOLCAN.suelo} color={COLOR.blanco} ancho={7} inicio={inicio} duracion={d * 0.2} />
		<Rayado
			id={id}
			forma={VOLCAN.cuerpo}
			color={color}
			caja={[-10, 0, 630, 446]}
			inicio={inicio + d * 0.35}
			duracion={d * 0.5}
		/>
		<Trazo d={VOLCAN.cuerpo} color={cara ? COLOR.blanco : color} ancho={10} inicio={inicio + d * 0.1} duracion={d * 0.4} />
		<Trazo d={VOLCAN.crater} color={COLOR.blanco} ancho={8} inicio={inicio + d * 0.45} duracion={d * 0.15} />
		{cara ? (
			<>
				<Trazo d={VOLCAN.lava} color={COLOR.naranja} ancho={10} inicio={inicio + d * 0.55} duracion={d * 0.2} relleno={COLOR.naranja} opacidadRelleno={0.5} />
				<Trazo d={circulo(250, 220, 13)} color={COLOR.blanco} ancho={12} inicio={inicio + d * 0.7} duracion={d * 0.06} relleno={COLOR.blanco} opacidadRelleno={1} />
				<Trazo d={circulo(370, 220, 13)} color={COLOR.blanco} ancho={12} inicio={inicio + d * 0.74} duracion={d * 0.06} relleno={COLOR.blanco} opacidadRelleno={1} />
				<Trazo d="M255 285 Q310 345 365 285" color={COLOR.blanco} ancho={10} inicio={inicio + d * 0.8} duracion={d * 0.1} />
				<Trazo d={circulo(205, 275, 24)} color={COLOR.rosa} ancho={6} inicio={inicio + d * 0.88} duracion={d * 0.06} relleno={COLOR.rosa} opacidadRelleno={0.6} />
				<Trazo d={circulo(415, 275, 24)} color={COLOR.rosa} ancho={6} inicio={inicio + d * 0.9} duracion={d * 0.06} relleno={COLOR.rosa} opacidadRelleno={0.6} />
			</>
		) : null}
	</>
);

// ---------- Materiales ----------
export const Botella: React.FC<DibujoProps> = ({inicio, d = 18}) => (
	<>
		<Trazo d="M-60 120 L-60 -20 Q-60 -60 -25 -80 L-25 -130 L25 -130 L25 -80 Q60 -60 60 -20 L60 120 Q60 135 45 135 L-45 135 Q-60 135 -60 120 Z" color={COLOR.azul} inicio={inicio} duracion={d * 0.7} relleno={COLOR.azul} opacidadRelleno={0.18} />
		<Trazo d="M-32 -130 L-32 -152 L32 -152 L32 -130" color={COLOR.blanco} inicio={inicio + d * 0.65} duracion={d * 0.2} />
		<Trazo d="M-38 -15 L-38 95" color={COLOR.blanco} ancho={6} inicio={inicio + d * 0.8} duracion={d * 0.2} />
	</>
);

export const Plastilina: React.FC<DibujoProps> = ({inicio, d = 18}) => (
	<>
		<Trazo d="M-105 125 C-115 70 -70 40 -25 50 C5 15 70 20 85 60 C125 70 120 125 95 130 Z" color={COLOR.marron} inicio={inicio} duracion={d * 0.5} relleno={COLOR.marron} opacidadRelleno={0.45} />
		<Trazo d={circulo(-45, -35, 46)} color={COLOR.verde} inicio={inicio + d * 0.4} duracion={d * 0.3} relleno={COLOR.verde} opacidadRelleno={0.4} />
		<Trazo d={circulo(50, -50, 36)} color={COLOR.lila} inicio={inicio + d * 0.6} duracion={d * 0.3} relleno={COLOR.lila} opacidadRelleno={0.4} />
		<Trazo d="M-70 100 Q-30 80 10 105" color={COLOR.blanco} ancho={5} inicio={inicio + d * 0.85} duracion={d * 0.15} />
	</>
);

export const Bicarbonato: React.FC<DibujoProps> = ({inicio, d = 18}) => (
	<>
		<Trazo d="M-75 -105 L75 -105 L75 135 L-75 135 Z" color={COLOR.blanco} inicio={inicio} duracion={d * 0.5} relleno={COLOR.blanco} opacidadRelleno={0.12} />
		<Trazo d="M-75 -105 L-50 -140 L100 -140 L75 -105 M75 135 L100 105 L100 -140" color={COLOR.blanco} ancho={7} inicio={inicio + d * 0.45} duracion={d * 0.25} />
		<Trazo d="M-75 -25 L75 -25 L75 55 L-75 55 Z" color={COLOR.azul} ancho={7} inicio={inicio + d * 0.65} duracion={d * 0.2} relleno={COLOR.azul} opacidadRelleno={0.35} />
		<Trazo d="M-40 15 L40 15" color={COLOR.blanco} ancho={8} inicio={inicio + d * 0.85} duracion={d * 0.15} />
	</>
);

export const Vinagre: React.FC<DibujoProps> = ({inicio, d = 18}) => (
	<>
		<Trazo d="M-45 135 L-45 -25 Q-45 -55 -18 -72 L-18 -140 L18 -140 L18 -72 Q45 -55 45 -25 L45 135 Z" color={COLOR.blanco} inicio={inicio} duracion={d * 0.6} />
		<Trazo d="M-45 15 L45 15 L45 135 L-45 135 Z" color={COLOR.amarillo} ancho={6} inicio={inicio + d * 0.55} duracion={d * 0.25} relleno={COLOR.amarillo} opacidadRelleno={0.45} />
		<Trazo d="M-24 -140 L-24 -162 L24 -162 L24 -140" color={COLOR.rojo} inicio={inicio + d * 0.8} duracion={d * 0.2} />
	</>
);

export const Colorante: React.FC<DibujoProps & {readonly gota?: boolean}> = ({inicio, d = 18, gota = true}) => (
	<>
		<Trazo d="M-42 135 L-42 15 Q-42 -12 -18 -15 L18 -15 Q42 -12 42 15 L42 135 Z" color={COLOR.blanco} inicio={inicio} duracion={d * 0.45} />
		<Trazo d="M-42 60 L42 60 L42 135 L-42 135 Z" color={COLOR.rojo} ancho={6} inicio={inicio + d * 0.4} duracion={d * 0.25} relleno={COLOR.rojo} opacidadRelleno={0.55} />
		<Trazo d="M-16 -15 L-16 -60 Q0 -105 16 -60 L16 -15" color={COLOR.rojo} inicio={inicio + d * 0.6} duracion={d * 0.2} />
		{gota ? (
			<Trazo d="M80 -60 C62 -30 66 -12 80 -12 C94 -12 98 -30 80 -60 Z" color={COLOR.rojo} ancho={6} inicio={inicio + d * 0.8} duracion={d * 0.2} relleno={COLOR.rojo} opacidadRelleno={0.7} />
		) : null}
	</>
);

export const Jabon: React.FC<DibujoProps> = ({inicio, d = 18}) => (
	<>
		<Trazo d="M-55 135 L-55 -15 Q-55 -48 -25 -48 L25 -48 Q55 -48 55 -15 L55 135 Z" color={COLOR.rosa} inicio={inicio} duracion={d * 0.45} relleno={COLOR.rosa} opacidadRelleno={0.3} />
		<Trazo d="M-15 -48 L-15 -80 L15 -80 L15 -48 M-28 -80 L28 -80 M0 -80 L0 -112 L48 -112 L48 -100" color={COLOR.blanco} ancho={7} inicio={inicio + d * 0.45} duracion={d * 0.25} />
		<Trazo d={circulo(80, -140, 18)} color={COLOR.azul} ancho={5} inicio={inicio + d * 0.7} duracion={d * 0.1} />
		<Trazo d={circulo(108, -96, 12)} color={COLOR.azul} ancho={5} inicio={inicio + d * 0.78} duracion={d * 0.1} />
		<Trazo d={circulo(64, -186, 10)} color={COLOR.azul} ancho={5} inicio={inicio + d * 0.86} duracion={d * 0.1} />
	</>
);

export const Cuchara: React.FC<DibujoProps> = ({inicio, d = 10}) => (
	<>
		<Trazo d="M-50 0 C-50 -30 50 -30 50 0 C50 30 -50 30 -50 0 Z" color={COLOR.blanco} inicio={inicio} duracion={d * 0.6} />
		<Trazo d="M-50 -2 L-220 -60" color={COLOR.marron} ancho={12} inicio={inicio + d * 0.5} duracion={d * 0.5} />
		<Trazo d="M-38 -6 C-30 -26 30 -26 38 -6 Z" color={COLOR.blanco} ancho={4} inicio={inicio + d * 0.6} duracion={d * 0.3} relleno={COLOR.blanco} opacidadRelleno={0.9} />
	</>
);

// Flecha curva con punta
export const Flecha: React.FC<DibujoProps & {readonly linea: string; readonly punta: string; readonly color?: string}> = ({
	inicio,
	d = 14,
	linea,
	punta,
	color = COLOR.amarillo,
}) => (
	<>
		<Trazo d={linea} color={color} ancho={10} inicio={inicio} duracion={d * 0.75} />
		<Trazo d={punta} color={color} ancho={10} inicio={inicio + d * 0.7} duracion={d * 0.3} />
	</>
);
