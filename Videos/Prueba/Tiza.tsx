import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as cargarGochi} from '@remotion/google-fonts/GochiHand';
import {loadFont as cargarCabin} from '@remotion/google-fonts/CabinSketch';

// Tipografías: manuscrita redondeada (subtítulos, etiquetas) y "de tiza" (títulos)
export const {fontFamily: fuenteManuscrita} = cargarGochi('normal', {
	weights: ['400'],
	subsets: ['latin'],
});
export const {fontFamily: fuenteTiza} = cargarCabin('normal', {
	weights: ['700'],
	subsets: ['latin'],
});

// Colores de tiza en tonos pastel
export const COLOR = {
	blanco: '#f5f3ea',
	amarillo: '#f7e27c',
	rosa: '#f6a5bb',
	azul: '#a3d5f2',
	naranja: '#f9b46b',
	rojo: '#f2796b',
	verde: '#b9e68f',
	marron: '#d8a574',
	lila: '#c9b3f0',
};

// 0 → 1 entre `inicio` y `inicio + duracion` (en frames)
export const avance = (frame: number, inicio: number, duracion: number) =>
	interpolate(frame, [inicio, inicio + duracion], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.quad),
	});

// Path SVG de un círculo (para poder dibujarlo trazo a trazo)
export const circulo = (cx: number, cy: number, r: number) =>
	`M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

type TrazoProps = {
	readonly d: string;
	readonly color: string;
	readonly inicio: number;
	readonly duracion: number;
	readonly ancho?: number;
	readonly relleno?: string;
	readonly opacidadRelleno?: number;
};

// Un trazo de tiza que se dibuja poco a poco; el relleno aparece al terminar
export const Trazo: React.FC<TrazoProps> = ({
	d,
	color,
	inicio,
	duracion,
	ancho = 9,
	relleno,
	opacidadRelleno = 0.3,
}) => {
	const frame = useCurrentFrame();
	if (frame < inicio) {
		return null;
	}
	return (
		<>
			{relleno ? (
				<path
					d={d}
					fill={relleno}
					stroke="none"
					opacity={interpolate(
						frame,
						[inicio + duracion * 0.7, inicio + duracion + 8],
						[0, opacidadRelleno],
						{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
					)}
				/>
			) : null}
			<path
				d={d}
				fill="none"
				stroke={color}
				strokeWidth={ancho}
				strokeLinecap="round"
				strokeLinejoin="round"
				pathLength={1}
				strokeDasharray="1 1"
				strokeDashoffset={1 - avance(frame, inicio, duracion)}
			/>
		</>
	);
};

type RayadoProps = {
	readonly id: string;
	readonly forma: string;
	readonly color: string;
	readonly inicio: number;
	readonly duracion: number;
	readonly caja: [number, number, number, number]; // x0, y0, x1, y1
	readonly separacion?: number;
	readonly opacidad?: number;
};

// Sombreado a rayas diagonales dentro de una forma, como se rellena con tiza
export const Rayado: React.FC<RayadoProps> = ({
	id,
	forma,
	color,
	inicio,
	duracion,
	caja,
	separacion = 22,
	opacidad = 0.55,
}) => {
	const frame = useCurrentFrame();
	if (frame < inicio) {
		return null;
	}
	const [x0, y0, x1, y1] = caja;
	const alto = y1 - y0;
	const lineas: number[] = [];
	for (let x = x0 - alto; x <= x1; x += separacion) {
		lineas.push(x);
	}
	return (
		<>
			<clipPath id={id}>
				<path d={forma} />
			</clipPath>
			<g clipPath={`url(#${id})`} opacity={opacidad}>
				{lineas.map((x, i) => (
					<path
						key={x}
						d={`M${x} ${y1} L${x + alto} ${y0}`}
						stroke={color}
						strokeWidth={6}
						strokeLinecap="round"
						pathLength={1}
						strokeDasharray="1 1"
						strokeDashoffset={
							1 -
							avance(
								frame,
								inicio + (i / lineas.length) * duracion * 0.7,
								duracion * 0.3,
							)
						}
					/>
				))}
			</g>
		</>
	);
};

type EscritoProps = {
	readonly children: React.ReactNode;
	readonly inicio: number;
	readonly duracion: number;
	readonly style?: React.CSSProperties;
};

// Texto que se "escribe" de izquierda a derecha
export const Escrito: React.FC<EscritoProps> = ({
	children,
	inicio,
	duracion,
	style,
}) => {
	const frame = useCurrentFrame();
	const p = avance(frame, inicio, duracion);
	return (
		<div
			style={{
				position: 'absolute',
				fontFamily: fuenteTiza,
				filter: 'url(#tiza)',
				whiteSpace: 'nowrap',
				clipPath: `inset(-30% ${(1 - p) * 100}% -30% -5%)`,
				...style,
			}}
		>
			{children}
		</div>
	);
};

// Etiqueta manuscrita que aparece (y opcionalmente desaparece)
export const Etiqueta: React.FC<{
	readonly children: React.ReactNode;
	readonly inicio: number;
	readonly fin?: number;
	readonly style?: React.CSSProperties;
}> = ({children, inicio, fin = 99999, style}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				fontFamily: fuenteManuscrita,
				fontSize: 54,
				color: COLOR.blanco,
				filter: 'url(#tiza)',
				whiteSpace: 'nowrap',
				opacity: interpolate(frame, [inicio, inicio + 6, fin, fin + 6], [0, 1, 1, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				}),
				translate: `0px ${interpolate(frame, [inicio, inicio + 8], [12, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})}px`,
				...style,
			}}
		>
			{children}
		</div>
	);
};
